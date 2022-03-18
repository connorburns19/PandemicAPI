import { DataTypes } from "sequelize/types";
import { sequelize } from "../sequelize";

const timeSeries = sequelize.define('TimeSeries', {
  // Model attributes are defined here
  provinceOrTerritory: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
    // allowNull defaults to true
  },
  lat: {
      tupe: DataTypes.STRING,
      allowNull: false
  },
  long: {
    tupe: DataTypes.STRING,
    allowNull: false
  },
  data: {
    tupe: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
    allowNull: false
  },
}, { 
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(timeSeries === sequelize.models.timeSeries); // true