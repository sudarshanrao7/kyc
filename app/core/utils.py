from django.core.validators import RegexValidator
from django.views import View
from django.utils.decorators import method_decorator
from app.core.decorators import login_check


phone_regex = RegexValidator(regex=r'^\+?1?\d{9,14}$',
							 message="Phone number must be entered in the format: '+999999999'. Minimum 9,Max 14 digits allowed.")
pan_regex = RegexValidator(regex=r'^\w{10,12}$',
						   message="PAN number must be entered in alphanumeric format. Minimum 10,Max 12 digits allowed.")
kyc_number_regex = RegexValidator(regex=r'^\d{12}$',
							 message="KYC Number must be a 12 digit number")

alphanumeric_regex = RegexValidator(regex=r'^\w+$',
									message="Must be in alphanumeric format")



class BaseView(View):
	"""
		SuperClass - Just in case if we need to do something global
	"""
	pass



class ProtectedView(BaseView):
	@method_decorator(login_check)
	def dispatch(self, *args, **kwargs):
		return super(ProtectedView,self).dispatch(*args, **kwargs)

