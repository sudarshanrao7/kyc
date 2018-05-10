import React from 'react';
import BaseComponent from '../../utils/common_components/basecomponent';
import Template from "./templates/eform.rt";
import { reduxForm,formValueSelector,SubmissionError } from 'redux-form';
import store,{history} from '../../redux/store';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
    getApplicationFormDetails,
    createApplicationForm,
    updateApplicationForm,
    approveApplicationForm
 } from '../../redux/eform/network/eform_network';
import eformAction from '../../redux/eform/actions/eform_action';
import { uploadFiles,deleteFile } from '../../redux/core/network/file_upload';
import Utils from '../../utils/utils';
import Swal from 'sweetalert2';


class Application extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.doSave = this.doSave.bind(this);
        this.addLocalAddress = this.addLocalAddress.bind(this);
        this.deleteLocalAddress = this.deleteLocalAddress.bind(this);
        this.addRelatedPerson = this.addRelatedPerson.bind(this);
        this.deleteRelatedPerson = this.deleteRelatedPerson.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.onDeleteFile = this.onDeleteFile.bind(this);
        this.goBack = this.goBack.bind(this);
        this.approveRejectApplication = this.approveRejectApplication.bind(this);
        this.state = {
            related_person_template :{
                related_person_type: "",
                kyc_number: "",
                first_name: "",
                last_name: "",
                middle_name: "",
                prefix: "",
                poi_type: "",
                poi_number: "",
                passport_expiry_date: null,
                dl_expiry_date: null,
                other_poi_name: "",
                poi_document: "",
            },
            correspondance_address_template:{
                use_poa_for_local_address:false,
                city:"",
                district:"",
                country:"",
                zipcode:"",
                user:"",
                address:"",
                indian_state:"",
            }
        }
    }

    componentWillMount() {
        if(this.props.isKyc){
            //Bad code.Using application form call to get supporting data.Needs seperate store & api for kyc
            this.props.getApplicationFormDetails(0,true);
        }else{
            let id = 0;
            if(this.props.match && this.props.match.params.application_id){
                id = this.props.match.params.application_id;
            }
            this.props.getApplicationFormDetails(id,true);
        }
    }

    componentWillUnmount () {
        this.props.cleanUp({});
    }
    

    doSave(data){
        if(this.props.previewMode){
            return;
        }
        let params = _.cloneDeep(data);
        if(_.isEmpty(params,"photo")){
            Utils.showErrorAlert("Please upload your photo before submitting!");
            return;
        }
        if(params["is_pan_excempt"] === false && params.pan_document.length === 0){
            Utils.showErrorAlert("Please upload your pan document");
            return;
        }
        if(params["is_pan_excempt"] === true && params.poi_document.length === 0){
            Utils.showErrorAlert("Please upload your proof of identity document");
            return;
        }
        if(params.poa_document.length === 0){
            Utils.showErrorAlert("Please upload your proof of address document");
            return;
        }
        if(data.correspondance_addresses.length === 0){
            Utils.showErrorAlert("Please fill atleast one corrrspondance/local address");
            return;
        }
        params["birth_date"] = Utils.formatServerDate(params["birth_date"])
        params["passport_expiry_date"] = Utils.formatServerDate(params["passport_expiry_date"])
        params["dl_expiry_date"] = Utils.formatServerDate(params["dl_expiry_date"])
        params["poa_passport_expiry_date"] = Utils.formatServerDate(params["poa_passport_expiry_date"])
        params["poa_dl_expiry_date"] = Utils.formatServerDate(params["poa_dl_expiry_date"])

        params["related_persons"] = _.map(params["related_persons"],(item)=>{
            item["passport_expiry_date"] = Utils.formatServerDate(item["passport_expiry_date"])
            item["dl_expiry_date"] = Utils.formatServerDate(item["dl_expiry_date"])
            return item;
        })
        if (!params["consent"]){
            Utils.showErrorAlert("Application form declaration consent is not confirmed!" );
            return;
        }
        if(this.props.match.params.application_id){
            return this.props.updateApplicationForm(params).then((response)=>{
                if(_.includes(this.props.location.pathname,"/review")){
                    history.push("/review");
                }else{
                    history.push("/applications");
                }
            }).catch((error)=>{
                if (error.response && error.response.status && error.response.status === 400) {
                      let error_object =  error.response.data.errors;
                      let validateObject = {}
                      _.forEach(error_object, function(value, key) {
                          if(Array.isArray()){
                            validateObject[key] = value.join(",");
                          }else{
                            validateObject[key] = value
                          }
                      });
                      if(_.has(validateObject,"__all__")){
                            Utils.showErrorAlert("Please fix validation errors, "+validateObject.__all__);  
                      }else{
                        Utils.showErrorAlert("Please fix validation errors");  
                      }
                      throw new SubmissionError(validateObject)
                }
            }); 
        }else{
            return this.props.createApplicationForm(params).then((response)=>{
                if(_.includes(this.props.location.pathname,"/review")){
                    history.push("/review");
                }else{
                    history.push("/applications");
                }
            }).catch((error)=>{
                if (error.response && error.response.status && error.response.status === 400) {
                      let error_object =  error.response.data.errors;
                      let validateObject = {}
                      _.forEach(error_object, function(value, key) {
                          if(Array.isArray()){
                            validateObject[key] = value.join(",");
                          }else{
                            validateObject[key] = value
                          }
                      });
                      if(_.has(validateObject,"__all__")){
                            Utils.showErrorAlert("Please fix validation errors, "+validateObject.__all__);  
                      }else{
                        Utils.showErrorAlert("Please fix validation errors");  
                      }
                      throw new SubmissionError(validateObject)
                }
            }); 
        }
    }

    uploadAvatar(files) {
        if(this.props.previewMode){
            return;
        }
        let that = this;
        const maxSize = 10 * 1024 * 1024; // 10 MiB
        let fileData = new FormData();
        let fileCheckPass = true;
        _.forEach(files, (file)=>{
            if (file.size > maxSize){
                Swal("File Size Limit.", "Maximum upload limit is 10 MB.\nFile exceeds the limit.", "error");    
                fileCheckPass  = false;          
                return;
            }
            fileData.append("files", file);
        });
        if(!fileCheckPass){
            return;
        }
        this.props.uploadFiles(fileData).then((response) => {
            that.props.change("photo",response.data[0]);
        }).catch((error) => {
            //do nothing
        });  
    }   

    onDrop(files,update_key,index=null) {
        if(this.props.previewMode){
            return;
        }
        let that = this;
        const maxSize = 10 * 1024 * 1024; // 10 MiB
        let fileData = new FormData();
        let fileCheckPass = true;
        _.forEach(files, (file)=>{
            if (file.size > maxSize){
                Swal("File Size Limit.", "Maximum upload limit is 10 MB.\nFile exceeds the limit.", "error");    
                fileCheckPass  = false;          
                return;
            }
            fileData.append("files", file);
        });
        if(!fileCheckPass){
            return;
        }
        this.props.uploadFiles(fileData).then((response) => {
            if(update_key === "related_person_document"){
                //One of case...phew.. need better way to handle..
                update_key = "related_persons["+index+"]['poi_document']"
                let attachments =  [...that.props.related_persons[index].poi_document,...response.data];
                that.props.change(update_key.toString(),attachments);
            }else{
                let attachments =  [...that.props[update_key],...response.data];
                that.props.change(update_key,attachments);
            }
        }).catch((error) => {
            //do nothing
        });  
    }   
    onDeleteFile(guid,index,update_key){
        if(this.props.previewMode){
            return;
        }
        let that = this;
        let text = "Would you like to delete this media?";
        if(update_key === "photo"){
             text = "Would you like to delete your photo?";
        }
        Swal({
            title: "Are you sure?",
            text: text,
            type: "info",
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonColor: "#0292d3",
            cancelButtonColor: "#4C555C",
            confirmButtonText: "Yes, I am sure!",
            cancelButtonText: "No",
            useRejections:true
        }).then(() => {
            that.props.deleteFile({ guid: guid }).then(() => {
                if(update_key === "photo"){  
                    that.props.change(update_key,{});
                }else{
                    let attachments = [...that.props[update_key]];
                    attachments.splice(index,1)
                    that.props.change(update_key,attachments);
                }    
            }).catch(() => { });
        }, ()=> { });
    }

    addLocalAddress(){
        if(this.props.previewMode){
            return;
        }
        let localAddresses = [...this.props.correspondance_addresses,this.state.correspondance_address_template];
        this.props.change('correspondance_addresses',localAddresses);
    }

    deleteLocalAddress(index){
        if(this.props.previewMode){
            return;
        }
        let localAddresses = [...this.props.correspondance_addresses];
        localAddresses.splice(index, 1);
        if(localAddresses < 2){
            Utils.showErrorAlert("Need atleast one correspondence address")
            return;
        }
        this.props.change('correspondance_addresses',localAddresses);
    }
    addRelatedPerson(){
        if(this.props.previewMode){
            return;
        }
        let related_persons = [...this.props.related_persons,this.state.related_person_template];
        this.props.change('related_persons',related_persons);
    }

    deleteRelatedPerson(index){
        if(this.props.previewMode){
            return;
        }
        let related_persons = [...this.props.related_persons];
        related_persons.splice(index, 1);
        this.props.change('related_persons',related_persons);
    }

    goBack(){
        history.goBack()
    }

    approveRejectApplication(status){
        let that = this;
        let title = (status === 3) ? "Approval Remarks" : "Rejection Remarks";
        Swal({
            title: title,
            text: "Please enter your observations",
            input: 'text',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonColor: "#0292d3",
            cancelButtonColor: "#4C555C",
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            useRejections:true,
            inputValidator: function (value) {
                return new Promise(function (resolve, reject) {
                    if (value) {
                        resolve();
                    } else {
                        reject('You need to write something!');
                    }
                });
            }
        }).then(function (inputValue) {
            Swal.close();
            that.props.approveApplicationForm({
                'id': that.props.match.params.application_id,
                'remarks': inputValue,
                'status': status 
            }).then(() => {
                if(_.includes(this.props.location.pathname,"/review")){
                    history.push("/review");
                }else{
                    history.push("/applications");
                }
            }).catch(() => { });
        }, function (dismiss) {
        });
    }



    render() {
        if(_.isEmpty(this.props.initialValues) || _.isEmpty(this.props.supporting_data)){
            return (<div></div>);
        }
        return Template.apply(this);
    }
}
const validate = (values) => {
    const errors = {};
    let requiredFields = [
        'first_name', 'last_name','prefix','guardian_first_name','guardian_prefix',
        'guardian_last_name','mother_first_name','mother_last_name','mother_prefix',
        'birth_date','gender','marital_status','citizen','residential_status','occupation_type','address',
        'city','district','zipcode','country','address_type','poa_type','poa_number','email','mobile_country_code',
        'mobile'
    ];

    if(values["is_pan_excempt"] === true){
        requiredFields =  _.concat(requiredFields, ['poi_type','poi_number']);
    }else{
        requiredFields.push("pan_number")
    }
    if(values["poi_type"] === 1){
        requiredFields.push("passport_expiry_date"); 
    }else if(values["poi_type"] === 2){
        requiredFields.push("dl_expiry_date"); 
    }else if(values["poi_type"] === 6){
        requiredFields.push("other_poi_name"); 
    }
    if(values["country"] === "IN"){
        requiredFields.push("indian_state"); 
        requiredFields.push("zipcode"); 
    }
    
    if(values["is_fatca_applicable"]){
        requiredFields =  _.concat(requiredFields, [
            'fatca_country_judistriction',
            'fatca_place_of_birth','fatca_country_of_birth',
            'fatca_address','fatca_city','fatca_district','fatca_country'
        ]);
        if(values["fatca_country"] === "IN"){
            requiredFields.push("fatca_indian_state"); 
            requiredFields.push("fatca_zipcode"); 
        }   
    }

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
  
    if(values["is_pan_excempt"] === false && !_.isEmpty(values["pan_number"]) && !/^([a-z0-9]){9,12}$/i.test(values["pan_number"])){
        errors.pan_number = 'PAN number must be entered in alphanumeric format. Minimum 10,Max 12 digits allowed';
    }

    //using regex instead of 3rd part validator plugin for now... 
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address!';
    }

    if(values.correspondance_addresses){
        const errorList = [];
        let cAddressRequiredFields  =  ['address','city','district','zipcode','country'];
        values.correspondance_addresses.forEach((addressObj, index) => {
            const errorObj = {};
            if(!addressObj["use_poa_for_local_address"]){
                cAddressRequiredFields.forEach(field => {
                    if (!addressObj[field]) {
                        errorObj[field] = 'Required';
                    }
                });
            }
            errorList[index] = errorObj;
        });  
        errors["correspondance_addresses"] = errorList;
    } 
    
    if(values.related_persons){
        const errorList = [];
        let relatedRequiredFields  =  ['related_person_type','first_name','last_name','prefix'];
        values.related_persons.forEach((relatedObj, index) => {
            const errorObj = {};
            if(!relatedObj["kyc_number"]){
                relatedRequiredFields =  _.concat(relatedRequiredFields, ['poi_type','poi_number']);
            }else if( relatedObj["kyc_number"].toString().length !== 10){
                errorObj["kyc_number"] = 'KYC number should be 10 digit number';
            }
            if(values["poi_type"] === 1){//hardcoding for now...need seperate reducers to get all options/choice data.
                relatedRequiredFields.push("passport_expiry_date"); 
            }else if(values["poi_type"] === 2){
                relatedRequiredFields.push("dl_expiry_date"); 
            }else if(values["poi_type"] === 6){
                relatedRequiredFields.push("other_poi_name"); 
            }
            relatedRequiredFields.forEach(field => {
                if (!relatedObj[field]) {
                    errorObj[field] = 'Required';
                }
            });
            errorList[index] = errorObj;
        });  
        errors["related_persons"] = errorList;
    } 
    return errors;
};
const selector = formValueSelector('applicationForm');
const ApplicationForm = reduxForm({ form: 'applicationForm',enableReinitialize: true, validate })(Application);
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getApplicationFormDetails,
        createApplicationForm,
        updateApplicationForm,
        approveApplicationForm,
        uploadFiles,
        deleteFile,
        cleanUp: eformAction.eformCleanup
    }, dispatch);
}

