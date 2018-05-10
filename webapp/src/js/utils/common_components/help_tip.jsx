import React  from 'react';
class HelpTooltip extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

    render() {
        const className = _.has(this.props, 'className') ? (this.props.className + " info-spot") : 'info-spot';
    return (
        <span className={className}>
          <i className="fa fa-question-circle"></i>
          <span className="info-bubble">{this.props.children}</span>
        </span>
    );
  }
} 

export default HelpTooltip;