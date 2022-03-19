const expect = require('chai').expect;
const { assert } = require('chai');
const timeSeriesParser = require('../parsers/timeSeriesParser.js')
// var dailyReportParser = require('../parsers/dailyReportParser.js')

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
    //TODO once dailyReportParser is implemented
    describe("Daily Report Parser", function(){
        it('Parsese String into Daily Reports', function(){
            const exampleString = ''

        })
    })
})