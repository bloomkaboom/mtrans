'use strict';

const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/'})
const data = require('../controllers/alldata.controller');
const jeepney = require('../controllers/jeepney.controller');
const schedule = require('../controllers/schedule.controller');
const driver = require('../controllers/driver.controller');
const boundary = require('../controllers/boundary.controller');

router.get('/data/get', data.getAllData);
router.post('/jeepney/post', jeepney.post);
router.get('/jeepney/get', jeepney.getAll);
router.get('/jeepney/get/:id', jeepney.findById);
router.put('/jeepney/put/:id', jeepney.updateById);
router.delete('/jeepney/delete/:id', jeepney.deleteById);
router.post('/jeepney/import', upload.single('file') , jeepney.importcsv);
router.get('/jeepney/export', jeepney.exportcsv);
router.get('/jeepney/filter', jeepney.filter);
router.get('/jeepney/search', jeepney.search);
router.get('/jeepney/pagination/:page', jeepney.getJeepneyList);

router.post('/schedule/post', schedule.post);
router.get('/schedule/get', schedule.getAll);
router.get('/schedule/get/:id', schedule.findById);
router.put('/schedule/put/:id', schedule.updateById);
router.delete('/schedule/delete/:id', schedule.deleteById);
router.post('/schedule/import', upload.single('file') , schedule.importcsv);
router.get('/schedule/filter', schedule.filter);
router.get('/schedule/search', schedule.search);
router.get('/schedule/pagination/:page', schedule.getScheduleList);

router.post('/driver/post', driver.post);
router.get('/driver/get', driver.getAll);
router.get('/driver/get/:id', driver.findById);
router.put('/driver/put/:id', driver.updateById);
router.delete('/driver/delete/:id', driver.deleteById);
router.post('/driver/import', upload.single('file') , driver.importcsv);
router.get('/driver/filter', driver.filter);
router.get('/driver/search', driver.search);
router.get('/driver/pagination/:page', driver.getDriverList);

router.post('/boundary/post', boundary.post);
router.get('/boundary/get', boundary.getAll);
router.get('/boundary/get/:id', boundary.findById);
router.put('/boundary/put/:id', boundary.updateById);
router.delete('/boundary/delete/:id', boundary.deleteById);
router.post('/boundary/import', upload.single('file') , boundary.importcsv);
router.get('/boundary/filter', boundary.filter);
router.get('/boundary/search', boundary.search);
router.get('/boundary/pagination/:page', boundary.getBoundaryList);

module.exports = router;