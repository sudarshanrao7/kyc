from django.db import models

"""
APP Specific imports
"""
from app.core.models import BaseModel
from app.institution.models import InstitutionBranch, Institution
from app.user.models import User

"""
Employee Group is a dumb class for now.
Its like a Role/Access Control class
It is not tied to any institution.
"""


class EmployeeGroups(BaseModel):
	name = models.CharField(max_length=100,unique=True)
	can_attesst = models.BooleanField(default=False)
	
	def __unicode__(self):
		return u"Employee Group: {0}".format(self.name)
	
	class Meta:
		verbose_name = "Employee Groups"
		db_table = "kyc_employee_group"


class Employee(BaseModel):
	designation = models.CharField(max_length=30)
	branch = models.ForeignKey(InstitutionBranch)
	user = models.ForeignKey(User)
	employee_groups = models.ManyToManyField(EmployeeGroups)
	
	@property
	def name(self):
		return self.user.get_full_name
	
	def __unicode__(self):
		return u"Employee: {0}-{1}".format(self.name, self.branch.name)
	
	class Meta:
		db_table = "kyc_employee"
		verbose_name = "Employee"
		unique_together = ('user', 'branch')
