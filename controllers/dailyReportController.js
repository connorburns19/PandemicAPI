const sequelize = require('../sequelize.js').sequelize;
const { rows } = require('pg/lib/defaults');
const { DataTypes, Op } = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const dailyReportsParser = require('../parsers/dailyReportsParser.js');

//POST QUERY
exports.addReport = async (req, res) => {
    const name = req.params.dailyreport_name
    const body = req.body
    
    try {
      const dailyReport = sequelize.define('dailyReport', {
        // Model attributes are defined here, this is basically the schema
        province_state: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
        },
        country_region: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
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
        combined_key: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, { 
        tableName: name
      });


      await dailyReport.sync();

      const rowstoadd = dailyReportsParser.Parse(body);
      
      if(rowstoadd == "INVALID"){
        //this check happens in parser
        res.status(422).send("Invalid format");
        return
      }
      if(rowstoadd == "MALFORMED"){
        //this check happens in parser
        res.status(400).send("Malformed Request");
        return
      }

      for(let i = 0; i < rowstoadd.length; i+=1){
        const report = await sequelize.models.dailyReport.upsert({
          province_state: rowstoadd[i].provincestate,
          country_region: rowstoadd[i].countryregion,
          confirmed: rowstoadd[i].confirmed,
          deaths: rowstoadd[i].deaths,
          recovered: rowstoadd[i].recovered,
          active: rowstoadd[i].active,
          combined_key: rowstoadd[i].combinedkey,
      });
      console.log("auto-generated ID:", report.id);
      
        
      };
      res.status(200).send("Upload succesful");
      return
    } catch(error) {
      res.status(400).send("Malformed request");
      return
    }





}
//DELETE QUERY
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
//GET QUERY
exports.getReport  = async (req, res) => {
  const name = req.params.dailyreport_name;
  let notfoundcount = 0;
  try {await queryInterface.describeTable(name);} catch(error){notfoundcount+=1}

  if (notfoundcount == 1){
      res.status(404).send("Table not found");
      return
  }
  
  let countries = req.query.countries;
  if(countries != undefined){
    countries = countries.slice(1, countries.length - 1);
    countries = countries.split(',');
    for(let i = 0; i < countries.length; i+=1){
      countries[i] = countries[i].trim()
    }
  }
  if(countries == undefined){
    countries = 'all'
  }
  
  
  let regions = req.query.regions;
  if(regions != undefined){
    regions = regions.slice(1, regions.length - 1);
    regions = regions.split(',');
    for(let i = 0; i < regions.length; i+=1){
      regions[i] = regions[i].trim()
    }
  }
  if(regions == undefined){
    regions = 'all'
  }
  
  
  let combinedkey = req.query.combinedkey;
  if(combinedkey != undefined){
    combinedkey = combinedkey.slice(1, combinedkey.length - 1);
    combinedkey = combinedkey.split('",');
    for(let i = 0; i < combinedkey.length; i+=1){
      combinedkey[i] = combinedkey[i].replaceAll(/"/g, '')
      combinedkey[i] = combinedkey[i].trim()
    }
  }
  if(combinedkey == undefined){
    combinedkey = 'all'
  }
  

  let data_type = req.query.data_type;
  if(data_type != undefined){
    data_type = data_type.slice(1, data_type.length - 1);
    data_type = data_type.split(',');
    for(let i = 0; i < data_type.length; i+=1){
      data_type[i] = data_type[i].trim()
    }
  }
  if(data_type == undefined){
    data_type = ['confirmed', 'deaths', 'recovered', 'active']
  }
  
  
  let format = req.query.format
  console.log(typeof(format));
  if(format == undefined){
    format = 'csv'
  }


  const dailyReport = sequelize.define('dailyReport', {
    // Model attributes are defined here
    
    province_state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country_region: {
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
    combined_key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, { 
    tableName: name
  });

  let where = {}
  if(countries != 'all'){
    where.country_region = {[Op.or]: countries}
  }
  if(regions != 'all'){
    where.province_state = {[Op.or]: regions}
  }
  if(combinedkey != 'all'){
    where.combined_key = {[Op.or]: combinedkey}
  }

  if(format == 'json'){
    dailyReport.findAll({
      attributes: ['country_region', 'province_state'].concat(data_type, ['combined_key']), 
      where: where
    
    }).then((results) => {
    
      let returnjson = {}

      for(let i = 0; i < results.length; i+=1){
        const olddata = results[i]
        for(let j = 0; j < data_type.length; j+=1){
          olddata[data_type[j]] = parseInt(olddata[data_type[j]])
        }
      }
      returnjson['Daily Report'] = results;
      res.status(200).send(returnjson);
      console.log('Succesful Operation')
      
      
      });
      return
  } else if (format == 'csv'){
    dailyReport.findAll({
      attributes: ['country_region', 'province_state'].concat(data_type, ['combined_key']), 
      where: where
    
    }).then((results) => {
    
      let returnstring = 'Province/State,Country/Region'
      
      for(let i = 0; i < data_type.length; i++){
        returnstring = returnstring + "," + data_type[i][0].toUpperCase() + data_type[i].substr(1);
      }
      
      returnstring = returnstring + "," + "Combined_Key\n"
      
      for(let i = 0; i < results.length; i+=1){
        returnstring = returnstring + results[i].province_state + "," + results[i].country_region + ",";
        for(let j = 1; j < data_type.length + 1; j++){
          returnstring = returnstring + results[i][data_type[j - 1]] + ","
        }
        returnstring = returnstring + '"' + results[i].combined_key + '"\n'
      }
      console.log(returnstring)
      res.status(200).send(returnstring);
      console.log('Succesful Operation')
      return
      });
      
  } else {
    res.status(400).send("Malformed Request")
    return
  }
  
}









