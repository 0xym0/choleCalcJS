import React, {Component} from 'react';

class ComboField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensionName: 'ммоль/л',
            dimensionType: 0,
            fieldValue: ''
        };
    }

    fieldValueChange(e) {
        this.setState({
            fieldValue: parseFloat(e.target.value)
        });
    }

    dimensionNameChange(e) {
        e.preventDefault();
        this.setState({
            dimensionName: e.target.innerHTML,
            dimensionType: (e.target.innerHTML === "ммоль/л") ? 0 : 1
        });
    }

    render() {
        return (
            <div className="form-group">
                <label>{this.props.inputLabel}</label>
                <div className="input-group">
                    <input className="form-control" type="number" min={this.state.dimensionType === 1 ? 0 : 0.0} max={this.state.dimensionType === 1 ? 500 : 20.0} step={this.state.dimensionType === 1 ? 1 : 0.01} required="required" id={this.props.inputID} name={this.props.inputName} onChange={this.fieldValueChange.bind(this)} value={this.state.fieldValue} />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.dimensionName} <span className="caret"></span></button>
                        <ul className="dropdown-menu dropdown-menu-right">
                            <li><a href="#" onClick={this.dimensionNameChange.bind(this)}>ммоль/л</a></li>
                            <li><a href="#" onClick={this.dimensionNameChange.bind(this)}>мг/дл</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

ComboField.propTypes = {
    inputLabel: React.PropTypes.string.isRequired,
    inputName: React.PropTypes.string.isRequired,
    inputID: React.PropTypes.string.isRequired
};

export default ComboField;