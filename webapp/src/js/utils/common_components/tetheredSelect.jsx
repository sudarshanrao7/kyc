import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import Tether from 'tether';

class TetheredChildrenComponent extends React.Component {
  render() {
    return this.props.children;
  }

  componentDidMount() {
    this.props.position();
  }

  componentDidUpdate() {
    this.props.position();
  }
}

class TetherComponent extends React.Component {
  constructor(props) {
    super(props);
    this.position = this.position.bind(this);
  }

  componentDidMount() {
    this.tetherContainer = document.createElement('div');
    document.body.appendChild(this.tetherContainer);

    this.renderTetheredContent();
  }

  componentDidUpdate() {
    this.renderTetheredContent();
  }

  componentWillUnmount() {
    this.destroyTetheredContent();
  }

  position() {
    if (!this.tether) {
      this.tether = new Tether({
        ...this.props.options,
        element: this.tetherContainer,
        target: this.props.target,
      });
    }

    if (this.props.matchWidth) {
      this.tetherContainer.style.width = `${this.props.target.clientWidth}px`;
    }

    this.tether.position();
  }

  renderTetheredContent() {
    ReactDOM.render(
      <TetheredChildrenComponent
        target={this.props.target}
        position={this.position}
      >
        {this.props.children}
      </TetheredChildrenComponent>,
      this.tetherContainer
    );
  }

  destroyTetheredContent() {
    ReactDOM.unmountComponentAtNode(this.tetherContainer);

    this.tether.destroy();

    document.body.removeChild(this.tetherContainer);
  }

  render() {
    return null;
  }
}

export class TetheredSelectWrap extends Select {
  constructor(props) {
    super(props);

    this.renderOuter = this._renderOuter;
  }

  componentDidMount() {
    super.componentDidMount.call(this);

    this.dropdownFieldNode = ReactDOM.findDOMNode(this);
  }

  _renderOuter() {
    const menu = super.renderOuter.apply(this, arguments);

    // Don't return an updated menu render if we don't have one
    if (!menu) {
      return;
    }

    const options = {
      attachment: 'top left',
      targetAttachment: 'bottom left',
      constraints: [
        {
          to: 'window',
          attachment: 'together',
        }
      ]
    };

    return (
      <TetherComponent
        target={this.dropdownFieldNode}
        options={options}
        matchWidth
      >
        {/* Apply position:static to our menu so that it's parent will get the correct dimensions and we can tether the parent */}
        {React.cloneElement(menu, {style: {position: 'static'}})}
      </TetherComponent>
    );
  }
}

// Call the AsyncCreatable code from react-select with our extended tether class
class TetheredSelect extends React.Component {
  render () {
    return (
      <TetheredSelectWrap.Async {...this.props}>
        {(asyncProps) => (
          <TetheredSelectWrap.Creatable {...this.props}>
            {(creatableProps) => (
              <TetheredSelectWrap
                {...asyncProps}
                {...creatableProps}
                onInputChange={(input) => {
                  creatableProps.onInputChange(input);
                  return asyncProps.onInputChange(input);
                }}
              />
              )}
            </TetheredSelectWrap.Creatable>
            )}
          </TetheredSelectWrap.Async>
    );
  }
}

export default TetheredSelect;