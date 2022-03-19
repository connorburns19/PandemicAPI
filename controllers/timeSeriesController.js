const sequelize = require('../sequelize.js').sequelize;
const { DataTypes } = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const Papa = require('papaparse');
const { QueryInterface } = require('sequelize');
const timeSeriesParser = require('../parsers/timeSeriesParser.js')
exports.addSeries = async (req, res) => {
    const name = req.params.timeseries_name
    const datatype = req.params.data_type
    const body = req.body
    console.log(body);
    const tablename = name + datatype




    const timeSeries = sequelize.define('timeSeries', {
        // Model attributes are defined here
        ProvinceState: {
          type: DataTypes.STRING,
        },
        CountryRegion: {
          type: DataTypes.STRING,
          allowNull: false
          // allowNull defaults to true
        },
    
        data: {
          type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
          allowNull: false
        },
      }, { 
        tableName: tablename
      });


    await timeSeries.sync();  

    const rowstoadd = timeSeriesParser.Parse(body);
    console.log(rowstoadd);
    
      
    for(let i = 0; i < rowstoadd.length; i+=1){
      const series = await sequelize.models.timeSeries.create({
        ProvinceState: rowstoadd[i].provincestate,
        CountryRegion: rowstoadd[i].countryregion,
        data: rowstoadd[i].data
    });
    console.log("auto-generated ID:", series.id);

    }


    res.status(200).send("Upload succesful");
    //res.status(400).send("Malformed request");
    //res.status(422).send("Invalid file contents");
    return




}
exports.deleteSeries = async (req, res) => {
    const name = req.params.timeseries_name
    let notfoundcount = 0
    try {await queryInterface.describeTable(name + 'deaths', {});} catch(error){notfoundcount+=1}
    try {await queryInterface.describeTable(name + 'confirmed', {});} catch(error){notfoundcount+=1}
    try {await queryInterface.describeTable(name + 'recovered', {});} catch(error){notfoundcount+=1}
    if (notfoundcount == 3){
        res.status(404).send("Timeseries not found");
        return
    }


    await queryInterface.dropTable('nametype', {});
    await queryInterface.dropTable(name + 'deaths', {});
    await queryInterface.dropTable(name + 'confirmed', {});
    await queryInterface.dropTable(name + 'recovered', {});
    
    res.status(200).send("Sucessfully deleted");
    return

}