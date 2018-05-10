from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import JSONField
from django.db.models import Q

"""
APP Specific imports
"""
from app.core.models import BaseModel, ActiveBaseModelManager
from app.core.utils import phone_regex, pan_regex
import choices
from app.employee.model import Employee


class KYCFieldsAbstractModel(BaseModel):
	photo = JSONField(verbose_name="Photo", default={})
	is_pan_excempt = models.BooleanField(default=False, verbose_name="Are You PAN Excempt Investor")
	pan_number = models.CharField(max_length=14, verbose_name="PAN Number", blank=True) 
	pan_document = JSONField(verbose_name="PAN Document", default=[])
	
	# Self Name Details
	first_name = models.CharField(max_length=100, verbose_name="First Name")
	last_name = models.CharField(max_length=50,  verbose_name="Last Name")
	middle_name = models.CharField(max_length=50, blank=True, verbose_name="Middle Name")
	prefix = models.IntegerField(choices=choices.PREFIX_LIST, verbose_name="Prefix")
	
	# Maiden Name Details
	maiden_first_name = models.CharField(max_length=100, blank=True, verbose_name="Maiden First Name")
	maiden_last_name = models.CharField(max_length=50, blank=True, verbose_name="Maiden Last Name")
	maiden_middle_name = models.CharField(max_length=50, blank=True, verbose_name="Maiden Middle Name")
	maiden_prefix = models.IntegerField(choices=choices.PREFIX_LIST, blank=True,verbose_name="Prefix",null=True)
	
	
	# Father/Spouse Name Details
	guardian_first_name = models.CharField(max_length=100, verbose_name="Father/Spouse First Name")
	guardian_last_name = models.CharField(max_length=50,  verbose_name="Father/Spouse Last Name")
	guardian_middle_name = models.CharField(max_length=50, blank=True, verbose_name="Father/Spouse Middle Name")
	guardian_prefix = models.IntegerField(choices=choices.PREFIX_LIST, verbose_name="Prefix")
	
	# Mother Name Details
	mother_first_name = models.CharField(max_length=100, verbose_name="Mother First Name")
	mother_last_name = models.CharField(max_length=50,  verbose_name="Mother Last Name")
	mother_middle_name = models.CharField(max_length=50, blank=True, verbose_name="Mother Middle Name")
	mother_prefix = models.IntegerField(choices=choices.PREFIX_LIST, default=choices.MRS, verbose_name="Prefix")
	
	# Client Details
	birth_date = models.DateField(verbose_name="Date Of Birth")
	gender = models.IntegerField(choices=choices.GENDER_LIST, verbose_name="Gender")
	marital_status = models.IntegerField(choices=choices.MARITAL_STATUS_LIST, verbose_name="Marital Status")
	citizen = models.CharField(max_length=2, choices=choices.COUNTRY_CODE_LIST, default=choices.INDIA_CODE,
							   verbose_name="Citizenship")
	residential_status = models.IntegerField(choices=choices.RESIDENTIAL_STATUS_LIST, verbose_name="Residential Status")
	occupation_type = models.IntegerField(choices=choices.OCCUPATION_TYPE_LIST, verbose_name="Occupation Type")
	
	# Proof of Identity
	poi_type = models.IntegerField(choices=choices.POI_TYPE_LIST, verbose_name="Proof Of Identity Type", blank=True,null=True)
	poi_number = models.CharField(max_length=20, verbose_name="Proof Of Identity Number", blank=True)
	passport_expiry_date = models.DateField(null=True,blank=True, verbose_name="Passport Expiry Date")
	dl_expiry_date = models.DateField(null=True,blank=True, verbose_name="Driver License Expiry Date")
	other_poi_name = models.CharField(max_length=30, verbose_name="Other Identity Document Name", blank=True)
	poi_document = JSONField(verbose_name="Proof of Identity Document", default=[] ,blank=True)
	
	# Proof of Address
	address = models.TextField(verbose_name="Current / Permanent / Overseas Address")
	city = models.CharField(max_length=30, verbose_name="City / Town / Village")
	district = models.CharField(max_length=30, verbose_name="District")
	indian_state = models.CharField(max_length=2, choices=choices.INDIA_STATE_CODE_LIST, verbose_name="State",
									blank=True)
	zipcode = models.CharField(max_length=7, verbose_name="Postal Code", blank=True)
	country = models.CharField(max_length=2, choices=choices.COUNTRY_CODE_LIST, default=choices.INDIA_CODE,
							   verbose_name="Country")
	address_type = models.IntegerField(choices=choices.ADDRESS_TYPE_LIST, verbose_name="Address type")
	
	poa_type = models.IntegerField(choices=choices.POA_TYPE_LIST, verbose_name="Proof Of Address Type")
	poa_number = models.CharField(max_length=20, verbose_name="Proof Of Address Identity Number")
	poa_passport_expiry_date = models.DateField(null=True,blank=True, verbose_name="Passport Expiry Date")
	poa_dl_expiry_date = models.DateField(null=True,blank=True, verbose_name="Driver License Expiry Date")
	poa_other_poi_name = models.CharField(max_length=30, verbose_name="Other Identity Document Name", blank=True)
	poa_document = JSONField(verbose_name="Proof of Address Document",default=[])
	
	# Contact Details
	email = models.EmailField(verbose_name="Email Address")
	mobile_country_code = models.PositiveIntegerField(verbose_name="Mobile Country Code")
	mobile = models.PositiveIntegerField(verbose_name="Mobile")
	office_tel_prefix = models.PositiveIntegerField(verbose_name="STD Code", blank=True,null=True)
	office_telephone = models.PositiveIntegerField(verbose_name="Office Telephone Number", blank=True,null=True)
	home_tel_prefix = models.PositiveIntegerField(verbose_name="STD Code", blank=True,null=True)
	home_telephone = models.PositiveIntegerField(verbose_name="Home Telephone Number", blank=True,null=True)
	
	#FATCA Information
	is_fatca_applicable = models.BooleanField(default=False)
	fatca_country_judistriction = models.CharField(max_length=2, choices=choices.COUNTRY_CODE_LIST, verbose_name="Country of Jurisdiction of Residence",blank=True)
	fatca_tin_number = models.CharField(max_length=20,  verbose_name="Tax Identification Number",blank=True)
	fatca_place_of_birth = models.CharField(max_length=30,  verbose_name="Place of Birth",blank=True)
	fatca_country_of_birth = models.CharField(max_length=2, choices=choices.COUNTRY_CODE_LIST, default=choices.INDIA_CODE,
							   verbose_name="Country of Birth",blank=True)
	fatca_address = models.TextField(verbose_name="Address",blank=True)
	fatca_city = models.CharField(max_length=30, verbose_name="City / Town / Village",blank=True)
	fatca_district = models.CharField(max_length=30, verbose_name="District",blank=True)
	fatca_indian_state = models.CharField(max_length=2, choices=choices.INDIA_STATE_CODE_LIST, verbose_name="State",
									blank=True)
	fatca_zipcode = models.CharField(max_length=7, verbose_name="Zipcode", blank=True)
	fatca_country = models.CharField(max_length=2, choices=choices.COUNTRY_CODE_LIST, default=choices.INDIA_CODE,
							   verbose_name="Country",blank=True)
	
	remarks = models.TextField(blank=True)

	
	
	def clean(self):
		super(KYCFieldsAbstractModel, self).clean()
		if  self.photo is None or "guid" not in self.photo:
			raise ValidationError("Photo is missing! Please upload the same")
		
		if self.is_pan_excempt:
			if self.poi_type == None:
				raise ValidationError("Proof of Identity is mandatory")
			if self.poi_number is None or str(self.poi_number) == "":
				raise ValidationError("Proof of Identity number is mandatory")
			if self.poi_type == choices.PASSPORT and self.passport_expiry_date is None:
				raise ValidationError("Passport Expiry Date is mandatory")
			elif self.poi_type == choices.DRIVING_LICENSE and self.dl_expiry_date is None:
				raise ValidationError("Driver License Expiry Date is mandatory")
			elif self.poi_type == choices.OTHER_POI and (
							self.other_poi_name is None or str(self.other_poi_name).strip() == ""):
				raise ValidationError("Proof Of Identity document name is mandatory")
			
			# Not doing further check to see if doc actually exists in S3 or media folder
			if self.poi_document is None or len(self.poi_document) == 0 or "guid" not in self.poi_document[0]:
				raise ValidationError("Proof Of Identity document is missing! Please upload the same")
				
		else:
			if self.pan_number is None:
				raise ValidationError("PAN number is mandatory")
			else:
				pan_regex(self.pan_number)
			
			# Not doing further check to see if doc actually exists in S3 or media folder
			if self.pan_document is None or len(self.pan_document) == 0 or "guid" not in self.pan_document[0]:
				raise ValidationError("Pan document is missing! Please upload the same")
			
			
		if self.poa_type == choices.PASSPORT and self.poa_passport_expiry_date is None:
			raise ValidationError("Passport Expiry Date is mandatory")
		elif self.poa_type == choices.DRIVING_LICENSE and self.poa_dl_expiry_date is None:
			raise ValidationError("Driver License Expiry Date is mandatory")
		elif self.poa_type == choices.OTHER_POI and (
						self.poa_other_poi_name is None or str(self.poa_other_poi_name).strip() == ""):
			raise ValidationError("Proof Of Identity document name is mandatory")

		if self.poa_document is None or len(self.poa_document) == 0 or "guid" not in self.poa_document[0]:
			raise ValidationError("Pan document is missing! Please upload the same")
		
		if self.country == choices.INDIA_CODE and (self.indian_state == None or str(self.indian_state).strip() == ""):
			raise ValidationError("State value in mandatory in proof of address")
		
		if self.country == choices.INDIA_CODE and (self.zipcode == None or str(self.zipcode).strip() == ""):
			raise ValidationError("Postal code in mandatory in proof of address")
		
		if self.is_fatca_applicable:
			if self.fatca_country_judistriction is None or str(self.fatca_country_judistriction).strip() == "":
				raise ValidationError("Country of Jurisdiction of Residence in mandatory in FATCA section")
			if self.fatca_place_of_birth is None or str(self.fatca_place_of_birth).strip() == "":
				raise ValidationError("Place of Birth in mandatory in FATCA section")
			if self.fatca_country_of_birth is None or str(self.fatca_country_of_birth).strip() == "":
				raise ValidationError("Country of Birth in mandatory in FATCA section")
			if self.fatca_address is None or str(self.fatca_address).strip() == "":
				raise ValidationError("Address in mandatory in FATCA section")
			if self.fatca_city is None or str(self.fatca_city).strip() == "":
				raise ValidationError("City in mandatory in FATCA section")
			if self.fatca_district is None or str(self.fatca_district).strip() == "":
				raise ValidationError("District in mandatory in FATCA section")
			if self.fatca_country is None or str(self.fatca_country).strip() == "":
				raise ValidationError("Country in mandatory in FATCA section")
			else:
				if self.fatca_country == choices.INDIA_CODE and (
								self.fatca_indian_state == None or str(self.fatca_indian_state).strip() == ""):
					raise ValidationError("State value in mandatory in FATCA section")
				
				if self.fatca_country == choices.INDIA_CODE and (self.fatca_zipcode == None or str(self.fatca_zipcode).strip() == ""):
					raise ValidationError("Postal code in mandatory in FATCA section")
				
	class Meta:
		abstract = True


