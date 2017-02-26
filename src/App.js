import React, {Component} from 'react';
import Countries from './Countries'
import ComboField from './ComboField'
import ConditionField from './ConditionField'
import scoresTable from './scoresData'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientGender: 1,
            patientAge: '',
            patientFilterSpeed: '',
            patientPressureSist: '',
            patientPressureDiast: '',
            patientIsSmoking: 0,
            patientHasHeartIllness: 0,
            patientHasArteryOperated: 0,
            patientHasFamilyHyperchole: 0,
            calculationReady: false,
            resultRiskGroup: '',
            resultLPNPLevel: '',
            resultRecommendations: '',
            resultComments: ''
        };

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    resetCalculation() {
        this.setState({
            patientGender: 1,
            patientAge: '',
            patientFilterSpeed: '',
            patientPressureSist: '',
            patientPressureDiast: '',
            patientIsSmoking: 0,
            patientHasHeartIllness: 0,
            patientHasArteryOperated: 0,
            patientHasFamilyHyperchole: 0,
            calculationReady: false,
            resultRiskGroup: '',
            resultLPNPLevel: '',
            resultRecommendations: '',
            resultComments: ''
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log('This = ', this);
        var cholesterol = (this.patientCholesterol.state.dimensionType === 1) ? Math.round(this.patientCholesterol.state.fieldValue * 0.026) : Math.round(this.patientCholesterol.state.fieldValue);
        // console.log('countryType = ', this.patientCountry.state.patientCountryType);
        // console.log('patientAge = ', this.state.patientAge);
        // console.log('patientGender = ', this.state.patientGender);
        // console.log('patientPressureSist = ', this.state.patientPressureSist);
        // console.log('patientIsSmoking = ', this.state.patientIsSmoking);
        // console.log('cholesterol = ', cholesterol);
        var rec = scoresTable.find((row) => {
            return (this.patientCountry.state.patientCountryType === row.countryType &&
                    this.state.patientAge >= row.ageLow &&
                    this.state.patientAge <= row.ageHigh &&
                    this.state.patientGender === row.gender &&
                    this.state.patientPressureSist >= row.pressureLow &&
                    this.state.patientPressureSist <= row.pressureHigh &&
                    this.state.patientIsSmoking === row.smoking &&
                    cholesterol === row.cholesterol
            );
        });
        console.log('Score rec = ', rec.score);
        if (rec.score >= 10 ||
            this.state.patientFilterSpeed < 30 ||
            (this.patientDiabetes.state.hasDiabetes === 1 && this.patientDiabetes.state.hasComplications === 3 &&
            (this.state.patientIsSmoking === 1 || this.state.patientHasFamilyHyperchole === 1 ||
            this.state.patientPressureSist > 140 || this.state.patientPressureDiast > 90 || cholesterol > 8)) ||
            (this.state.patientHasHeartIllness === 1 || this.state.patientHasArteryOperated === 1 ||
            this.patientDiabetes.state.hasDiabetes === 2 || this.patientDiabetes.state.hasComplications > 3)) {
            this.setState({resultRiskGroup: 'очень высокий риск'});
        } else if ((rec.score >= 5 && rec.score < 10) ||
            (this.state.patientHasFamilyHyperchole === 1 ||
            this.state.patientPressureSist > 180 ||
            this.state.patientPressureDiast > 110) ||
            (this.state.patientFilterSpeed >= 30 && this.state.patientFilterSpeed <= 59)) {
            this.setState({resultRiskGroup: 'высокий риск'});
        } else if ((rec.score >= 1 && rec.score < 5) ||
            (this.patientDiabetes.state.hasDiabetes === 1 && this.patientDiabetes.state.hasComplications === 3)) {
            this.setState({resultRiskGroup: 'умеренный риск'});
        } else if (rec.score < 1) {
            this.setState({resultRiskGroup: 'низкий риск'});
        } else {
            this.setState({resultRiskGroup: 'неопределённый риск'});
        }
        this.setState({calculationReady: true});
    }

    handleValueChange(e) {
        var value = parseInt(e.target.value, 10);
        var name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        var screen;
        if (this.state.calculationReady) {
            screen = (
                <div className="well">
                    <h1>Результаты расчёта</h1>
                    <p><b>Группа риска: </b>{this.state.resultRiskGroup}</p>
                    <p><b>Целевой уровень ЛПНП: </b>{this.state.resultLPNPLevel}</p>
                    <p><b>Рекомендованная терапия: </b>{this.state.resultRecommendations}</p>
                    <p>{this.state.resultComments}</p>

                    <button type="button" className="btn btn-primary" onClick={this.resetCalculation.bind(this)}>Новый расчёт</button>
                </div>
            )
        } else {
            screen = (
                <div className="well">
                    <h1>Калькулятор дозировок статинов</h1>
                    <p>Пожалуйста, введите данные пациента для расчёта безопасных дозировок статинов, направленных на снижение уровня ЛПНП-холестирина в крови.</p>
                    <p>Все поля обязательны для заполнения.</p>

                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group">
                            <label>Пол пациента</label>
                            <div className="radio" id="patient-gender">
                                <label className="radio-inline">
                                    <input type="radio" name="patientGender" onChange={this.handleValueChange} checked={this.state.patientGender === 1} value="1" /> Мужской
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="patientGender" onChange={this.handleValueChange} checked={this.state.patientGender === 0} value="0" /> Женский
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Возраст пациента (полных лет)</label>
                            <input className="form-control" type="number" min="0" max="150" id="patient-age" name="patientAge" onChange={this.handleValueChange} value={this.state.patientAge} />
                        </div>

                        <div className="form-group">
                            <label>Страна проживания пациента</label>
                            <Countries ref={(refPatientCountry) => this.patientCountry = refPatientCountry}/>
                        </div>

                        <ComboField inputID="patient-cholesterol" inputName="patientCholesterol" inputLabel="Уровень холестерина в крови пациента" ref={(refPatientCholesterol) => this.patientCholesterol = refPatientCholesterol} />

                        <ComboField inputID="patient-cholesterol-lpnp" inputName="patientCholesterolLPNP" inputLabel="Уровень холестерина-ЛПНП в крови пациента" ref={(refPatientCholesterolLPNP) => this.patientCholesterolLPNP = refPatientCholesterolLPNP} />

                        <div className="form-group">
                            <label>Скорость клубочковой фильтрации (СКФ) пациента (мл/мин)</label>
                            <input className="form-control" type="number" min="0" id="patient-filter-speed" name="patientFilterSpeed" onChange={this.handleValueChange} value={this.state.patientFilterSpeed} />
                        </div>

                        <div className="form-group">
                            <label>Уровень артериального давления пациента (мм рт.ст.)</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <span className="help-block">Систолическое давление</span>
                                    <input className="form-control" type="number" min="0" id="patient-pressure-sist" name="patientPressureSist" onChange={this.handleValueChange} value={this.state.patientPressureSist} />
                                </div>
                                <div className="col-md-6">
                                    <span className="help-block">Диастолическое давление</span>
                                    <input className="form-control" type="number" min="0" id="patient-pressure-diast" name="patientPressureDiast" onChange={this.handleValueChange} value={this.state.patientPressureDiast} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Курит ли пациент?</label>
                            <div className="radio" id="patient-is-smoking">
                                <label className="radio-inline">
                                    <input type="radio" name="patientIsSmoking" onChange={this.handleValueChange} checked={this.state.patientIsSmoking === 0} value="0" /> Нет
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="patientIsSmoking" onChange={this.handleValueChange} checked={this.state.patientIsSmoking === 1} value="1" /> Да
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Имеются ли у пациента серьезные заболевания сердечно-сосудистой системы?</label>
                            <span className="help-block">Например, инфаркт миокарда, острое нарушение мозгового кровообращения (инсульт), транзиторная ишемическая атака, аневризма аорты, атеросклероз периферических артерий (перемежающая хромота).</span>
                            <div className="radio" id="patient-has-heart-illness">
                                <label className="radio-inline">
                                    <input type="radio" name="patientHasHeartIllness" onChange={this.handleValueChange} checked={this.state.patientHasHeartIllness === 0} value="0" /> Нет
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="patientHasHeartIllness" onChange={this.handleValueChange} checked={this.state.patientHasHeartIllness === 1} value="1" /> Да
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Производилось ли пациенту стентирование или шунтирование коронарных артерий?</label>
                            <div className="radio" id="patient-has-artery-operated">
                                <label className="radio-inline">
                                    <input type="radio" name="patientHasArteryOperated" onChange={this.handleValueChange} checked={this.state.patientHasArteryOperated === 0} value="0" /> Нет
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="patientHasArteryOperated" onChange={this.handleValueChange} checked={this.state.patientHasArteryOperated === 1} value="1" /> Да
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Есть ли у пациента семейный анамнез гиперхолестеринемии?</label>
                            <div className="radio" id="patient-has-family-hyperchole">
                                <label className="radio-inline">
                                    <input type="radio" name="patientHasFamilyHyperchole" onChange={this.handleValueChange} checked={this.state.patientHasFamilyHyperchole === 0} value="0" /> Нет
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="patientHasFamilyHyperchole" onChange={this.handleValueChange} checked={this.state.patientHasFamilyHyperchole === 1} value="1" /> Да
                                </label>
                            </div>
                        </div>

                        <ConditionField ref={(refPatientDiabetes) => this.patientDiabetes = refPatientDiabetes}/>

                        <button type="submit" className="btn btn-primary">Рассчитать</button>
                    </form>
                </div>
            );
        }

        return screen
    }
}

export default App;
