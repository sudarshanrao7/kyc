const eformListFill = (eform_list, paginate_info) => ({
	type: 'EFORM_LIST_FILL',
	eform_list,
	paginate_info,
});

const eformInstanceFill = (eform, supporting_data) => ({
	type: 'EFORM_INSTANCE_FILL',
	eform,
	supporting_data,
});

const eformCleanup = () => ({
	type: 'EFORM_CLEANUP',
});

export default {
    eformListFill,
    eformInstanceFill,
    eformCleanup,
};