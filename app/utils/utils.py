import hashlib
from django.utils.encoding import smart_text
from django.utils.crypto import random

def choice_to_form_options(choice_tuple):
	return list(map(lambda item: {"value": item[0], "label":item[1]}, choice_tuple))

def generate_guid():
	return hashlib.sha1(smart_text(random.random())).hexdigest()

