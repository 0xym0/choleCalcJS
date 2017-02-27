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

    medicineCalculation(deltaLPNP) {
        if (deltaLPNP >= 0) {
            if (deltaLPNP <= 0.37) {
                return "Аторвастатин в дозе 10 мг/сутки или Розувастатин в дозе 5 мг/сутки.";
            } else if (deltaLPNP <= 0.43) {
                return "Аторвастатин в дозе 20 мг/сутки или Розувастатин в дозе 10 мг/сутки.";
            } else if (deltaLPNP <= 0.49) {
                return "Аторвастатин в дозе 40 мг/сутки или Розувастатин в дозе 20 мг/сутки.";
            } else if (deltaLPNP <= 0.55) {
                return "Аторвастатин в дозе 80 мг/сутки или Розувастатин в дозе 40 мг/сутки.";
            } else {
                return "Аторвастатин в дозе 80 мг/сутки или Розувастатин в дозе 40 мг/сутки. Это максимально допустимые дозы препаратов, однако их в данном случае недостаточно. Необходимо принять дополнительные меры по снижению уровня холестерина в крови.";
            }
        } else {
            return "Текущие показатели ЛПНП-холестерина не превышают целевого значения. Назначение или коррекция дозы статинов не требуется."
        }
    }

    collectCalculationParameters() {
        let patient = {};
        for (let i in this.state) {
            if (this.state.hasOwnProperty(i)) {
                let match = i.match(/^patient([A-Za-z]+)$/);
                if (match !== null) {
                    let field = match[1].charAt(0).toLowerCase() + match[1].slice(1);
                    patient[field] = this.state[i];
                }
            }
        }
        patient.cholesterol = (this.patientCholesterol.state.dimensionType === 1) ?
            Math.round(this.patientCholesterol.state.fieldValue * 0.026) :
            Math.round(this.patientCholesterol.state.fieldValue);
        patient.cholesterolLPNP = (this.patientCholesterolLPNP.state.dimensionType === 1) ?
            Math.round(this.patientCholesterolLPNP.state.fieldValue * 0.0259) :
            Math.round(this.patientCholesterolLPNP.state.fieldValue);
        patient.targetLPNP = 3.0;
        patient.countryCode = this.patientCountry.state.patientCountry;
        patient.countryType = this.patientCountry.state.patientCountryType;
        patient.hasDiabetes = this.patientDiabetes.state.hasDiabetes;
        patient.hasComplications = this.patientDiabetes.state.hasComplications;
        return patient
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log('countryType = ', this.patientCountry.state.patientCountryType);
        // console.log('patientAge = ', this.state.patientAge);
        // console.log('patientGender = ', this.state.patientGender);
        // console.log('patientPressureSist = ', this.state.patientPressureSist);
        // console.log('patientIsSmoking = ', this.state.patientIsSmoking);
        let patient = this.collectCalculationParameters();
        const rec = scoresTable.find((row) => {
            return (patient.countryType === row.countryType &&
                    patient.age >= row.ageLow &&
                    patient.age <= row.ageHigh &&
                    patient.gender === row.gender &&
                    patient.pressureSist >= row.pressureLow &&
                    patient.pressureSist <= row.pressureHigh &&
                    patient.isSmoking === row.smoking &&
                    patient.cholesterol === row.cholesterol
            );
        });

        // console.log('Score rec = ', rec.score);
        if (rec.score >= 10 ||
            patient.filterSpeed < 30 ||
            (patient.hasDiabetes === 1 && patient.hasComplications === 3 && (patient.isSmoking === 1 || patient.hasFamilyHyperchole === 1 || patient.pressureSist > 140 || patient.pressureDiast > 90 || patient.cholesterol > 8)) ||
            (patient.hasHeartIllness === 1 || patient.hasArteryOperated === 1 || patient.hasDiabetes === 2 || patient.hasComplications > 3)) {

            this.setState({resultRiskGroup: 'очень высокий риск'});
            patient.targetLPNP = (patient.cholesterolLPNP > 3.5) ? 1.8 : (patient.cholesterolLPNP / 2);
            this.setState({resultLPNPLevel: patient.targetLPNP + ' ммоль/л'});
            if (patient.age <= 40) {
                this.setState({resultRecommendations: "Высокий риск развития сердечно-сосудистых осложнений. Учитывая молодой возраст, назначение статинов не показано. Рекомендовано расширение физической активности и коррекция диеты."});
            } else {
                this.setState({resultRecommendations: this.medicineCalculation(patient.cholesterolLPNP - patient.targetLPNP)});
            }
        } else if ((rec.score >= 5 && rec.score < 10) ||
            (patient.hasFamilyHyperchole === 1 || patient.pressureSist > 180 || patient.pressureDiast > 110) ||
            (patient.filterSpeed >= 30 && patient.filterSpeed <= 59)) {

            this.setState({resultRiskGroup: 'высокий риск'});
            patient.targetLPNP = (patient.cholesterolLPNP > 5.1) ? 2.6 : (patient.cholesterolLPNP / 2);
            this.setState({resultLPNPLevel: patient.targetLPNP + ' ммоль/л'});
            if (patient.age <= 40) {
                this.setState({resultRecommendations: "Высокий риск развития сердечно-сосудистых осложнений. Учитывая молодой возраст, назначение статинов не показано. Рекомендовано расширение физической активности и коррекция диеты."});
            } else {
                this.setState({resultRecommendations: this.medicineCalculation(patient.cholesterolLPNP - patient.targetLPNP)});
            }
        } else if ((rec.score >= 1 && rec.score < 5) ||
            (patient.hasDiabetes === 1 && patient.hasComplications === 3)) {
            this.setState({resultRiskGroup: 'умеренный риск'});
            this.setState({resultLPNPLevel: patient.targetLPNP + ' ммоль/л'});
            if (patient.age <= 40) {
                this.setState({resultRecommendations: "Назначение или коррекция дозы статинов не требуется."});
            } else {
                this.setState({resultRecommendations: this.medicineCalculation(patient.cholesterolLPNP - patient.targetLPNP)});
            }
        } else if (rec.score < 1) {
            this.setState({resultRiskGroup: 'низкий риск'});
            this.setState({resultLPNPLevel: patient.targetLPNP + ' ммоль/л'});
            if (patient.age <= 40) {
                this.setState({resultRecommendations: "Назначение или коррекция дозы статинов не требуется."});
            } else {
                this.setState({resultRecommendations: this.medicineCalculation(patient.cholesterolLPNP - patient.targetLPNP)});
            }
        } else {
            this.setState({resultRiskGroup: 'неопределённый риск'});
            this.setState({resultLPNPLevel: 'не определён'});
            this.setState({resultRecommendations: "Проконсультируйтесь со специалистом."});
        }
        this.setState({calculationReady: true});
    }

    handleValueChange(e) {
        let name = e.target.name;
        let value = (name === 'patientFilterSpeed') ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
        this.setState({
            [name]: value
        });
    }

    render() {
        let screen;
        if (this.state.calculationReady) {
            screen = (
                <div className="well">
                    <h1>Результаты расчёта</h1>
                    <p><b>Группа риска: </b>{this.state.resultRiskGroup}</p>
                    <p><b>Целевой уровень ЛПНП: </b>{this.state.resultLPNPLevel}</p>
                    <p><b>Рекомендованная терапия: </b>{this.state.resultRecommendations}</p>

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
                            <input className="form-control" type="number" min={0} max={150} required="required" id="patient-age" name="patientAge" onChange={this.handleValueChange} value={this.state.patientAge} />
                        </div>

                        <div className="form-group">
                            <label>Страна проживания пациента</label>
                            <Countries ref={(refPatientCountry) => this.patientCountry = refPatientCountry}/>
                        </div>

                        <ComboField inputID="patient-cholesterol" inputName="patientCholesterol" inputLabel="Уровень холестерина в крови пациента" ref={(refPatientCholesterol) => this.patientCholesterol = refPatientCholesterol} />

                        <ComboField inputID="patient-cholesterol-lpnp" inputName="patientCholesterolLPNP" inputLabel="Уровень холестерина-ЛПНП в крови пациента" ref={(refPatientCholesterolLPNP) => this.patientCholesterolLPNP = refPatientCholesterolLPNP} />

                        <div className="form-group">
                            <label>Скорость клубочковой фильтрации (СКФ) пациента (мл/мин/1,73м²)</label>
                            <input className="form-control" type="number" min={0.0} max={200.0} required="required" id="patient-filter-speed" name="patientFilterSpeed" onChange={this.handleValueChange} value={this.state.patientFilterSpeed} />
                        </div>

                        <div className="form-group">
                            <label>Уровень артериального давления пациента (мм рт.ст.)</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <span className="help-block">Систолическое давление</span>
                                    <input className="form-control" type="number" min={60} max={280} required="required" id="patient-pressure-sist" name="patientPressureSist" onChange={this.handleValueChange} value={this.state.patientPressureSist} />
                                </div>
                                <div className="col-md-6">
                                    <span className="help-block">Диастолическое давление</span>
                                    <input className="form-control" type="number" min={20} max={180} required="required" id="patient-pressure-diast" name="patientPressureDiast" onChange={this.handleValueChange} value={this.state.patientPressureDiast} />
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
