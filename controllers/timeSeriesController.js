const sequelize = require('../sequelize.js').sequelize;
const { DataTypes, Op} = require('sequelize');
const queryInterface = sequelize.getQueryInterface();
const Papa = require('papaparse');
const { QueryInterface } = require('sequelize');
const timeSeriesParser = require('../parsers/timeSeriesParser.js')
exports.addSeries = async (req, res) => {
    const name = req.params.timeseries_name
    const datatype = req.params.data_type
    const body = req.body
    
    const tablename = name + datatype


  try{
    const timeSeries = sequelize.define('timeSeries', {
      // Model attributes are defined here
      provincestate: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      countryregion: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
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
    
    if(rowstoadd == "INVALID"){
      res.status(422).send("Invalid file format")
      return
    }
    
    
      
    for(let i = 0; i < rowstoadd.length; i+=1){
      const series = await sequelize.models.timeSeries.upsert({
        provincestate: rowstoadd[i].provincestate,
        countryregion: rowstoadd[i].countryregion,
        data: rowstoadd[i].data
    });
    console.log("auto-generated ID:", series.id);

    }
    
    res.status(200).send("Upload succesful");
  } catch(error) {
    res.status(400).send("Malformed Request")
    return
  }

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

exports.getSeries = async (req, res) => {
  const name = req.params.timeseries_name;
  const data_type = req.params.data_type;
  const tablename = name + data_type;
  let notfoundcount = 0
  try {await queryInterface.describeTable(tablename, {});} catch(error){notfoundcount+=1}
  
  if (notfoundcount == 1){
      res.status(400).send("Malformed Request");
      return
  }
  let countries = req.query.countries;
  if(countries != undefined){
    countries = countries.slice(1, countries.length - 1);
    countries = countries.split(',');
    for(let i =0; i < countries.length; i+=1){
      countries[i] = countries[i].trim();
    }

  }
  if (countries == undefined){
    countries = 'all'
  }
  let regions = req.query.regions;
  if(regions != undefined){
    regions = regions.slice(1, regions.length - 1);
    regions = regions.split(',');
    for(let i =0; i < regions.length; i+=1){
      regions[i] = regions[i].trim();
    }

  }
  if (regions == undefined){
    regions = 'all'
  }
  let format = req.query.format;
  if(format == undefined){
    format = 'csv'
  }
  let startdate = req.query.start_date;
  let enddate = req.query.end_date;
  if (startdate == undefined){
    startdate= 'none'

  }
  if (enddate == undefined){
    enddate = 'none';
  }


  const timeSeries = sequelize.define('timeSeries', {
    // Model attributes are defined here
    provincestate: {
      type: DataTypes.STRING,
    },
    countryregion: {
      type: DataTypes.STRING,
      allowNull: false
      // allowNull defaults to true
    },
  
    data: {
      type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING, DataTypes.INTEGER)),
      allowNull: false
    },
  }, { 
    tableName: tablename
  });

    //Try dynamically creating the where object
    let where = {}
    if(countries != 'all'){
      where.countryregion = {[Op.or]: countries}
    }
    if (regions != 'all'){
      where.provincestate = {[Op.or]: regions}
    }
    
   
      if(format == 'json'){
        timeSeries.findAll({
          attributes: ['provincestate', 'countryregion', 'data'], 
          where: where
        }).then((results) => {
        
          let returnjson = {}
          let newreturn = []
          for(let i =0; i< results.length; i+=1){
            const row = results[i]
            const olddata = row.data
            let newdata = {};
            let start = 0;
            let end = olddata.length - 1
            if(startdate!= undefined){
              for(let i =0; i <olddata.length; i+=1){
                if(olddata[i][0] == startdate){
                  start = i
                }
              }
            }
            if(enddate!= undefined){
              for(let i =0; i <olddata.length; i+=1){
                if(olddata[i][0] == enddate){
                  end = i
                }
              }
            }
            for(let j = start; j < end + 1; j+=1){
              newdata[olddata[j][0]] = parseInt(olddata[j][1]);
            }
            row.data = newdata
            newreturn.push(row)
          
          
          
          
          };
          returnjson['queryrows'] = newreturn;
          res.status(200).send(returnjson);
          console.log('Succesful Operation')
      });
      }
      else if (format == 'csv'){
        let topdone = 0;
        timeSeries.findAll({
          attributes: ['provincestate', 'countryregion', 'data'], 
          where: where
        }).then((results) => {
        
          let returnstr = 'Province/State,Country/Region,'
          let newreturn = []
          for(let i =0; i< results.length; i+=1){
            const row = results[i]
            const olddata = row.data
            let newdata = {};
            let start = 0;
            let end = olddata.length - 1
            if(startdate!= undefined){
              for(let i =0; i <olddata.length; i+=1){
                if(olddata[i][0] == startdate){
                  start = i
                }
              }
            }
            if(enddate!= undefined){
              for(let i =0; i <olddata.length; i+=1){
                if(olddata[i][0] == enddate){
                  end = i
                }
              }
            }
            if (topdone == 0){
              for(let j = start; j < end + 1; j+=1){
                if(j != end){
                  returnstr += olddata[j][0] + ','
  
                }
                else{returnstr += olddata[j][0] + '\n'}
                 
              }
              topdone = 1;

            }
            
            returnstr += row.provincestate +',' + row.countryregion + ','
            for(let j = start; j < end + 1; j+=1){
              if(j != end){
                returnstr += olddata[j][1] + ','
                

              }
              else{returnstr += olddata[j][1] + '\n'}
              
            }
            
          
          
          
          
          };
          
          res.status(200).send(returnstr);
          console.log('Succesful Operation')
      });

      }
      else{
        res.status(400).send("Malformed Request");
      }

    }





    
    
  




