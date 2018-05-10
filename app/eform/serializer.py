E_FORM_SERIALIZE_FIELDS = ['photo','is_pan_excempt', 'pan_number', 'pan_document', 'first_name', 'last_name',
									 'middle_name',	'prefix', 'maiden_first_name', 'maiden_last_name', 'maiden_middle_name',
									 'guardian_first_name', 'guardian_last_name', 'guardian_middle_name','guardian_prefix',
									 'mother_first_name', 'mother_last_name', 'mother_middle_name', 'mother_prefix',
									 'birth_date', 'gender', 'marital_status', 'citizen', 'residential_status',
									 'occupation_type','poi_type', 'poi_number', 'passport_expiry_date', 'dl_expiry_date',
									 'other_poi_name','poi_document', 'address', 'city', 'district', 'indian_state', 'zipcode',
									 'country', 'address_type','poa_type', 'poa_number', 'poa_passport_expiry_date', 'poa_dl_expiry_date',
									 'poa_other_poi_name', 'poa_document', 'email', 'mobile_country_code', 'mobile',
									 'office_tel_prefix', 'office_telephone', 'home_tel_prefix', 'home_telephone',
									 'is_fatca_applicable', 'fatca_country_judistriction', 'fatca_tin_number',
									 'fatca_place_of_birth',
									 'fatca_country_of_birth', 'fatca_address', 'fatca_city', 'fatca_district',
									 'fatca_indian_state', 'fatca_zipcode', 'fatca_country', 'remarks'
								]

CORRESPONDANCE_SERIALIZER_FIELDS = [
	'use_poa_for_local_address','address','city','district','indian_state',
	'zipcode','country'
]

RELATED_PERSON_SERIALIZER_FIELDS = [
	'related_person_type','kyc_number','first_name','last_name','middle_name','prefix','poi_type',
	'poi_number','passport_expiry_date','dl_expiry_date','other_poi_name','poi_document'
]



APPLICATION_CORRESPONDANCE_SERIALIZER_FIELDS = CORRESPONDANCE_SERIALIZER_FIELDS + ['id','user']

APPLICTION_RELATED_PERSON_SERIALIZER_FIELDS = RELATED_PERSON_SERIALIZER_FIELDS + ['id']

APPLICATION_FORM_SERIALIZER_FIELDS = E_FORM_SERIALIZE_FIELDS + ['id','user','status','consent','attestation_remarks','created_date']

APPLICATION_FORM_DETAILED_SERIALIZER_FIELDS = E_FORM_SERIALIZE_FIELDS + ['id','user','status','consent',{
	'correspondance_addresses': APPLICATION_CORRESPONDANCE_SERIALIZER_FIELDS, 
	'related_persons': APPLICTION_RELATED_PERSON_SERIALIZER_FIELDS, 
}]






