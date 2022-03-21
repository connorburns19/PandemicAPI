let chai = require("chai")
let chaiHttp = require("chai-http");
const res = require("express/lib/response");
let server = require('../server.js')

chai.should();

chai.use(chaiHttp)

describe("Daily Report HTML Requests", function(){
    //test the POST route
    describe("Testing whether correctly formatted data is added and retrievable", function(){
        const reqBody = `FIPS,Admin2,Province_State,Country_Region,LastUpdate,Lat,Long,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio\n12332,Admin,Ohio,America,Yesterday,44.0,22.0,1,2,3,4,"Ohio, America",1.0,2.0`
        it("It should create a new table and add the data to the database", function(done){
            chai.request(server)
                .post('/api/daily_reports/TESTDAILY2')
                .type('text')
                .send(reqBody)
                .end((err, response) =>{
                    response.should.have.status(200);             
                })
                done()
        })
        it("The new table should be retrievable", function(done1){
            chai.request(server).get('/api/daily_reports/TESTDAILY2?format=json').end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object'); 
                response.body['Daily Report'][0].country_region.should.be.eq("America");   
                done1();
            })
            
        })

        it("And it should be retrievable in CSV form", function(done2){
            chai.request(server).get('/api/daily_reports/TESTDAILY2?format=csv').end((err, response)=>{
                response.should.have.status(200);
                response.text.should.be.eq('Province/State,Country/Region,Active,Confirmed,Deaths,Recovered,Combined_Key\nOhio,America,4,1,2,3,"Ohio, America"\n')   
                done2();
            })   
        }

    )})
    // describe("Testing whether post updates existing rows instead of creating new ones", function(){

    // })

})
server.close()