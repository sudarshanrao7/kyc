from django.db import models
"""
APP Specific imports
"""
from app.core.models import BaseModel


class Institution(BaseModel):
	code = models.CharField(max_length=14, unique=True)
	name = models.CharField(max_length=100)
	
	def __unicode__(self):
		return u"Institution: {0}-{1}".format(self.code, self.name)
	
	class Meta:
		db_table = "kyc_institution"
		verbose_name = "Institution"


class InstitutionBranch(BaseModel):
	code = models.CharField(max_length=14, unique=True)
	name = models.CharField(max_length=100)
	institution = models.ForeignKey(Institution)
	
	def __unicode__(self):
		return u"Institution Branch: {0}-{1} of {3}".format(self.code, self.name, self.institution.name)
	
	class Meta:
		db_table = "kyc_institution_branch"
		verbose_name = "InstitutionBranch"
