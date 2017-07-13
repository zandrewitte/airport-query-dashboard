import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Client from '../api/client';
import Rx from 'rxjs/Rx';
import TableComponent from '../components/table';
import InputBox from '../components/input-box';

const AmCharts = require('@amcharts/amcharts3-react');
const _ = require('lodash');

export default class QueryViewComponent extends Component { 

    constructor() {
        super();

        this.eventSub = new Rx.Subject();

        this.state = {
            searchQuery: '',
            selectedCountry: null,
            countryAirports: []
        }
        /*
        ""
        */
    }

    /*COMPONENT LIFECYCLE FUNCTIONS*/
    componentDidMount() {
        this.eventSub
            .do(searchQuery => this.setState({searchQuery}))
            .subscribe(this.searchCountry.bind(this)); 

    }

    /*COMPONENT RENDER FUNCTION*/
    render() {
        return (
            <div> 
                <div className="header">
                    <h1>Airport Query View</h1>
                    <h6>Please search for a country from the input box to view all airports in that country</h6>
                </div>
                <div className="query-content">
                    <InputBox value={this.state.searchQuery} changeDelay={true}
                        onChange={(value) => this.eventSub.next(value)} placeholder={'Search Country'} />
                      {this.state.selectedCountry !== null ? 
                        <div className="country-container">
                          <h3>Country Information</h3>
                          <span><sup>Country Name</sup>{_.get(this.state, 'selectedCountry.name')}</span>
                          <span><sup>Continent</sup>{_.get(this.state, 'selectedCountry.continent')}</span>
                          <div className="header">
                            <h4>Country Airport Information</h4>
                            <h6>Please click on a airport to view all the runways</h6>
                          </div>
                          <TableComponent label={'Person'}
                                headers={['Airport Identifier', 'Airport Name', 'Airport Municipality', 'Airport Type']}
                                data={this.state.countryAirports.map(v => ({airportIdentifier: v.ident, airportName: v.name, municipality: v.municipality, type: v.type}))}
                                uniqueKey={'airportIdentifier'} onClick={this.getRunwaysForAirport.bind(this)}
                                defaultSortColumn={'airportName'} sortColumnPaths={['airportIdentifier', 'airportName', 'municipality', 'type']}
                            />
                        </div>
                        :
                        null
                      }
                </div>
            </div>
        );
    }

    /*
    COMPONENT FUNCTIONS
     */

    searchCountry() {
        if(_.isEmpty(this.state.searchQuery)){ 
            this.setState({selectedCountry: null, countryAirports: []});
        }else {
            Rx.Observable.fromPromise(Client.country.getCountryByQuery({query: this.state.searchQuery}))
            .map(response => response.data())
            .do(selectedCountry => this.setState({selectedCountry: _.isEmpty(selectedCountry)? null : selectedCountry}))
            .switchMap(country => 
                Rx.Observable.fromPromise(Client.airports.getAirportsByCountry({countryCode: country.code}))
                .map(response => response.data())
                .do(countryAirports => this.setState({countryAirports}))
            )
            .catch(err => this.setState({selectedCountry: null, countryAirports: []}))
            .subscribe();
        }
      
    }

    getRunwaysForAirport(airportIdentification) {
        return Rx.Observable.fromPromise(Client.runways.getRunwaysForAirport({airport: airportIdentification}))
            .map(response => {
                let data = response.data()
                return (
                    <div>
                        <div className="runway-header">
                            <span>Unique Identifier</span>
                            <span>Length</span>
                            <span>Width</span>
                            <span>Surface</span>
                            <span>Latitude</span>
                            <span>Longitude</span>
                        </div>
                        {
                            data.map(runway => 
                                <div className="runway-values">
                                    <span>{runway.id}</span>
                                    <span>{runway.lengthFt}</span>
                                    <span>{runway.widthFt}</span>
                                    <span>{runway.surface}</span>
                                    <span>{runway.leLatitudeDeg}</span>
                                    <span>{runway.leLongitudeDeg}</span>
                                </div>
                            )
                        }
                    </div>
                );
            })
    }
    

}