let chai = require("chai")
let chaiHttp = require("chai-http");
const res = require("express/lib/response");
let server = require('../server.js')

chai.should();

chai.use(chaiHttp)

describe("Daily Report HTML Requests", function(){
    //test the POST route
    describe("Testing whether correctly formatted data is added and retrievable", function(){
        const reqBody = `Fips,Admin,Province,Country,LastUpdate,Lat,Long,Deaths,Confirmed,Active,Recovered,CombinedKey\n12332,Admin,Ohio,America,Yesterday,44.0,22.0,1,2,3,4,"Ohio, America"`
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
        it("The new table should be retrievable", function(done){
            chai.request(server).get('/api/daily_reports/TESTDAILY2?format=json').end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object'); 
                response.body['Daily Report'][0].country_region.should.be.eq("America");   
                done();
            })
        })
        it("And it should be retrievable in CSV form", function(done){
            chai.request(server).get('/api/daily_reports/TESTDAILY2?format=csv').end((err, response)=>{
                response.should.have.status(200);
                response.text.should.be.eq('Province/State,Country/Region,Active,Confirmed,Deaths,Recovered,Combined_Key\nOhio,America,4,1,2,3,"Ohio, America"\n')   
                
            })
            done();
        }

    )})
    // describe("Testing whether post updates existing rows instead of creating new ones", function(){

    // })

})
server.close()