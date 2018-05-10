from django.db.models.query import QuerySet
from django.db.models import Model
from django.forms.models import model_to_dict as inbuilt_model_to_dict

def get_success_packet():
	obj = {}
	obj['status'] = "200"
	obj['message'] = "success"
	return obj


def get_error_packet():
		obj = {}
		obj['status'] = "500"
		obj['message'] = "error"
		obj['reason'] = "error"
		return obj


def get_bad_packet():
		obj = {}
		obj['status'] = "400"
		obj['message'] = "Bad Request"
		obj['reason'] = "Bad Request"
		return obj


def model_to_dict(instance, fields=None):
	"""
		Simple hack to get nested serializer working.
	"""
	def process_dict(instance, dictObject):
		return_object = {}
		allfields = instance._meta.get_fields()
		for field in allfields:
			if field.name in dictObject:
				fieldtype = field.get_internal_type()
				if fieldtype == "ForeignKey" or fieldtype == "OneToOneField":
					keyInstance = getattr(instance, field.name)
					if keyInstance is None:
						return_object[field.name] = None
					else:
						foreignkeyObject = run_include(keyInstance, dictObject[field.name])
						return_object[field.name] = foreignkeyObject
				elif fieldtype == "ManyToManyField":
					keyInstance = getattr(instance, field.name)
					queryset = keyInstance.all()
					return_object[field.name] = queryset_to_list(queryset, fields=dictObject[field.name])
		return return_object
	
	def run_include(instance, included_fields):
		return_data = {}
		if included_fields is not None:
			concrete_field_values = instance._meta.concrete_fields
			included_concrete_fields = [f.name for f in concrete_field_values if
										f.name in included_fields]
			return_data = inbuilt_model_to_dict(instance, fields=included_concrete_fields)
			for keyfield in included_fields:
				if isinstance(keyfield, dict):
					valueObject = process_dict(instance, keyfield)
					return_data = dict(return_data, **valueObject)
				elif keyfield not in return_data:
					# Ensuring properties get evaluated
					try:
						return_data[keyfield] = getattr(instance, keyfield)
					except:
						return_data[keyfield] = None
		return return_data
	
	if not instance:
		return None
	if fields is not None:
		return_obj = run_include(instance, fields)
	else:
		return_obj = inbuilt_model_to_dict(instance)
	
	if return_obj.get('id', None) == 0:
		del return_obj['id']
	return return_obj


def queryset_to_list(queryset, fields=None):
	list = []
	if isinstance(queryset, QuerySet):
		queryset = queryset.iterator()  # Just saving memory,works as queryset are lazy.
	for instance in queryset:
		list.append(model_to_dict(instance, fields=fields))
	return list
