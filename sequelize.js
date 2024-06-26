const Sequelize = require('sequelize');

const DB_URL = 'postgres://fbpfodhmrvsvvr:0c0e145a05a6aa8f1f9df369fa71ca79a4157849f8daabcb7825cb450ec52797@ec2-3-222-204-187.compute-1.amazonaws.com:5432/d4i3ue53qch5sr'
const sequelize = new Sequelize(DB_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
    sequelize,  
};