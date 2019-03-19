'use strict';

const express      = require('express');
const multer       = require('multer');

const router       = express.Router();
const upload       = multer({ dest: './uploads/'})
// var upload         = multer({ storage:storage });

const regions      = require('../controllers/region_controller');
const province     = require('../controllers/province_controller');
const municipality = require('../controllers/municipality_controller');
const mapper       = require('../controllers/mapper_controller');

router.post('/regions/postRegion', regions.post);
router.get('/regions/getRegions', regions.getAll);
router.get('/regions/findRegion/:id', regions.findById);
router.put('/regions/updateRegion/:id', regions.updateById);
router.delete('/regions/delete/:id', regions.deleteById);

router.post('/provinces/postProvince', province.post);
router.get('/provinces/getProvinces', province.getAll);
router.get('/provinces/findProvince/:id', province.findById);
router.put('/provinces/updateProvince/:id',province.updateById);
router.delete('/provinces/delete/:id', province.deleteById);
router.get('/provinces/export', province.exportcsv);
router.post('/provinces/import', upload.single('file') , province.importcsv);
router.get('/provinces/pagination/:page', province.getProvinceList);

router.post('/municipalities/postMunicipality', municipality.post);
router.get('/municipalities/getMunicipalities', municipality.getAll);
router.get('/municipalities/findMunicipality/:id', municipality.findById);
router.put('/municipalities/updateMunicipality/:id', municipality.updateById);
router.delete('/municipalities/delete/:id', municipality.deleteById);

router.get('/mapper/all', mapper.getLocs);

module.exports = router;
