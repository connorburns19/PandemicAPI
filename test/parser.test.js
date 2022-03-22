const expect = require('chai').expect;
const { assert } = require('chai');
const timeSeriesParser = require('../parsers/timeSeriesParser.js')
const dailyReportParser = require('../parsers/dailyReportsParser.js')

describe("Parser Tests", function(){
    describe("Time Series Parser Test", function(){
        it('Parses Strings into Time Series', function(){
            const exampleString = 'Province/State,Country/Region,Lat,Long,1/22/20\n,America,33.0,44.0,0'
            const rows = timeSeriesParser.Parse(exampleString);
            assert.equal(rows[0].provincestate, '')
            assert.equal(rows[0].countryregion, 'America')
            assert.equal(rows[0].data[0][0], '1/22/20')
            assert.equal(rows[0].data[0][1], '0')
        })  
    })
    describe("Daily Report Parser", function(){
        it('Parses String into Daily Reports', function(){
            const exampleString = 'FIPS,Admin2,Province_State,Country_Region,LastUpdate,Lat,Long,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio\n45001,Abbeville,South Carolina,US,2020-06-06 02:33:00,34.22333378,-82.46170658,47,0,0,47,"Abbeville, South Carolina, US",191.625555510254,0.0'
            const rows = dailyReportParser.Parse(exampleString)
            assert.equal(rows[0].provincestate, 'South Carolina')
            assert.equal(rows[0].countryregion, 'US')
            assert.equal(rows[0].confirmed, '47')
            assert.equal(rows[0].deaths, '0')
            assert.equal(rows[0].recovered, '0')
            assert.equal(rows[0].active, '47')
            assert.equal(rows[0].combinedkey, 'Abbeville, South Carolina, US')
        })
    })
})