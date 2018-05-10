from random import randint

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.utils import IntegrityError
from django.views import View
from django.http.response import JsonResponse, HttpResponseNotFound, \
	HttpResponseForbidden, HttpResponse
from django.http.response import HttpResponseBadRequest
import json
from django.db.models import Q
from app.api.utils import get_bad_packet, get_success_packet
from app.api.error_response import handling_exception_response, permission_denied
from app.eform.models import ApplicationForm, ApplicationCorrespondanceAddress, ApplicationRelatedPerson, Attestation
from app.api.utils import model_to_dict, queryset_to_list
from app.eform.serializer import APPLICATION_FORM_SERIALIZER_FIELDS, APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS, \
	APPLICATION_CORRESPONDANCE_SERIALIZER_FIELDS
from app.core.utils import ProtectedView
from app.eform.utils import get_application_form_supporting_data
from app.kyc.models import UserKYC, CorrespondanceAddress, RelatedPerson
import choices
from app.kyc.serializer import KYC_CORRESPONDANCE_SERIALIZER_FIELDS, KYC_RELATED_PERSON_SERIALIZER_FIELDS


class ApplicationFormList(ProtectedView):
	http_method_names = ['get', 'post']
	
	def get(self, request):
		try:
			response_object = get_success_packet()
			error_obj = get_bad_packet()
			show_all = request.GET.get('show_all', False)
			params = json.loads(json.dumps(request.GET))
			
			"""
			Currently we do not have any great logic, any employee gets to see all inprogress application form 
			Client/User can see his own application forms
			"""
			
			if show_all and request.user.is_employee:
				# Select_related of attestation, because we want to show attestation remarks in list
				application_forms = ApplicationForm.active_objects.employee_access_forms(request.user)
			else:
				application_forms = ApplicationForm.active_objects.filter(user=request.user).prefetch_related(
					"attestation")
			
			"""
			Using custom simple(Not a stable paginator pattern) pagination stratergy.
			"""
			paginated_data = ApplicationForm.do_paginate(application_forms, params)
			response_object["data"] = queryset_to_list(paginated_data["data"],
													   fields=APPLICATION_FORM_SERIALIZER_FIELDS)
			response_object["paginate_info"] = paginated_data["paginate_info"]
			return JsonResponse(response_object)
		
		except Exception as e:
			return handling_exception_response(request, e)
	
	@transaction.atomic()
	def post(self, request):
		try:
			with transaction.atomic():
				response_object = get_success_packet()
				error_obj = get_bad_packet()
				params = json.loads(request.body)
				related_persons = params.pop("related_persons", [])
				correspondance_addresses = params.pop("correspondance_addresses", [])
				if len(correspondance_addresses) == 0:  # Atleast one correspondance address needed
					error_obj["reason"] = "Atleast one correspondance Address is needed"
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				
				# Sanitizing
				params = {k: params[k] for k in ApplicationForm.basic_fields() if k in params}
				form = ApplicationForm(**params)
				form.user = request.user
				try:
					form.full_clean()
				except ValidationError as e:
					error_obj['errors'] = dict(e)
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				form.save()
				
				for correspondance_address in correspondance_addresses:
					# Sanitizing
					correspondance_address = {k: correspondance_address[k] for k in
											  ApplicationCorrespondanceAddress.basic_fields() if
											  k in correspondance_address}
					caObject = ApplicationCorrespondanceAddress(**correspondance_address)
					caObject.user = request.user
					try:
						caObject.full_clean()
					except ValidationError as e:
						error_obj['errors'] = {}
						error_obj['errors']['correspondance_addresses'] = dict(e)
						if '__all__' in error_obj['errors']['correspondance_addresses']:
							error_obj['errors']['__all__'] = error_obj['errors']['correspondance_addresses']['__all__']
						transaction.set_rollback(True)
						return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
					caObject.save()
					form.correspondance_addresses.add(caObject)
				
				for related_person in related_persons:
					kyc = None
					kyc_number = related_person.get("kyc_number", "")
					if kyc_number != "" and kyc_number is not None:
						try:
							kyc = UserKYC.active_objects.get(kyc_number=kyc_number)
						except UserKYC.DoesNotExist as e:
							error_obj['errors'] = {}
							error_obj['errors']['__all__'] = "Related Person kyc {0} is not valid".format(kyc_number)
							transaction.set_rollback(True)
							return HttpResponseBadRequest(content_type="application/json",
														  content=json.dumps(error_obj))
					# Sanitizing
					related_person = {k: related_person[k] for k in ApplicationRelatedPerson.basic_fields() if
									  k in related_person}
					rpObject = ApplicationRelatedPerson(**related_person)
					rpObject.kyc = kyc
					try:
						rpObject.full_clean()
					except ValidationError as e:
						error_obj['errors'] = {}
						error_obj['errors']['related_persons'] = dict(e)
						if '__all__' in error_obj['errors']['related_persons']:
							error_obj['errors']['__all__'] = error_obj['errors']['related_persons']['__all__']
						transaction.set_rollback(True)
						return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
					
					rpObject.save()
					form.related_persons.add(rpObject)
				response_object['data'] = model_to_dict(form, fields=APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS)
				return JsonResponse(response_object)
		except Exception as e:
			return handling_exception_response(request, e)


