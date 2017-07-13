import React, { Component } from 'react';
import Client from '../api/client';
import InputBox from '../components/input-box';
import Rx from 'rxjs/Rx';

const AmCharts = require('@amcharts/amcharts3-react');
const _ = require('lodash');

export default class ReportViewComponent extends Component { 
    
    constructor() {
        super();

        this.state = {
            countryFilter: '',
            runwayFilter: ''
        }

        Rx.Observable.zip(
            Rx.Observable.fromPromise(Client.airports.getAirportReportsByCountries()),
            Rx.Observable.fromPromise(Client.runways.getSurfaceRunwaysByCountries()),
            Rx.Observable.fromPromise(Client.runways.getRunwayIdentifications())
        ).map(response => response.map(res => res.data()))
        .subscribe(v => this.setState({...v[0], countryAirportSurfaces: v[1], runwayIdentifications: v[2]}));

    }

    /*COMPONENT RENDER FUNCTION*/
    render() {
        return (
            <div> 
                <div className="header">
                    <h1>Airport Report View</h1>
                    <h6>A summary of all the aiport / runway information</h6>
                </div>
                <div className="report-content">
                    <div className="top-10-countries block block-50">
                        <div className="header">Top 10 Countries with the most Airports</div>
                        <div className="chart-container"> 
                            <AmCharts.React 
                                type="pie"
                                theme="light"
                                dataProvider={this.state.topAirportCountries}
                                titleField="countryCode"
                                valueField="airportCount"
                                labelRadius={5}
                                outlineColor='transparent'
                                color="#f2be35"
                                labelTickColor="#FFF"
                                radius={'42%'}
                                innerRadius={'60%'}
                                labelText={'[[title]]'}
                                handDrawn={'true'}
                            />
                        </div>
                    </div>
                    <div className="bottom-10-countries block block-50">
                        <div className="header">Top 10 Countries with the least Airports</div>
                        <div className="chart-container"> 
                            <AmCharts.React 
                                type="pie"
                                theme="light"
                                dataProvider={this.state.bottomAirportCountries}
                                titleField="countryCode"
                                valueField="airportCount"
                                labelRadius={5}
                                outlineColor='transparent'
                                color="#f2be35"
                                labelTickColor="#FFF"
                                radius={'42%'}
                                innerRadius={'60%'}
                                labelText={'[[title]]'}
                                handDrawn={'true'}
                            />
                        </div>
                    </div>
                    <div className="runway-identifications block block-100">
                        <div className="header">Runway Identifications</div>
                        <InputBox value={this.state.runwayFilter} changeDelay={true}
                            onChange={(runwayFilter) => this.setState({runwayFilter})} placeholder={'Filter Runways'} />
                        {(this.state.runwayIdentifications || []).filter(runwayIdent => runwayIdent.runwayIdentification.toUpperCase().includes(this.state.runwayFilter.toUpperCase()))
                            .map(runwayIdent => 
                                <div className="country-container"> 
                                    <div className="country-header">
                                        <div>Ident: {runwayIdent.runwayIdentification}</div>
                                        <div>Count: {runwayIdent.count}</div>
                                    </div>
                                </div>
                            )}
                    </div>
                    <div className="country-airport-surfaces block block-100">
                        <div className="header">Runway surfaces by Countries</div>
                        <InputBox value={this.state.countryFilter} changeDelay={true}
                            onChange={(countryFilter) => this.setState({countryFilter})} placeholder={'Filter Countries'} />
                        {(this.state.countryAirportSurfaces || []).filter(countryAirports => countryAirports.countryName.toUpperCase().includes(this.state.countryFilter.toUpperCase()))
                            .map(countryAirports => 
                                <div className="country-container"> 
                                    <div className="country-name">{countryAirports.countryName}</div>  
                                    <div className="country-header">
                                        <div>{`Runway Type`}</div>
                                        <div>{`Count`}</div>
                                    </div>
                                    {countryAirports.runwayTypes.map(runwayType =>
                                        <div className="runway-type-container">
                                            <div className="runway-type">{runwayType.runwayType}</div>
                                            <div className="runway-type-count">{runwayType.count}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    }

    /*
    COMPONENT FUNCTIONS
     */

}