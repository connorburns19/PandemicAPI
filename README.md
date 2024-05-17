# Overview
This repository is a public clone of an assignment that I completed in 2022 along side GitHub user prb27. This is a simple REST API for adding and fetching pandemic data from a PostgreSQL database, which was hosted on heroku at the time. We were given a specification/example for the format for the data, but everything else we had to build from scratch. This proect is no longer hosted, but feel free to read through the rest of his readme, and take a look at the code to see the code we devloped for this project. We received 100 percent on this assignment, so everything worked as requested.

# Pair Programming 
During the majority of this assignment, we were working together in the same room. We were both sitting next to each other, so we could always glance over and see what the other person was working on when we were doing our own thing, but it also made pair programming much easier. We also had a large monitor that one of us used, which made the pair programming process much more enjoyable to partake in. We didn’t pair program every feature, but our process went something like this:

We would both be working on different features or files, which would be unrelated/unconnected to some extent. Most of the pair programming occurred when one person ran into an issue that they couldn't fix in under 10 minutes.

For example, when writing the controller methods, which actually hold the get post and delete methods for each of the types of data, we pair programmed most of the methods. The get method was the most complex, so almost all of that was pair programmed in its entirety. When we ran into problems, the driver would explain what they were trying to accomplish at a high level, and then show the navigator the section of code that they suspect might be the issue, or ask the navigator if the code they have written made sense. Of course, the driver would step through their code so that the navigator would be on the same page as them. The navigator would then discuss their thoughts on the problem, as well as searching the documentation for the ORM library which we used, and/or general JavaScript documentation depending on the problem at hand. This process essentially formed a pair debugging process, which turned out to be very successful.

We decided to essentially just pair program the entire assignment in this fashion. When designing and implementing tests, the driver would actually program the tests, while the navigator would think of tests that would be relevant and helpful to test that the API functions properly. We followed this approach for both unit tests, as well as integration tests.

# Program Design
We structured our API code to follow the Model View Controller design pattern. In our program, the server.js file and the routes folder is the view, while the controller files encapsulate both the model and controller aspects of the pattern. Following this pattern ensured that our code was highly cohesive and loosely coupled. To further support low coupling, we also separated files by the data type associated with the API calls. For example, we had a DailyReports controller file and a TimeSeries controller file, which were separate from each other and did not rely on each other in any way. We chose to use Express router in order to keep our code organized and in order to follow the MVC pattern easier. We chose to fix every table for time series to have the same amount of attributes; we did not store each date as a column and rather had a data attribute that stores date and value pairs. This has some drawbacks, however for the purpose of this API it works fine and it was the better route to take since dynamically allocating a different number of attributes per table using our ORM would have been tedious.

# Functionality Documentation
## Daily Reports

The url:
https://coviddata-301.herokuapp.com/api/daily_reports/:tablename
### POST
When adding a new daily report, the format of the request must be sent as text, and must follow the exact format given in the spec i.e 

FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio\n <br/>
45001,Abbeville,South Carolina,US,2020-06-06 02:33:00,34.22333378,-82.46170658,47,0,0,47,"Abbeville, South Carolina, US",191.625555510254,0.0\n  <br/>
22001,Acadia,Louisiana,US,2020-06-06 02:33:00,30.2950649,-92.41419698,467,26,0,441,"Acadia, Louisiana, US",752.6795068095737,5.56745182012848  <br/>

You must have a newline between each row. If the first row is not equal to 

‘FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key,Incidence_Rate,Case-Fatality_Ratio\n’


The response will signify that this is an invalid format. Similarly, if any of attributes confirmed, deaths, recovered, active are either not a number, or less than 0, this is a malformed request. Having an uneven number of values in each row will also result in an invalid format.

Posting a tablename that does not exist will create that table with all the subsequent rows following the first row and store it in the Postgres database. If the table name exists, any rows that are not currently in the table will be appended, and rows that do exist will be updated. For example, the key in the database is the combination of Country_Region and Provinc_State. So if ‘’ + ‘Canada” exists (Country Canada with no specified province), posting new data that has a row with the same key will overwrite the old data as expected.

### GET
When doing a get request, you use the same url as posting, where you get the information from the tablename. An example of formatting the queries is as such (this query will not actually work with our data, but this is just to demonstrate the format of queries)

https://coviddata-301.herokuapp.com/api/daily_reports/DailyReportJune21?format=json&countries=[Canada,USA]&regions=[Ontario,Ohio]&combined_key=[“something”]&data_type=[active]

This would return a JSON object with an attribute called "Daily Report", that holds a list of JSON objects, each of which is a row in the resulting query. Specifying no format or format=csv will return the result as csv text. <br/>
![alt text](https://i.ibb.co/s5Z3dRD/jsondailyreport.png)
### DELETE

Deleting is straightforward; send a Delete request to the specified table name and if it exists, it will be dropped in the database, and otherwise the response will indicate that the table was not found.
Time Series
## Time Series
### POST 
https://coviddata-301.herokuapp.com/api/daily_reports/:tablename/deaths <br/>
https://coviddata-301.herokuapp.com/api/daily_reports/:tablename/confirmed <br/>
https://coviddata-301.herokuapp.com/api/daily_reports/:tablename/active <br/> 

When adding a new time series , the format of the request must be sent as text, and must follow the exact format given in the spec.

If the first row of the request does not begin with Province/State,Country/Region,Lat,Long this is an invalid format. Similarly, if any of the values are not a number, or less than 0, this is a malformed request. Having an uneven number of values in each row will also result in an invalid format.

Posting a table name that does not exist will create that table with all the subsequent rows following the first row and store it in the Postgres database. If the table name exists, any rows that are not currently in the table will be appended, and rows that do exist will be updated. For example, the key in the database is the combination of Country_Region and Provinc_State. So if ‘’ + ‘Canada” exists (Country Canada with no specified province), posting new data that has a row with the same key will overwrite the old data as expected.

### GET
When doing a GET request, you use the same url as posting, where you get the information from the tablename. An example of formatting the queries is as such (this query will not actually work with our data, but this is just to demonstrate the format of queries)

https://coviddata-301.herokuapp.com/api/time_series/Global/deaths?format=json&countries=[Canada,USA]&regions=[Ontario,Ohio]]&data_type=[active]

This would return a JSON object with an attribute called "Time Series", that holds a list of JSON objects, each of which is a row in the resulting query. Each row will have an attribute called data, which is an object with string dates as the key and the value associated with that date. Specifying no format or format=csv will return the result as csv text. <br/>

![alt text](https://i.ibb.co/vcwpMBP/jsontimeseries.png)

### DELETE
https://coviddata-301.herokuapp.com/api/daily_reports/:tablename

When sending a DELETE request, if the tablename has any tables in the database, all of them will be dropped (deaths, confirmed and active). If it does not exist the response will tell you this.

# CI and CD Proof
For proof of automation for testing, please look at .github/workflows/node.js.yml, and you will see that NPM test is part of the required tasks
![alt text](https://i.ibb.co/N3kqxPz/CD-proof.png)
![alt text](https://i.ibb.co/cQfjXbt/Screen-Shot-2022-03-21-at-22-28-50.png)
![alt text](https://i.ibb.co/61BDpzh/image.png)

# Database
The two examples given on the swagger hub, are currently in the database at url https://coviddata-301.herokuapp.com/api/daily_reports/swagexample and <br/> https://coviddata-301.herokuapp.com/api/time_series/swagexample/deaths
