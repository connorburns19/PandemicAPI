const express = require('express');
const timeSeriesController = require('../controllers/timeSeriesController.js');

const router = express.Router();
//get by name and data type
//router.get('/:timeseries_name/:data_type', timeSeriesController.getSeries);

router.post('/:timeseries_name/:data_type', timeSeriesController.addSeries);

router.delete('/:timeseries_name', timeSeriesController.deleteSeries);

module.exports = router