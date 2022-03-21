const expect = require('chai').expect;
const { assert } = require('chai');
const timeSeriesParser = require('../parsers/timeSeriesParser.js')
const dailyReportParser = require('../parsers/dailyReportsParser.js')

describe("Parser Tests", function(){
    describe("Time Series Parser Test", function(){
        it('Parses Strings into Time Series', function(){
            const exampleString = ('Province,Country,Lat,Long,1/22/20,1/23/20,1/24/20\nOhio,America,33.0,44.0,3,6,9');
            const rows = timeSeriesParser.Parse(exampleString);
            assert.equal(rows[0].provincestate, 'Ohio')
            assert.equal(rows[0].countryregion, 'America')
            assert.equal(rows[0].data[0][0], '1/22/20')
            assert.equal(rows[0].data[0][1], '3')
        })  
    })
    describe("Daily Report Parser", function(){
        it('Parses String into Daily Reports', function(){
            const exampleString = 'Fips,Admin,Province,Country,LastUpdate,Lat,Long,Deaths,Confirmed,Active,Recovered,CombinedKey\nFips,Admin,Ohio,America,Yesterday,44.0,22.0,1,2,3,4,"Ohio, America"'
            const rows = dailyReportParser.Parse(exampleString)
            assert.equal(rows[0].provincestate, 'Ohio')
            assert.equal(rows[0].countryregion, 'America')
            assert.equal(rows[0].confirmed, '1')
            assert.equal(rows[0].deaths, '2')
            assert.equal(rows[0].recovered, '3')
            assert.equal(rows[0].active, '4')
            assert.equal(rows[0].combinedkey, 'Ohio, America')
        })
    })
})