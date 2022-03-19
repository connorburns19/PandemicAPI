const sequelize = require('../sequelize.js').sequelize;
const { DataTypes } = require('sequelize');
const queryInterface = sequelize.getQueryInterface();

const { QueryInterface } = require('sequelize');

exports.addReport = async (req, res) => {
    const name = req.params.dailyreport_name
    console.log(req)
    const body = req.body
    
    




    const dailyReport = sequelize.define('dailyReport', {
        // Model attributes are defined here
        fips: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
      
        provinceOrTerritory: {
          type: DataTypes.STRING,
          allowNull: false
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false
          // allowNull defaults to true
        },
        lastUpdate: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lat: {
          type: DataTypes.STRING,
          allowNull: false
        },
        long: {
          type: DataTypes.STRING,
          allowNull: false
        },
        confirmed: {
          type: DataTypes.STRING,
          allowNull: false
        },
        deaths: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        recovered: {
          type: DataTypes.STRING,
          allowNull: false
        },
        active: {
          type: DataTypes.STRING,
          allowNull: false
        },
        combinedKey: {
          type: DataTypes.STRING,
          allowNull: false
        },
        incidenceRate: {
          type: DataTypes.STRING,
          allowNull: false
        },
        caseFatalityRatio: {
          type: DataTypes.STRING,
          allowNull: false
        },
      }, { 
        tableName: name
      });


    await dailyReport.sync();  

    const report = await sequelize.models.dailyReport.create({
        fips: 'sus',
        provinceOrTerritory: 'sus',
        country: 'sus',
        lastUpdate: 'sus',
        lat: 'sus',
        long: 'sus',
        confirmed: 'sus',
        deaths: 'sus',
        recovered: 'sus',
        active: 'sus',
        combinedKey: 'sus',
        incidenceRate:'sus',
        caseFatalityRatio: 'sus'
    });
    console.log("auto-generated ID:", report.id);
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