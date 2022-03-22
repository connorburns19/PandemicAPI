let chai = require("chai")
let chaiHttp = require("chai-http");
let server = require('../server.js')

chai.should();

chai.use(chaiHttp)

describe("Time Series HTML Requests", function(){
    //test the POST route
    describe("Testing whether correctly formatted data is added and retrievable", function(){
        const reqBody = 
        `Province/State,Country/Region,Lat,Long,1/22/20,1/23/20,1/24/20,1/25/20\n`+
        `,America,33.0,44.0,0,1,2,3\n` +
        `Chelsea,England,45.0,99.0,21,22,23,24\n` + 
        `Louisiana,America,44.0,66.0,30,31,32,33`; 
        
        const correctString = 'Province/State,Country/Region,1/22/20,1/23/20,1/24/20,1/25/20\n' +
            ',America,0,1,2,3\n' +
            'Chelsea,England,21,22,23,24\n' +
            'Louisiana,America,30,31,32,33\n';

        it("It should create a new table and add the data to the database", (done) =>{
            chai.request(server).post('/api/time_series/TESTSERIES/deaths').type('text').send(reqBody).end((err, response) =>{
                response.should.have.status(200);     
                done()       
            })     
        })
        
        it("The new table should be retrievable", (done) =>{
            chai.request(server).get('/api/time_series/TESTSERIES/deaths?format=json').end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object'); 
                response.body['Time Series'][0].provincestate.should.be.eq(""); 
                response.body['Time Series'][0].countryregion.should.be.eq("America");  
                response.body['Time Series'][0].data['1/22/20'].should.be.eq(0) 
                done();
            })
            
        })

        it("And it should be retrievable in CSV form", (done) =>{
            chai.request(server).get('/api/time_series/TESTSERIES/deaths?format=csv').end((err, response)=>{
                response.should.have.status(200);
                response.text.should.be.eq(correctString)   
                done();
            })   
        })

        it("We should also be able to query by other params:", (done) =>{
            chai.request(server).get('/api/time_series/TESTSERIES/deaths?format=csv&countries=[America]').end((err, response)=>{
                response.should.have.status(200);
                response.text.should.be.eq('Province/State,Country/Region,1/22/20,1/23/20,1/24/20,1/25/20\n' + 
                                           ',America,0,1,2,3\n' + 
                                           'Louisiana,America,30,31,32,33\n')   
                done();
            }) 
        })
    })
    describe("Testing whether post updates existing rows instead of creating new ones", function(){
        const reqBody = `Province/State,Country/Region,Lat,Long,1/22/20,1/23/20,1/24/20,1/25/20\n,America,33.0,44.0,419,1,2,3`
        it("It should post succesfully", (done)=>{
            chai.request(server).post('/api/time_series/TESTSERIES/deaths').type('text').send(reqBody).end((err, response)=>{
                response.should.have.status(200);
                done()
            })
        })
        it("When retrieved we should only see omly one row, and it should correspond to the new data", (done) => {
            const correctString = 'Province/State,Country/Region,1/22/20,1/23/20,1/24/20,1/25/20\n' +
            'Chelsea,England,21,22,23,24\n' +
            'Louisiana,America,30,31,32,33\n' +
            ',America,419,1,2,3\n';
            chai.request(server).get('/api/time_series/TESTSERIES/deaths?format=csv').end((err, response) =>{
                response.should.have.status(200)
                response.text.should.be.eq(correctString)
                done()
            })
            }
        )
    })
    describe("Testing whether delete clears the whole table", function(){
        it("Delete of the above table should be succesful", (done) => {
            chai.request(server).delete('/api/time_series/TESTSERIES').end((err, response) => {
                response.should.have.status(200)
                done()
            })
        })
        it("We should not be able to return the table we just deleted", (done) => {
            chai.request(server).get('/api/time_series/TESTSERIES/deaths?format=json').end((err, response) => {
                response.should.have.status(404)
                done()
            })
        })
    })

})
server.close()