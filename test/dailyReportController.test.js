let chai = require("chai")
let chaiHttp = require("chai-http");
let server = require('../server.js')

chai.should();

chai.use(chaiHttp)

describe("Daily Report HTML Requests", function(){
    //test the POST route
    describe("Testing whether correctly formatted data is added and retrievable", function(){
        const reqBody = `FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio\n12332,Admin,Ohio,America,Yesterday,44.0,22.0,1,2,3,4,"Ohio, America",1.0,2.0`
        it("It should create a new table and add the data to the database", (done) =>{
            chai.request(server).post('/api/daily_reports/TESTDAILY').type('text').send(reqBody).end((err, response) =>{
                response.should.have.status(200);     
                done()       
            })     
        })
        it("The new table should be retrievable", (done1) =>{
            chai.request(server).get('/api/daily_reports/TESTDAILY?format=json').end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object'); 
                response.body['Daily Report'][0].country_region.should.be.eq("America");  
                response.body['Daily Report'][0].deaths.should.be.eq(2) 
                done1();
            })
            
        })

        it("And it should be retrievable in CSV form", (done2) =>{
            chai.request(server).get('/api/daily_reports/TESTDAILY?format=csv').end((err, response)=>{
                response.should.have.status(200);
                response.text.should.be.eq('Province/State,Country/Region,Confirmed,Deaths,Recovered,Active,Combined_Key\nOhio,America,1,2,3,4,"Ohio, America"\n')   
                done2();
            })   
        }

    )})
    describe("Testing whether post updates existing rows instead of creating new ones", function(){
        const reqBody = `FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio\n12332,Admin,Ohio,America,Yesterday,44.0,22.0,11,12,13,14,"Ohio, America",1.0,2.0`
        it("It should post succesfully", (done)=>{
            chai.request(server).post('/api/daily_reports/TESTDAILY').type('text').send(reqBody).end((err, response)=>{
                response.should.have.status(200);
                done()
            })
        })
        it("When retrieved we should only see omly one row, and it should correspond to the new data", (done) => {
            chai.request(server).get('/api/daily_reports/TESTDAILY?format=csv').end((err, response) =>{
                response.should.have.status(200)
                response.text.should.be.eq('Province/State,Country/Region,Confirmed,Deaths,Recovered,Active,Combined_Key\nOhio,America,11,12,13,14,"Ohio, America"\n')
                done()
            })
            }
        )
    })
    describe("Testing whether delete clears the whole table", function(){
        it("Delete of the above table should be succesful", (done) => {
            chai.request(server).delete('/api/daily_reports/TESTDAILY').end((err, response) => {
                response.should.have.status(200)
                done()
            })
        })
        it("We should not be able to return the table we just deleted", (done) => {
            chai.request(server).get('/api/daily_reports/TESTDAILY?format=json').end((err, response) => {
                response.should.have.status(404)
                done()
            })
        })
    })

})
server.close()