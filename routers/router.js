'use strict';

const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/'})
const data = require('../controllers/alldata.controller');
const jeepney = require('../controllers/jeepney.controller');
const schedule = require('../controllers/schedule.controller');

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

module.exports = router;