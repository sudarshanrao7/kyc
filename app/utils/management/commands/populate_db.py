from django.core.management.base import BaseCommand
from app.user.models import User
from app.institution.models import Institution,InstitutionBranch
from app.employee.model import Employee,EmployeeGroups



class Command(BaseCommand):
	def handle(self, *args, **options):
		try:
			institution,created =  Institution.active_objects.get_or_create(
				code='kyc_institute',
				name='KYC Company',
			)
			institute_branch, created = InstitutionBranch.active_objects.get_or_create(
				code='kyc',
				name='KYC Branch',
				institution=institution
			)
			
			attester_group,created = EmployeeGroups.active_objects.get_or_create(
				name = "Attester Group",
				can_attesst = True
			)	
			
			try:
				client_only_user = User.active_objects.get(email='client@test.com')
			except User.DoesNotExist:
				client_only_user = User.objects.create_user(
					email="client@test.com",
					first_name="Client",
					last_name="Only",
					password="test@123")
				#Ignoring some silly bug, reseting first_name & last_name
				client_only_user.first_name = "Client"
				client_only_user.last_name = "Only"
				client_only_user.save()

			try:
				general_employee_user = User.active_objects.get(email='employee@test.com')
			except User.DoesNotExist:
				general_employee_user = User.objects.create_user(
					email="employee@test.com",
					first_name="General",
					last_name="Employee",
					password="test@123")
				general_employee_user.first_name = "General"
				general_employee_user.last_name = "Employee"
				general_employee_user.save()

			
			general_employee, created = Employee.active_objects.get_or_create(
				designation = 'General Employee',
				branch = institute_branch,
				user = general_employee_user
			)

			try:
				attest_employee_user = User.active_objects.get(email='attester@test.com')
			except User.DoesNotExist:
				attest_employee_user = User.objects.create_user(
					email="attester@test.com",
					first_name="Attester",
					last_name="Employee",
					password="test@123")
				attest_employee_user.first_name = "Attester"
				attest_employee_user.last_name = "Employee"
				attest_employee_user.save()

			attester_employee, created = Employee.active_objects.get_or_create(
				designation = 'Attester',
				branch = institute_branch,
				user = attest_employee_user
			)
			if created:
				attester_employee.employee_groups.add(attester_group)



		except Exception as e:
			print e

