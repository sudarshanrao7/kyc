import datetime
import json
from django.utils import timezone
from django.test import TestCase, Client
from app.utils.management.commands import populate_db
from app.user.models import User
from django.core.management import call_command
import json


class BaseTests(TestCase):
	def setUp(self):
		super(BaseTests, self).setUp()
		self.client = Client()
		call_command('populate_db')

	def _do_login(self,email):
		response = self.client.post('/api/authorize/login',
									content_type='application/json',
									data=json.dumps({"email":"employee@test.com","password":"test@123"}),
						  		**{
									'CONTENT_TYPE': 'application/json',
									'HTTP_AUTHORIZATION': "",
									'ACCEPT': 'application/json',
									'HTTP_X_REQUESTED_WITH' : 'XMLHttpRequest'
								}
						  )	
		
		self.assertEquals(response.status_code, 200)
		
		data = json.loads(response.content)
		self.headers = {
			'CONTENT_TYPE': 'application/json',
			'HTTP_AUTHORIZATION': data["token"],
			'ACCEPT': 'application/json',
		}
		return data["user"],data["token"]

