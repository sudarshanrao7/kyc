from django.db import models
from app.eform.models import RelatedPersonAbstractModel, KYCFieldsAbstractModel, CorrespondanceAbstractModel, \
	ApplicationForm
from app.eform import choices
from app.core.utils import kyc_number_regex


class CorrespondanceAddress(CorrespondanceAbstractModel):
	user = models.ForeignKey("user.User")

	class Meta:
		db_table = "kyc_correspondance_address"
		verbose_name = "Correspondance Address"

	def clean(self):
		super(CorrespondanceAddress, self).clean()

class RelatedPerson(RelatedPersonAbstractModel):
	
	@property
	def kyc_number(self):
		if self.kyc:
			return self.kyc.kyc_number
		else:
			return ""
	
	class Meta:
		db_table = "kyc_related_person"
		verbose_name = "KYC Related Person"

	def clean(self):
		super(RelatedPerson, self).clean()



class UserKYC(KYCFieldsAbstractModel):
	kyc_number = models.CharField(max_length=20,unique=True,validators=[kyc_number_regex])
	user = models.OneToOneField("user.User")
	correspondance_addresses = models.ManyToManyField(CorrespondanceAddress,
													  related_name="kyc_corresponding_address")
	related_persons = models.ManyToManyField(RelatedPerson, related_name="kyc_related_persons")
	#Acts like a history mapping...
	application_forms = models.ManyToManyField(ApplicationForm, related_name="kyc_related_persons")
	
	def clean(self):
		super(UserKYC, self).clean()

	class Meta:
		db_table = "kyc_user_kyc_info"
		verbose_name = "User KYC"