function mapStateToProps(state,ownProps) {
    let previewMode = true;
    let isKyc = false;
    let user = state.auth.authReducer.user;
    let eform = {};
    if(_.has(ownProps,"eform")){
        eform = ownProps.eform;
        isKyc = true;
    }else{
        eform = state.eform.eformReducer.eform;
    }
    if(!_.isEmpty(eform)){
        if(eform.user == user.id && eform.status === 1 && isKyc == false ){
            previewMode = false;
        }
    }
    previewMode = _.has(ownProps,"previewMode") ? ownProps.previewMode : previewMode;
    //bad practice..Cloning for now...Not using reselect for memoize...
    let initialValues = _.cloneDeep(eform);
    initialValues["birth_date"] = Utils.parseServerDate(initialValues["birth_date"])
    initialValues["passport_expiry_date"] = Utils.parseServerDate(initialValues["passport_expiry_date"])
    initialValues["dl_expiry_date"] = Utils.parseServerDate(initialValues["dl_expiry_date"])
    initialValues["poa_passport_expiry_date"] = Utils.parseServerDate(initialValues["poa_passport_expiry_date"])
    initialValues["poa_dl_expiry_date"] = Utils.parseServerDate(initialValues["poa_dl_expiry_date"])

    initialValues["related_persons"] = _.map(initialValues["related_persons"],(item)=>{
        initialValues["passport_expiry_date"] = Utils.parseServerDate(item["passport_expiry_date"])
        initialValues["dl_expiry_date"] = Utils.parseServerDate(item["dl_expiry_date"])
        return item;
    });

    return {
        isKyc:isKyc,
        previewMode:previewMode,
        user:user,
        initialValues:initialValues,
        eform:eform,
        correspondance_addresses: selector(state, 'correspondance_addresses'),
        related_persons: selector(state, 'related_persons'),
        is_fatca_applicable: selector(state, 'is_fatca_applicable'),
        poi_type: selector(state, 'poi_type'),
        poa_type: selector(state, 'poa_type'),
        poi_document: selector(state, 'poi_document'),
        poa_document: selector(state, 'poa_document'),
        pan_document: selector(state, 'pan_document'),
        photo: selector(state, 'photo'),
        supporting_data:state.eform.eformReducer.supporting_data
    };
}

const ApplicationFormConnected = connect(mapStateToProps, mapDispatchToProps)(ApplicationForm);
export default ApplicationFormConnected;
