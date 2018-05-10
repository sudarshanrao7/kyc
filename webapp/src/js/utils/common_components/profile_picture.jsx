import BaseComponent from '../../utils/common_components/basecomponent';
import  Template from "./templates/profile_picture";
import React from 'react';
import Avatar from 'react-toolbox/lib/avatar';
import PropTypes from 'prop-types';


//-----------IMPORTANT--------------------------------------------------------------------

// when changing the order of colors here please make corresponding changed in mobile too.


//-----------IMPORTANT--------------------------------------------------------------------
let flat_ui_colors = [
    '#E53935',
    '#D81B60',
    '#8E24AA',
    '#5E35B1',
    '#3949AB',
    '#1E88E5',
    '#039BE5',
    '#00ACC1',
    '#00897B',
    '#43A047',
    '#7CB342',
    '#C0CA33',
    '#FDD835',
    '#FFB300',
    '#FB8C00',
    '#F4511E',
    '#6D4C41',
    '#757575',
    '#546E7A'
];

const ProfileAvatar = (props) => {
    if(!_.has(props,"user")){
         return (<div></div>);
    }
    let user = props.user;
    let className = _.has(props, 'className') ? props.className : '';
    let onClick = _.has(props, 'onClick') ? props.onClick : () => { };
    let sizePx = props.size + "px";
    let fontSizePx = (props.size) / 2 + "px";   
    let avatar_url = "";
    if (_.has(user,"avatar_url_tb") &&  user.avatar_url_tb !== null) {
        avatar_url = user.avatar_url_tb;
    } else if (_.has(user,"avatar_url") &&  user.avatar_url !== null) {
        avatar_url = user.avatar_url;
    }

    if(avatar_url !== ""){
        if(props.profile_type === "square"){
            return (
            <div onClick={onClick} className="thumbnail box-150-150" style={{
                backgroundImage: `url(${avatar_url})`,
                backgroundSize:'cover'
             }} />
            );    
        } else if (props.profile_type === "square_big") {
            return (
                <div onClick={onClick} className="thumbnail box-250-250" style={{
                    backgroundImage: `url(${avatar_url})`,
                    backgroundSize:'cover' 
                }} />
            );
        }else if(props.profile_type === "circle"){
            return ( 
                <div onClick={onClick} className={`profile-avatar ${className}`}  style={{
                    backgroundImage: `url(${avatar_url})` ,
                    backgroundSize:'cover',
                    width:sizePx,
                    height:sizePx,
                    flexGrow:0,flexShrink:0
                }} />
            );
        }
    }else if(_.has(user,"name") && user.name && user.name !== ""){
        let name = user.name;
        let nameArray = _.compact(name.split(" "));
        let firstNameChar =  nameArray[0].charAt(0);
        let lastNameChar =  nameArray.length > 1 ? nameArray[nameArray.length-1].charAt(0) : nameArray[0].charAt(1);
        let profileShortName = firstNameChar +  lastNameChar ;
        profileShortName = profileShortName.toUpperCase();
        let charCode = profileShortName.charCodeAt(0) + profileShortName.charCodeAt(1);
        // modulus
        charCode = charCode % flat_ui_colors.length;    
        let background_color = flat_ui_colors[charCode];  
       
        if(props.profile_type === "square"){
            return (
                <div onClick={onClick} className={`row profile-picture-normal ${className}`} style={{backgroundColor: background_color}}>
                    <div className="profile-picture-normal-no-avatar">{profileShortName}</div>
                </div>
            );    
        } else if (props.profile_type === "square_big") {
            return (
                <div onClick={onClick} className={`row profile-picture-big ${className}`}  style={{ backgroundColor: background_color }}>
                    <div className="profile-picture-big-no-avatar">{profileShortName}</div>
                </div>
            );
        }else if(props.profile_type === "circle"){
            return ( 
                <div onClick={onClick} style={{flexGrow:0,flexShrink:0,width:sizePx,height:sizePx,lineHeight:sizePx,fontSize:fontSizePx,backgroundColor:'transparent'}} className={`profile-avatar  ${className}`}  >
                            <div className="vertical-align justify-center " style={{fontSize:fontSizePx,width:sizePx,height:sizePx,lineHeight:sizePx,backgroundColor: background_color,border: '2px solid white',borderRadius:'50%'}}>{profileShortName}</div>
                    </div>
            );
        }
    }else{
        return (<div></div>);
    }

}; 

ProfileAvatar.propTypes = {
     user: PropTypes.object,
     profile_type:PropTypes.string,
     size:PropTypes.number,
};

ProfileAvatar.defaultProps = {
  profile_type: 'square',
  size:40,
};

export default ProfileAvatar;