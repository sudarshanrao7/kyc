from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property

from kyc_app.settings import PAGINATION_PER_PAGE
import math


class ModelHelperMixin(object):
	"""
		A model mixin that provide some useful features
	"""
	
	@classmethod
	def basic_fields(self,exclude=[]):
		field_names = []
		skip_types = ['ForeignKey','OneToOneField','ManyToManyField']
		skip_names = ['created_date','modified_date','deleted_date','id','pk']
		skip_names.extend(exclude)
		for f in self._meta.concrete_fields:
			if f.name in skip_names:
				continue
			if f.get_internal_type() in skip_types:
				continue
			field_names.append(f.name)

		return field_names

	@staticmethod
	def do_paginate(queryset, params={}):
		return_object = {'data': queryset, 'paginate_info': {}}
		page = params.get("page", None)
		if page is None:
			return return_object

		page = int(page)
		sort_by = params.get("sort_by", "")
		asc = params.get("asc", True)
		per_page = params.get("per_page", PAGINATION_PER_PAGE)
		per_page = int(per_page)

		paginate_info = {}
		paginate_info["per_page"] = per_page
		paginate_info["page"] = page
		paginate_info["sort_by"] = sort_by
		paginate_info["asc"] = asc
		if not asc:
			order_by = "-" + sort_by
		else:
			order_by = sort_by

		if sort_by != "":
			queryset = queryset.order_by(order_by)

		total = queryset.count()
		paginate_info["total"] = total
		paginate_info["total_pages"] = math.ceil(total / per_page)

		start = page * per_page
		end = (page + 1) * per_page
		queryset = queryset[start:end]

		return_object["data"] = queryset
		return_object["paginate_info"] = paginate_info
		return return_object


class InactiveBaseModelManager(models.Manager):
	def get_queryset(self):
		return super(InactiveBaseModelManager, self).get_queryset().filter(
			deleted_date__isnull=False
		).order_by("-id")


class ActiveBaseModelManager(models.Manager):
	def get_queryset(self):
		return super(ActiveBaseModelManager, self).get_queryset().filter(
			deleted_date__isnull=True
		).order_by("-modified_date","-id")
	
class AllBaseModelManager(models.Manager):
	def get_queryset(self):
		return super(AllBaseModelManager, self).get_queryset()


class BaseModel(models.Model, ModelHelperMixin):
	created_date = models.DateTimeField(auto_now_add=True, db_index=True)
	modified_date = models.DateTimeField(auto_now=True, db_index=True)
	deleted_date = models.DateTimeField(null=True, blank=True)
	
	objects = None
	active_objects = ActiveBaseModelManager()
	inactive_objects = InactiveBaseModelManager()
	all_objects = AllBaseModelManager()
	
	class Meta:
		abstract = True