class CorrespondanceAbstractModel(BaseModel):
	use_poa_for_local_address = models.BooleanField(default=False)
	address = models.TextField(verbose_name="Correspondence Address", blank=True)
	city = models.CharField(max_length=30, verbose_name="City / Town / Village", blank=True)
	district = models.CharField(max_length=30, verbose_name="District", blank=True)
	indian_state = models.CharField(max_length=2, choices=choices.INDIA_STATE_CODE_LIST, verbose_name="State",
									blank=True)
	zipcode = models.CharField(max_length=7, verbose_name="State", blank=True)
	country = models.CharField(max_length=2, choices=choices.COUNTRY_CODE_LIST, default=choices.INDIA_CODE,
							   verbose_name="Country", blank=True)
	
	def clean(self):
		super(CorrespondanceAbstractModel, self).clean()
		if not self.use_poa_for_local_address:
			if self.address is None or str(self.address).strip() == "":
				raise ValidationError("Correspondence Address in mandatory")
			if self.city is None or str(self.city).strip() == "":
				raise ValidationError("City in mandatory in correspondance address")
			if self.district is None or str(self.district).strip() == "":
				raise ValidationError("District in mandatory in correspondance address")
			if self.country is None or str(self.country).strip() == "":
				raise ValidationError("Country in mandatory in correspondance address")
			else:
				if self.country == choices.INDIA_CODE and (
						self.indian_state == None or str(self.indian_state).strip() == ""):
					raise ValidationError("State value in mandatory in proof of address")
				
				if self.country == choices.INDIA_CODE and (self.zipcode == None or str(self.zipcode).strip() == ""):
					raise ValidationError("Postal code in mandatory in proof of address")
	
	class Meta:
		abstract = True
		
