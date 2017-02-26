import React, {Component} from 'react';
import countriesList from './countriesData.js'

class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientCountry: 'RU',
            patientCountryType: 1
        };
    }

    handleCountryChange(e) {
        var value = e.target.value;
        var rec = countriesList.find((country) => {
            return country.countryCode === value;
        });
        this.setState({
            patientCountry: value,
            patientCountryType: rec.countryType
        });
    }

    render() {
        var options = countriesList.map(function(item, index) {
            return (
                <option key={item.countryCode} data-region={item.countryType} value={item.countryCode}>{item.countryName}</option>
            )
        });

        return (
            <select className="form-control" id="patient-country" name="patientCountry" onChange={this.handleCountryChange.bind(this)} value={this.state.patientCountry}>
                {options}
            </select>
        );
    }
}

export default Countries;