class ApplicationFormDetailsView(ProtectedView):
	http_method_names = ['get','put','patch']
	
	def get(self, request, pk=None):
		try:
			response_object = get_success_packet()
			error_obj = get_bad_packet()
			params = json.loads(json.dumps(request.GET))
			
			get_supporting_data = params.get("get_supporting_data", None)
			if get_supporting_data is not None:
				response_object['supporting_data'] = get_application_form_supporting_data()
			if pk is not None and int(pk) != 0:
				try:
					if request.user.is_employee:
						form = ApplicationForm.active_objects.employee_access_forms(request.user).get(id=pk)
					else:
						form = ApplicationForm.active_objects.get(id=pk, user=request.user)
				except ApplicationForm.DoesNotExist:
					error_obj['reason'] = "Application not found"
					return HttpResponseNotFound(content_type="application/json", content=json.dumps(error_obj))
				response_object['data'] = model_to_dict(form, fields=APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS)
			else:
				kyc = request.user.kyc
				if kyc is None:
					form_data = model_to_dict(ApplicationForm(id=0, user=request.user),
											  fields=APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS)
					correspondance_addresses = model_to_dict(ApplicationCorrespondanceAddress(id=0, user=request.user),
															 fields=APPLICATION_CORRESPONDANCE_SERIALIZER_FIELDS)
					form_data["correspondance_addresses"] = [correspondance_addresses]
					response_object['data'] = form_data
				else:#Application form prefilled with existing KYC data
					params = UserKYC.active_objects.filter(id=kyc.id).values()[0]
					# Sanitizing
					params = {k: params[k] for k in ApplicationForm.basic_fields() if k in params}
					params["id"] = 0
					params["user"] = request.user
					form_data = model_to_dict(ApplicationForm(**params),
											  fields=APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS)
					form_data["correspondance_addresses"] = []
					for ca in kyc.correspondance_addresses.all():
						correspondance_address = model_to_dict(ca,fields=CorrespondanceAddress.basic_fields())
						form_data["correspondance_addresses"].append(correspondance_address)
					
					form_data["related_persons"] = []
					for ra in kyc.related_persons.all():
						related_person = model_to_dict(ra, fields=RelatedPerson.basic_fields())
						form_data["related_persons"].append(related_person)

			return JsonResponse(response_object)
		except Exception as e:
			return handling_exception_response(request, e)
	
	@transaction.atomic()
	def put(self, request, pk=None):
		try:
			with transaction.atomic():
				response_object = get_success_packet()
				error_obj = get_bad_packet()
				params = json.loads(request.body)
		
				if pk is None:
					error_obj['reason'] = 'All mandatory fields are not entered'
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				
				try:
					form = ApplicationForm.active_objects.get(id=pk, user=request.user)
				except ApplicationForm.DoesNotExist:
					error_obj['reason'] = "Application not found"
					return HttpResponseNotFound(content_type="application/json", content=json.dumps(error_obj))
				
				related_persons = params.pop("related_persons", [])
				correspondance_addresses = params.pop("correspondance_addresses", [])
				if len(correspondance_addresses) == 0:  # Atleast one correspondance address needed
					error_obj["reason"] = "Atleast one correspondance Address is needed"
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				
				# Delete all corresponding address & related persons table & recreate
				# Not bothering to find id loop and update...
				form.correspondance_addresses.all().delete()
				form.related_persons.all().delete()
				
				# Sanitizing
				params = {k: params[k] for k in ApplicationForm.basic_fields() if k in params}
				for k in params:
					setattr(form, k, params[k])
				try:
					form.full_clean()
				except ValidationError as e:
					error_obj['errors'] = dict(e)
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				form.save()
				
				for correspondance_address in correspondance_addresses:
					# Sanitizing
					correspondance_address = {k: correspondance_address[k] for k in
											  ApplicationCorrespondanceAddress.basic_fields() if
											  k in correspondance_address}
					caObject = ApplicationCorrespondanceAddress(**correspondance_address)
					caObject.user = request.user
					try:
						caObject.full_clean()
					except ValidationError as e:
						error_obj['errors'] = {}
						error_obj['errors']['correspondance_addresses'] = dict(e)
						if '__all__' in error_obj['errors']['correspondance_addresses']:
							error_obj['errors']['__all__'] = error_obj['errors']['correspondance_addresses']['__all__']
						transaction.set_rollback(True)
						return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
					caObject.save()
					form.correspondance_addresses.add(caObject)
				
				for related_person in related_persons:
					kyc = None
					kyc_number = related_person.get("kyc_number", "")
					if kyc_number != "" and kyc_number is not None:
						try:
							kyc = UserKYC.active_objects.get(kyc_number=kyc_number)
						except UserKYC.DoesNotExist as e:
							error_obj['errors'] = {}
							error_obj['errors']['__all__'] = "Related Person kyc {0} is not valid".format(kyc_number)
							transaction.set_rollback(True)
							return HttpResponseBadRequest(content_type="application/json",
														  content=json.dumps(error_obj))
					# Sanitizing
					related_person = {k: related_person[k] for k in ApplicationRelatedPerson.basic_fields() if
									  k in related_person}
					rpObject = ApplicationRelatedPerson(**related_person)
					rpObject.kyc = kyc
					try:
						rpObject.full_clean()
					except ValidationError as e:
						error_obj['errors'] = {}
						error_obj['errors']['related_persons'] = dict(e)
						if '__all__' in error_obj['errors']['related_persons']:
							error_obj['errors']['__all__'] = error_obj['errors']['related_persons']['__all__']
						transaction.set_rollback(True)
						return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
					
					rpObject.save()
					form.related_persons.add(rpObject)
				response_object['data'] = model_to_dict(form, fields=APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS)
				return JsonResponse(response_object)
		except Exception as e:
			return handling_exception_response(request, e)
	
	@transaction.atomic()
	def patch(self, request, pk=None):
		"""
			Using patch for APPROVAL & Rejection flow

		"""
		try:
			with transaction.atomic():
				response_object = get_success_packet()
				error_obj = get_bad_packet()
				params = json.loads(request.body)
				remarks = params.get("remarks", None)
				status = params.get("status", None)
				
				if pk is None or remarks is None or status is None:
					error_obj['reason'] = 'All mandatory fields are not entered'
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				
				if status is not choices.APPLICATION_REJECTED and status is not choices.APPLICATION_SUCCESS:
					error_obj['reason'] = 'Wrong Application Status'
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				
				if not request.user.is_attester:
					return permission_denied()
				
				try:
					form = ApplicationForm.active_objects.inprogress_forms().get(id=pk)
					if form.user.id == request.user.id:
						error_obj['reason'] = "You cannot be approve/rejected your own application "
						return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				
				except ApplicationForm.DoesNotExist:
					error_obj['reason'] = "Application not found"
					return HttpResponseNotFound(content_type="application/json", content=json.dumps(error_obj))
				
				params = ApplicationForm.active_objects.filter(id=pk).values()[0]
				kyc = request.user.kyc
				if kyc is None:
					# Sanitizing
					params = {k: params[k] for k in UserKYC.basic_fields() if k in params}
					kyc = UserKYC(**params)
					kyc.user = form.user
					# Not a great strategy...Okie for now
					kyc.kyc_number = str(randint(100000000001, 999999999999))
				else:
					# Sanitizing
					params = {k: params[k] for k in UserKYC.basic_fields() if k in params}
					for k in params:
						setattr(form, k, params[k])
					kyc.user = form.user
				try:
					kyc.full_clean()
				except ValidationError as e:
					error_obj['errors'] = dict(e)
					return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
				kyc.save()
				
				kyc.correspondance_addresses.all().delete()
				kyc.related_persons.all().delete()
				
				for ca in form.correspondance_addresses.all():
					correspondance_address = CorrespondanceAddress.active_objects.create(
						use_poa_for_local_address=ca.use_poa_for_local_address,
						address=ca.address,
						city=ca.city,
						district=ca.district,
						indian_state=ca.indian_state,
						zipcode=ca.zipcode,
						country=ca.country,
						user=kyc.user
					)
					kyc.correspondance_addresses.add(correspondance_address)
				
				for rp in form.related_persons.all():
					related_person = RelatedPerson.active_objects.create(
						kyc=rp.kyc,
						related_person_type=rp.related_person_type,
						first_name=rp.first_name,
						last_name=rp.last_name,
						middle_name=rp.middle_name,
						prefix=rp.prefix,
						poi_type=rp.poi_type,
						poi_number=rp.poi_number,
						passport_expiry_date=rp.passport_expiry_date,
						dl_expiry_date=rp.dl_expiry_date,
						poi_document=rp.poi_document,
					
					)
					kyc.related_persons.add(related_person)
				
				kyc.application_forms.add(form)
				
				attestation = Attestation.active_objects.create(
					employee=request.user.employee,
					application_form=form,
					remarks=remarks
				)
				
				form.status = status
				form.save()
				
				"""
				NEED TO COPY ALL IMAGES & PDF ideally ?
				"""
				response_object['data'] = model_to_dict(form, fields=APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS)
				return JsonResponse(response_object)
		except Exception as e:
			return handling_exception_response(request, e)