class RelatedPersonAbstractModel(BaseModel):
	kyc = models.ForeignKey("kyc.UserKYC",null=True,blank=True)
	related_person_type = models.IntegerField(choices=choices.RELATED_PERSON_TYPE_LIST, verbose_name="Related Person Type")
	first_name = models.CharField(max_length=100, verbose_name="First Name")
	last_name = models.CharField(max_length=50, verbose_name="Last Name")
	middle_name = models.CharField(max_length=50, blank=True, verbose_name="Middle Name")
	prefix = models.IntegerField(choices=choices.PREFIX_LIST, verbose_name="Prefix")
	
	# Proof of Identity
	poi_type = models.IntegerField(choices=choices.POI_TYPE_LIST, verbose_name="Proof Of Identity Type", blank=True,null=True)
	poi_number = models.CharField(max_length=20, verbose_name="Proof Of Identity Identity Number", blank=True,null=True)
	passport_expiry_date = models.DateField(null=True, blank=True,verbose_name="Passport Expiry Date")
	dl_expiry_date = models.DateField(null=True,blank=True, verbose_name="Driver License Expiry Date")
	other_poi_name = models.CharField(max_length=30, verbose_name="Other Identity Document Name", blank=True,null=True)
	poi_document = JSONField(verbose_name="Proof of Identity Document", default=[],blank=True)
	
	def clean(self):
		super(RelatedPersonAbstractModel, self).clean()
		if self.kyc is None:
			if self.poi_type == None:
				raise ValidationError("Proof of Identity is mandatory")
			if self.poi_number is None or str(self.poi_number) == "":
				raise ValidationError("Proof of Identity number is mandatory")
			if self.poi_type == choices.PASSPORT and self.passport_expiry_date is None:
				raise ValidationError("Passport Expiry Date is mandatory")
			elif self.poi_type == choices.DRIVING_LICENSE and self.dl_expiry_date is None:
				raise ValidationError("Driver License Expiry Date is mandatory")
			elif self.poi_type == choices.OTHER_POI and (
							self.other_poi_name is None or self.other_poi_name.strip() == ""):
				raise ValidationError("Proof Of Identity document name is mandatory")
			
			# Not doing further check to see if doc actually exists in S3 or media folder
			if self.poi_document is None or len(self.poi_document) == 0 or "guid" not in self.poi_document[0]:
				raise ValidationError("Proof Of Identity document is missing in related person section! Please upload the same")
	
	class Meta:
		abstract = True

