import { DataTypes } from "sequelize/types";
import { sequelize } from "../sequelize";

const dailyReport = sequelize.define('DailyReport', {
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
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(dailyReport === sequelize.models.dailyReport); // true