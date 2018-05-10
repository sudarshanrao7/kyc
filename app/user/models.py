from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

from app.core.models import ModelHelperMixin


class UserManager(BaseUserManager):
	def create_user(self, email,first_name,last_name, password):
		"""
		Creates and saves a User with the given email, date of
		birth and password.
		"""
		if not email:
			raise ValueError('Users must have an email address')
		
		user = self.model(
			email=self.normalize_email(email),
		)
		
		user.set_password(password)
		user.save(using=self._db)
		return user
	
	def create_superuser(self, email,first_name,last_name, password):
		"""
		Creates and saves a superuser with the given email password.
		"""
		user = self.create_user(
			email,
			first_name,
			last_name,
			password
		)
		user.is_admin = True
		user.save(using=self._db)
		return user


class ActiveUserManager(UserManager):
	def get_queryset(self):
		return super(ActiveUserManager, self).get_queryset().filter(
			deleted_date__isnull=True
		)


class User(AbstractBaseUser, ModelHelperMixin):
	MALE = 1
	FEMALE = 2
	GENDER_TYPE_LIST = (
		(MALE, 'Male'),
		(FEMALE, 'Female'),
	)
	
	SIGN_UP = 0
	CREATED = 1
	INVITATION_SENT = 2
	LOGGED_IN = 3
	USER_STATE_LIST = (
		(SIGN_UP, 'Sign up'),
		(CREATED, 'Created'),
		(INVITATION_SENT, 'Invitation Sent'),
		(LOGGED_IN, 'Logged In'),
	)
	
	created_date = models.DateTimeField(auto_now_add=True)
	modified_date = models.DateTimeField(auto_now=True)
	deleted_date = models.DateTimeField(null=True)
	
	email = models.EmailField(unique=True)
	first_name = models.CharField(max_length=50, blank=True)
	last_name = models.CharField(max_length=50, blank=True)
	last_modified_password_date = models.DateTimeField()
	
	objects = UserManager()
	active_objects = ActiveUserManager()
	
	@property
	def kyc(self):
		try:
			#Coming from OneToOne relation
			return self.userkyc 
		except Exception as e:
			return None
	
	@property
	def is_employee(self):
		from app.employee.model import Employee
		return Employee.active_objects.filter(user = self).exists()

	@property
	def is_attester(self):
		if self.is_employee:
			from app.employee.model import Employee,EmployeeGroups
			employee = Employee.active_objects.get(user=self)
			return employee.employee_groups.all().filter(can_attesst=True).exists()
		else:
			return False
		
	@property
	def employee(self):
		if self.is_employee:
			from app.employee.model import Employee
			return Employee.active_objects.get(user=self)
		else:
			None
			
		

	
	
	@property
	def get_full_name(self):
		full_name = ""
		if self.first_name:
			full_name = self.first_name
		if self.last_name:
			full_name = u"{0} {1}".format(full_name, self.last_name)
		if full_name == "":
			full_name = self.email
		
		return full_name
	
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name']  # For Super User Creation
	
	class Meta:
		db_table = "kyc_user"
	
	def save(self, *args, **kwargs):
		if not self.pk:
			self.last_modified_password_date = timezone.now()
		super(User, self).save(*args, **kwargs)
