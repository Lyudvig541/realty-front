import React, {Component} from "react";
import default_suggestions from '../../data/suggestions.json';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Redirect } from "react-router-dom";
import {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';

const searchOptions = {
    componentRestrictions: { country: ['am'] },
}

class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggest: false,
            address: '',
            coordinates:'',
            redirect: null
        };
        this.handleSuggest = this.handleSuggest.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.filterCoordinates = this.filterCoordinates.bind(this);
    }

    handleSelectPlace(category){
        if (this.state.address) {
            let addresses = localStorage.addresses && JSON.parse(localStorage.addresses).length > 0 ? JSON.parse(localStorage.addresses) : [];
            let new_address = [];
            let result = [];
            let coords_name = this.filterCoordinates([this.state.coordinates.lng, this.state.coordinates.lat])
            if (addresses.length > 0) {
                addresses.forEach((value, index) => {
                    if (value.coords_name === coords_name) {
                       addresses.splice(index, 1);
                    }
                })
                addresses.push({
                    id: Date.now(),
                    name: this.state.address,
                    center: [this.state.coordinates.lng, this.state.coordinates.lat],
                    coords_name: coords_name
                });
                new_address = addresses;
            } else {
                new_address = [{
                    id: Date.now(),
                    name: this.state.address,
                    center: [this.state.coordinates.lng, this.state.coordinates.lat],
                    coords_name: coords_name
                }];
            }
            if (new_address.length > 4) {
                result = new_address.slice(Math.max(new_address.length - 4, 1))
            } else {
                result = new_address
            }
            localStorage.removeItem("addresses")
            localStorage.setItem("addresses", JSON.stringify(result))
        }
        window.location.href = "/announcements/?cat="+category;
    }

    handleSuggest() {
        if (this.state.address === ''){
            this.setState({suggest: true});
        }
    }

    handleChange = address => {
        this.setState({ address:address , suggest:false});
    };

    filterCoordinates(coordinates){
        let coords =  coordinates.toString();
        return coords.replace(/[|.|,| |]/g, "_");
    }

    async handleSelect(address){
        this.setState({ address:address , suggest:false});
        await geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(results => this.setState({ coordinates:results }))
            .catch(error => console.error('Error', error));
    };

    render() {
        const t_suggestions = default_suggestions[localStorage.i18nextLng ? localStorage.i18nextLng : 'am']
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                searchOptions={searchOptions}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                            })}
                            onFocus={this.handleSuggest}
                            onBlur={() => this.setState({suggest:false})}
                        />
                        {this.state.suggest && <div className="autocomplete-dropdown-container">
                            {t_suggestions.map((suggestion, i) => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                                    : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                return (
                                    <div
                                        onClick={this.handleSelect}
                                        key={i}
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <i className="fa fa-map-marker"></i>
                                        <span> {suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                        }

                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion, i) => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        key={i}
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <i className="fa fa-map-marker"></i>
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}

export default Autocomplete;