from jose import jws
from django.contrib.auth.models import AnonymousUser

from datetime import timedelta
from django.utils import timezone
from app.user.models import User
import json
from kyc_app.settings import JWT_ALGORITHM, JWT_TOKEN_VALIDITY, SECRET_KEY
from django.contrib.auth import authenticate


def create_jwt_token(email,password): 
	
	"""
	Authenticates  user for a given email,password and then
	Issues a JWT token

	Maintaining last_modified_password_date in User model/DB and comparing it with JWTtoken 
	to handle change password scenarios

	"""
	
	try:
		token = None
		user = None
		email = email.lower()
		user = authenticate(email=email, password=password)
		# Ensuring we issue token only to authenticated users
		if user is None or user.is_anonymous() or not user.is_authenticated():
			raise (None, token)
		
		expiry = timezone.now() + timedelta(hours=JWT_TOKEN_VALIDITY)
		expiry = int(expiry.strftime("%s")) * 1000
		created = int(timezone.now().strftime("%s")) * 1000
		if user is not None:
			token = jws.sign({'user_id': user.id, 'expiry': expiry, 'created': created}, SECRET_KEY,
							 algorithm=JWT_ALGORITHM)
		
		return (user, token)
	except Exception as e:
		return (None, None)



def authorize_credentials(request):
	"""
	Replacement for django session auth get_user & auth.get_user
	 JSON Web Token authentication. Inspects the token for the user_id,
	 attempts to get that user from the DB & assigns the user on the
	 request object. Otherwise it defaults to AnonymousUser.

	This will work with existing decorators like LoginRequired(request.user.is_authenticated())

	Returns: instance of user object or AnonymousUser object

	Maintaining last_modified_password_date in DB and checking it with JWTtoken 
	to handle change password scenarios	
	"""
	
	user = None
	try:
		token = request.META.get('HTTP_AUTHORIZATION', None)
		if token is not None:
			token = str(token).strip()
		if token is not None and token != "":
			decoded_dict = jws.verify(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
			decoded_dict = json.loads(decoded_dict)
			user_id = decoded_dict.get('user_id', None)
			expiry = decoded_dict.get('expiry', None)
			created = decoded_dict.get('created', None)
			if user_id is not None and expiry is not None and created is not None:
				now = int(timezone.now().strftime("%s")) * 1000
				try:
					usr = User.active_objects.get(id=user_id)
					password_change = int(usr.last_modified_password_date.strftime("%s")) * 1000
					if (expiry > now and created > password_change):
						user = usr
				except User.DoesNotExist:
					return AnonymousUser()

	except Exception:
		# Should never reach here...log to slack or equivalent
		pass
	
	return user or AnonymousUser()
