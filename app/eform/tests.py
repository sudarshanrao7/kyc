import datetime

from django.utils import timezone
from django.test import TestCase, Client
import json
from .models import ApplicationForm
from kyc_app.tests import BaseTests
from app.user.models import User


class EformTests(BaseTests):
	"""
		Test only for basic crud api of eform model and pagination positive flow
	"""
	
	#Hardcoding valid form one for now....
	valid_form_data = {u'last_name': u'Bhat', u'poi_number': u'234234234', u'correspondance_addresses': [{u'use_poa_for_local_address': True, u'city': u'sdfsdf ', u'district': u'sdfsdf sdf ', u'country': u'IN', u'zipcode': u'sdf sdf', u'user': 1, u'address': u'sdfdsfsdf', u'indian_state': u'AS', u'id': 5}], u'pan_number': u'4sdfdsf344sd', u'photo': {u'url': u'/site_media/media/uploads/05e9d8aa740d059b9131be1a48d2b46b96c43f79/home_test.jpg', u'guid': u'05e9d8aa740d059b9131be1a48d2b46b96c43f79', u'name': u'home_test.jpg'}, u'maiden_last_name': u'', u'mother_last_name': u'Bhat', u'guardian_middle_name': u'P', u'prefix': 1, u'fatca_address': u'2342342', u'poa_type': 3, u'is_fatca_applicable': False, u'mother_middle_name': u't', u'poa_other_poi_name': u'', u'fatca_tin_number': u'4324324', u'birth_date': u'2018-02-14', u'id': 1, u'city': u'dfgdfg', u'first_name': u'Tapan', u'consent': True, u'fatca_place_of_birth': u'234234234', u'district': u'dg dfg', u'office_tel_prefix': 334, u'occupation_type': 1, u'zipcode': u'd gfdg', u'residential_status': 1, u'mother_first_name': u'Geetha', u'citizen': u'IN', u'indian_state': u'AS', u'guardian_last_name': u'Bhat', u'email': u'test@test.com', u'poa_number': u'df gdfg', u'status': 1, u'poi_type': 3, u'related_persons': [{u'first_name': u'34234234', u'last_name': u'324234', u'middle_name': u'234234', u'related_person_type': 1, u'poi_number': u'324234234', u'poi_document': [{u'url': u'/site_media/media/uploads/95cb4cc7cdfe0e7a15e1e79a76d37eabbefa04c6/pdf-sample.pdf', u'guid': u'95cb4cc7cdfe0e7a15e1e79a76d37eabbefa04c6', u'name': u'pdf-sample.pdf'}], u'other_poi_name': u'dsfdsfsdfsf', u'prefix': 1, u'poi_type': 6, u'kyc_number': u'', u'passport_expiry_date': None, u'dl_expiry_date': None, u'id': 5}], u'poa_dl_expiry_date': u'2018-05-18', u'home_tel_prefix': 343, u'fatca_country_of_birth': u'IN', u'fatca_country': u'IN', u'poi_document': [{u'url': u'/site_media/media/uploads/46c37a06eb05bfc8bc98719f5cdf56577bea868f/pdf-sample.pdf', u'guid': u'46c37a06eb05bfc8bc98719f5cdf56577bea868f', u'name': u'pdf-sample.pdf'}], u'fatca_indian_state': u'', u'is_pan_excempt': False, u'other_poi_name': u'', u'mother_prefix': 2, u'poa_document': [{u'url': u'/site_media/media/uploads/432019e0f860b01c1581dd0e3c2d1dde71b0e354/pdf-sample.pdf', u'guid': u'432019e0f860b01c1581dd0e3c2d1dde71b0e354', u'name': u'pdf-sample.pdf'}], u'fatca_country_judistriction': u'AF', u'fatca_city': u'234234', u'remarks': u'dfsdfdsfsdvfsd s sdf sdfds', u'middle_name': u'P', u'dl_expiry_date': None, u'fatca_zipcode': u'234234', u'guardian_prefix': 1, u'address_type': 1, u'guardian_first_name': u'Prakash', u'mobile': 432423423, u'gender': 1, u'marital_status': 1, u'maiden_first_name': u'', u'pan_document': [{u'url': u'/site_media/media/uploads/9b9ad859fe658df0e4d0f66594f760fd3a82fee9/pdf-sample.pdf', u'guid': u'9b9ad859fe658df0e4d0f66594f760fd3a82fee9', u'name': u'pdf-sample.pdf'}], u'poa_passport_expiry_date': None, u'fatca_district': u'3423423', u'home_telephone': 3423423, u'passport_expiry_date': None, u'office_telephone': 234234, u'country': u'IN', u'maiden_middle_name': u'', u'mobile_country_code': 434, u'address': u'fdgdfg ddfg dfg dfg df dfgdfg dfg df', u'user': 1}

	
	def setUp(self):
		super(EformTests, self).setUp()
		client, token = self._do_login("client@test.com")
		self.headers = {
					'CONTENT_TYPE':'application/json',
					 'HTTP_AUTHORIZATION': token,
					 'ACCEPT':'application/json',
					}
		self._created_users = []

	
	def test_to_ensure_form_is_login_protected(self):
		"""
		Ensuring that form is not available for anonymus user
		Need to move to base tests..
		"""
		response = self.client.get('/api/eform/')
		self.assertEquals(response.status_code, 401)
		
		response = self.client.post('/api/eform/')
		self.assertEquals(response.status_code, 401)

		response = self.client.get('/api/eform/1')
		self.assertEquals(response.status_code, 401)

		response = self.client.post('/api/eform/1')
		self.assertEquals(response.status_code, 401)

		response = self.client.patch('/api/eform/1')
		self.assertEquals(response.status_code, 401)
		
	def test_to_ensure_login_user_can_access_eform_api(self):
		"""
		Ensuring that form is accessible only to logged in users
		Need to move to base tests..
		"""
		response = self.client.get('/api/eform/',{},**self.headers)
		self.assertEquals(response.status_code, 200)

		response = self.client.get('/api/eform/0/',{},**self.headers)
		self.assertEquals(response.status_code, 200)
		
	def test_to_ensure_eform_create_api_validations(self):
		"""
		Checking all easy validations
		"""
		response = self.client.post('/api/eform/',
								content_type='application/json',
						 		data=json.dumps({}),
						  		**self.headers
						  )	
		data = json.loads(response.content)
		self.assertEquals(response.status_code, 400)
		self.assertEquals(data["reason"], "Atleast one correspondance Address is needed")

		response = self.client.post('/api/eform/',
								content_type='application/json',
									data=json.dumps({
										"correspondance_addresses": self.valid_form_data["correspondance_addresses"]
									}),
						  		**self.headers
						  )	
		data = json.loads(response.content)
		self.assertEquals(response.status_code, 400)
		self.assertTrue("errors" in data)
		self.assertTrue("last_name" in data["errors"])
		self.assertTrue("photo" in data["errors"])
		self.assertTrue("address" in data["errors"])
		self.assertTrue("mother_last_name" in data["errors"])
		self.assertTrue("city" in data["errors"])
		self.assertTrue("first_name" in data["errors"])
		self.assertTrue("mother_first_name" in data["errors"])
		self.assertTrue("address_type" in data["errors"])
		self.assertTrue("guardian_last_name" in data["errors"])
		self.assertTrue("email" in data["errors"])
		self.assertTrue("poa_number" in data["errors"])
		self.assertTrue("poa_type" in data["errors"])
		self.assertTrue("poa_document" in data["errors"])
		self.assertTrue("district" in data["errors"])
		self.assertTrue("guardian_first_name" in data["errors"])
		self.assertTrue("mobile" in data["errors"])
		self.assertTrue("gender" in data["errors"])
		self.assertTrue("pan_document" in data["errors"])
		self.assertTrue("marital_status" in data["errors"])
		self.assertTrue("birth_date" in data["errors"])
		self.assertTrue("mobile_country_code" in data["errors"])
		
	def test_to_ensure_eform_pan_number_is_collected(self):
		"""
		Checking all easy validations
		"""
		response = self.client.post('/api/eform/',
								content_type='application/json',
						 		data=json.dumps({}),
						  		**self.headers
						  )	
		data = json.loads(response.content)
		self.assertEquals(response.status_code, 400)
		self.assertEquals(data["reason"], "Atleast one correspondance Address is needed")
		
		form_data = self.valid_form_data
		form_data.pop("pan_number",None)
		response = self.client.post('/api/eform/',
								content_type='application/json',
									data=json.dumps(form_data),
						  		**self.headers
						  )	
		data = json.loads(response.content)
		self.assertEquals(response.status_code, 400)
		self.assertTrue("errors" in data)
		self.assertEquals(data["errors"]["__all__"][0], "PAN number must be entered in alphanumeric format. Minimum 10,Max 12 digits allowed.")
	


