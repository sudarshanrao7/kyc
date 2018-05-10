import React, { Component } from 'react';
import TinyMCE from 'react-tinymce';
import PropTypes from 'prop-types';

const RichEditableField = (props)=>{
    let basic_toolbar = _.has(props,"basic_toolbar") ? props.basic_toolbar : false;
    let toolbar = 'undo redo | formatselect bullist numlist | bold italic link | paste';
    let block_formats =  'Paragraph=p;Heading 5=h5;Heading 4=h4;Heading 3=h3;Heading 2=h2;Heading 1=h1';
    if(basic_toolbar){
        toolbar = 'undo redo | bullist numlist | bold italic';
        block_formats = 'Paragraph=p;';
    }

    let   editorConfig = {
        selector: "textarea",
        plugins: 'link,lists,paste,autoresize',
        toolbar: toolbar,
        block_formats: block_formats,
        menubar: false,
        statusbar: false,
        body_class: 'editable-field-content',
        paste_word_valid_elements: 'b,strong,i,em,h5,h4,h3,h2,h1,p,li,ul,ol,a',
        paste_retain_style_properties: 'none',
        paste_strip_class_attributes: 'none',
        paste_remove_styles: true,
        branding:false
    };    

    const { input: { value, onChange,onFocus,onBlur } } = props; 
    const { id } = props;
    const label = props.label || "";
    const error=  ( props.meta.error && props.meta.touched) ? props.meta.error : "";
    const hasError = (error === "") ? false : true;
    const className = 'reduxform-select-container '  +
                (hasError? 'has-error' : '');

  const editorContent = ()=>{
    return tinyMCE.get(props.id) ? tinyMCE.get(props.id).getContent() : null;
  };
  const setEditorContent = ()=>{
    return tinyMCE.get(props.id).execCommand('mceInsertContent', false, props.input.value);
  };

    return (
        <div  className={className}>
        <div className="m-b-10 material-label">{label}</div>      
            <TinyMCE
                id={id}
                content={value}
                config={editorConfig}
                // onBlur={() => {
                //     onBlur();
                //     onChange(this.editorContent());
                // }}
                onChange={() => {
                    onChange(editorContent());
                }}                
            />
          <span className="field-error-message" >{error}</span>
    </div>       
    ); 
}; 
export default RichEditableField;