"""
Abstract Classes above
Actual Implementation Models below
"""

class ApplicationCorrespondanceAddress(CorrespondanceAbstractModel):
	user = models.ForeignKey("user.User")

	class Meta:
		db_table = "application_correspondance_address"
		verbose_name = "Application Correspondance Address"

	def clean(self):
		super(ApplicationCorrespondanceAddress, self).clean()

class ApplicationRelatedPerson(RelatedPersonAbstractModel):

	@property
	def kyc_number(self):
		if self.kyc:
			return self.kyc.kyc_number
		else:
			return ""
	
	class Meta:
		db_table = "kyc_application_form_related_person"
		verbose_name = "Application Related Person"
		
	def clean(self):
		super(ApplicationRelatedPerson, self).clean()


class ActiveApplicationFormManager(ActiveBaseModelManager):
	def get_queryset(self):
		return super(ActiveApplicationFormManager, self).get_queryset()
	
	def inprogress_forms(self):
		return self.filter(status = choices.APPLICATION_IN_PROGRESS)
		
	def rejected_forms(self):
		return self.filter(status = choices.APPLICATION_REJECTED)
	
	def success_forms(self):
		return self.filter(status=choices.APPLICATION_SUCCESS)
		
	def employee_access_forms(self,user):
		return self.filter(
			Q(user = user) | Q(status = choices.APPLICATION_IN_PROGRESS)
		).distinct()
		

class ApplicationForm(KYCFieldsAbstractModel):
	user = models.ForeignKey("user.User")
	status = models.IntegerField(choices=choices.APPLICATION_STATES_LIST, default=choices.APPLICATION_IN_PROGRESS)
	correspondance_addresses = models.ManyToManyField(ApplicationCorrespondanceAddress,related_name="application_corresponding_address")
	related_persons = models.ManyToManyField(ApplicationRelatedPerson,related_name="application_related_persons")
	consent = models.BooleanField(default=False)
	
	active_objects = ActiveApplicationFormManager()
	
	@property
	def attestation_remarks(self):
		try:
			return self.attestation.remarks 
		except Exception as e:
			return ""
		
	def clean(self):
		if self.consent is False:
			raise ValidationError("Application form declaration consent is not confirmed!")

		super(ApplicationForm, self).clean()

	class Meta:
		db_table = "kyc_application_form"
		verbose_name = "Application Form"
		
class Attestation(BaseModel):
	employee = models.ForeignKey(Employee)
	# Could have linked this model as ManyToMany in application form,so that there could be back & forth incase of rejections
	#Currenty only one time approval or rejection of one form,hence one-one.
	application_form = models.ForeignKey(ApplicationForm) 
	remarks = models.TextField(blank=True)
	
	
	def clean(self):
		super(Attestation, self).clean()
	
	class Meta:
		db_table = "kyc_application_attestation"
		verbose_name = "Attestation"
	
	
		
		
