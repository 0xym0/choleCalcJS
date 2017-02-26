import React, {Component} from 'react';

class ConditionField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleComplications: false,
            hasDiabetes: 0,
            hasComplications: 3
        };
    }

    patientHasDiabetesChange(e) {
        var value = parseInt(e.target.value, 10);
        if (value === 1) {
            this.setState({
                visibleComplications: true,
                hasDiabetes: 1
            });
        } else {
            this.setState({
                visibleComplications: false,
                hasDiabetes: value
            });
        }
    }

    patientHasComplicationsChange(e) {
        var value = parseInt(e.target.value, 10);
        this.setState({
            hasComplications: value
        });
    }

    render() {

        var isVisible = this.state.visibleComplications;

        return (
            <div className="form-group">
                <label>Есть ли у пациента сахарный диабет?</label>
                <div className="radio" id="patient-has-diabetes">
                    <label className="radio-inline">
                        <input type="radio" name="patientHasDiabetes" checked={this.state.hasDiabetes === 0} value="0" onChange={this.patientHasDiabetesChange.bind(this)} /> Нет
                    </label>
                    <label className="radio-inline">
                        <input type="radio" name="patientHasDiabetes" checked={this.state.hasDiabetes === 1} value="1" onChange={this.patientHasDiabetesChange.bind(this)} /> Сахарный диабет 1-го типа
                    </label>
                    <label className="radio-inline">
                        <input type="radio" name="patientHasDiabetes" checked={this.state.hasDiabetes === 2} value="2" onChange={this.patientHasDiabetesChange.bind(this)} /> Сахарный диабет 2-го типа
                    </label>
                </div>

                <div className={'form-group ' + (isVisible ? '' : 'hidden')}>
                    <label>Имеются ли осложнения?</label>
                    <div className="radio" id="patient-has-complications">
                        <label className="radio-inline">
                            <input type="radio" name="patientHasComplications" checked={this.state.hasComplications === 3} value="3" onChange={this.patientHasComplicationsChange.bind(this)} /> Нет
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="patientHasComplications" checked={this.state.hasComplications === 5} value="5" onChange={this.patientHasComplicationsChange.bind(this)} /> Нефропатия
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="patientHasComplications" checked={this.state.hasComplications === 7} value="7" onChange={this.patientHasComplicationsChange.bind(this)} /> Ретинопатия
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="patientHasComplications" checked={this.state.hasComplications === 11} value="11" onChange={this.patientHasComplicationsChange.bind(this)} /> Нейропатия
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConditionField;