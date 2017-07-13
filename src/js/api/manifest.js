
var Manifest = {
    host: 'http://localhost:8090/airport-api/v1/',
    resources: {

        airports:{
            getAirportsByCountry: {
                method: 'GET',
                path: '/{countryCode}/airports'
            },
            getAirportReportsByCountries: {
                method: 'GET',
                path: '/airports/reports/byCountries'
            }
        },
        country:{
            getCountryByQuery: {
                method: 'GET',
                path: '/country?query={query}'
            }
        },
        runways: {
            getSurfaceRunwaysByCountries: {
                method: 'GET',
                path: '/runways/reports/surfaceByCountries'
            },
            getRunwayIdentifications: {
                method: 'GET',
                path: '/runways/reports/runwayIdentifications'
            },
            getRunwaysForAirport: {
                method: 'GET',
                path: '/{airport}/runways'
            }
        }
    }
};

export default Manifest;
