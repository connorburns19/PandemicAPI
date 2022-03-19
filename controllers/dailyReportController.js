const sequelize = require('../sequelize.js').sequelize;
const { DataTypes } = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const dailyReportsParser = require('../parsers/dailyReportsParser.js');
const { QueryInterface } = require('sequelize');
const { rows } = require('pg/lib/defaults');

exports.addReport = async (req, res) => {
    const name = req.params.dailyreport_name
    console.log(req)
    const body = req.body
    
    




    const dailyReport = sequelize.define('dailyReport', {
        // Model attributes are defined here
        
        Province_State: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Country_Region: {
          type: DataTypes.STRING,
          allowNull: false
          // allowNull defaults to true
        },
        
        Confirmed: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Deaths: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        Recovered: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Active: {
          type: DataTypes.STRING,
          allowNull: false
        },
        Combined_Key: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, { 
        tableName: name
      });


    await dailyReport.sync(); 
    const rowstoadd = dailyReportsParser.Parse(body);

    for(let i = 0; i < rowstoadd.length; i+=1){
      const report = await sequelize.models.dailyReport.create({
        Province_State: rowstoadd[i].provincestate,
        Country_Region: rowstoadd[i].countryregion,
        Confirmed: rowstoadd[i].confirmed,
        Deaths: rowstoadd[i].deaths,
        Recovered: rowstoadd[i].recovered,
        Active: rowstoadd[i].active,
        Combined_Key: rowstoadd[i].combinedkey,
    });
    console.log("auto-generated ID:", report.id);
    
      
    };
    res.status(200).send("Upload succesful");
    

    

    
    //res.status(400).send("Malformed request");
    //res.status(422).send("Invalid file contents");
    return




}
exports.deleteReport = async (req, res) => {
    const name = req.params.dailyreport_name
    let notfoundcount = 0
    try {await queryInterface.describeTable(name);} catch(error){notfoundcount+=1}

    if (notfoundcount == 1){
        res.status(404).send("Daily report not found");
        return
    }


    
    
    await queryInterface.dropTable(name, {});
    
    res.status(200).send("Sucessfully deleted");
    return

}