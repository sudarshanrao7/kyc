from app.utils.utils import choice_to_form_options
import choices

def get_application_form_supporting_data():
	supporting_data = {}
	supporting_data["COUNTRY_CODE_LIST"] = choice_to_form_options(choices.COUNTRY_CODE_LIST)
	supporting_data["INDIA_STATE_CODE_LIST"] = choice_to_form_options(choices.INDIA_STATE_CODE_LIST)
	supporting_data["GENDER_LIST"] = choice_to_form_options(choices.GENDER_LIST)
	supporting_data["PREFIX_LIST"] = choice_to_form_options(choices.PREFIX_LIST)
	supporting_data["MARITAL_STATUS_LIST"] = choice_to_form_options(choices.MARITAL_STATUS_LIST)
	supporting_data["RESIDENTIAL_STATUS_LIST"] = choice_to_form_options(choices.RESIDENTIAL_STATUS_LIST)
	supporting_data["OCCUPATION_TYPE_LIST"] = choice_to_form_options(choices.OCCUPATION_TYPE_LIST)
	supporting_data["ADDRESS_TYPE_LIST"] = choice_to_form_options(choices.ADDRESS_TYPE_LIST)
	supporting_data["POA_TYPE_LIST"] = choice_to_form_options(choices.POA_TYPE_LIST)
	supporting_data["POI_TYPE_LIST"] = choice_to_form_options(choices.POI_TYPE_LIST)
	supporting_data["RELATED_PERSON_TYPE_LIST"] = choice_to_form_options(choices.RELATED_PERSON_TYPE_LIST)
	return supporting_data