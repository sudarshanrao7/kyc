let initialState = {
    eform: {},
    eform_list:[],
    paginate_info: {
        page: 0,
    },      
	supporting_data: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "EFORM_LIST_FILL":
            if(!action.eform_list) {
                return state;
            }
            return Object.assign({}, state, {
                eform_list: action.eform_list,
                paginate_info: action.paginate_info
            });
        case "EFORM_INSTANCE_FILL":
            if(!action.eform) {
                return state;
            }
            return Object.assign({}, state, {
                eform: action.eform,
                supporting_data:action.supporting_data
            });
        case "EFORM_CLEANUP":
            return Object.assign({}, initialState);         

        default:
            return state;

    }
}        