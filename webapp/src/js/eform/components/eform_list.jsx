import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import  Template from "./templates/eform_list.rt";
import store,{history}  from '../../redux/store';
import Utils from '../../utils/utils';
import BaseComponent from '../../utils/common_components/basecomponent';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {getApplicationList} from '../../redux/eform/network/eform_network';
import eformAction from '../../redux/eform/actions/eform_action';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

class EformList extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.addEform = this.addEform.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onFilter = this.onFilter.bind(this);     
        this.editEform = this.editEform.bind(this);
        this.state = {

        };
    };
    
    componentWillMount() {
        this.props.getApplicationList({
            ...this.props.paginate_info,
            show_all:this.props.show_all
        });
    }

    componentWillUnmount() {
        this.props.cleanUp({});
    }

    onFilter(nextProps){
        this.props.getApplicationList({
            page:0,
            sort_by:this.props.paginate_info.sort_by,
            asc:this.props.paginate_info.asc,
            filters: {...nextProps.additionalFilters},
            show_all:this.props.show_all
        });
    }    
    onPageChange(page){
        this.props.getApplicationList({page:page,
            sort_by:this.props.paginate_info.sort_by,
            asc:this.props.paginate_info.asc,
            show_all:this.props.show_all,
            filters: {...this.props.paginate_info.filters}
        });
    }    
    onSort(sortData){
        let asc = false;
        if(sortData.direction === 1){
            asc = true;
        }
        this.props.getApplicationList({page:0,
            sort_by:sortData.column,
            asc:asc,
            show_all:this.props.show_all,
            filters: {...this.props.paginate_info.filters}
        });
    } 

    addEform(){
        history.push("/applications/add");
    }

    editEform(form) {
        if(this.props.show_all){
            history.push("/review/"+form.id);
        }else{
            history.push("/applications/"+form.id);
        }
        
    }

    render() {    
        return Template.apply(this);
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getApplicationList,
        cleanUp:eformAction.eformCleanup
    }, dispatch);
}
function mapStateToProps(state, ownProps) {
    return {
        user: state.auth.authReducer.user,
        eform_list: state.eform.eformReducer.eform_list,
        paginate_info: state.eform.eformReducer.paginate_info,
    };
}
EformList.propTypes = {
    'show_all': PropTypes.bool,
};

EformList.defaultProps = {
    "show_all": false
};

const EformListConnected = connect(mapStateToProps, mapDispatchToProps)(EformList);
export default EformListConnected;
