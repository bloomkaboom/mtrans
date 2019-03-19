const db = require('../models/index');
const utils = require('../helpers/utils');

const Region = db.Region;
// const Province = db.Province;


// import csv for region
const importcsv = async (req, res) => {
    const file = req.file ? req.file.path : null;
    console.log('File', file);
    if(!file) return ReE(res, { message: 'CSV file not found'}, 400);

    const csv = require('../helpers/csv_validator');

    const headers = {
        code: '',
        name: ''
    }

    async function insert(json) {
        let err, region;
        [err, region] = await to(Region.bulkCreate(json));
        if(err) return ReE(res, err, 500);

        return ReS(res, {
            message: 'Successfully imported CSV file',
            data: region
        }, 200);
    }

    async function validateJSON(json) {
        insert(json);
    }

    function start() {
        csv(file, headers)
        .then( result => {
            validateJSON(result);
        })
        .catch(err => {
            return ReE(res, {
                message: 'Failed to import csv file',
                data: err
            }, 400);
        });
    }
    start();
}

// export csv
const exportcsv = async (req, res) => {
    let err, region;

    [err, region] = await to(Region.findAll());
    if(err) return ReE(res, err, 500);
    if(!region) return ReE(res, {message:'No data to download'}, 400);

    region = utils.clone(region);

    const json2csv = require('json2csv').Parser;
    const parser = new json2csv({encoding:'utf-8', withBOM: true});
    const csv = parser.parse(region);

    res.setHeader('Content-disposition', 'attachment; filename=Region.csv');
    res.set('Content-type','text/csv');
    res.send(csv);
}

// Pagination
const getRegionList = (req, res, next) => {
    let limit = 10;
    let offset = 0;
    Region.findAndCountAll()
    .then(data => {
        let page = req.params.page;
        let pages = Math.ceil(data.count / limit);
            offset = limit * (page -1);
        Region.findAll({
            attributes: ['id','name','code'],
            limit: limit,
            offset: offset,
            $sort: { id: 1}
        })
        .then( regions => {
            res.status(200).json({'result': regions, 'count':data.count, 'pages': pages});
        });
    })
    .catch(err => {
        res.status(500).send('Internal server error');
    });
}

// get all regions
const getAll = (req, res, next) => {
    Region.findAll({
        // include: [Province],
        paranoid: false
    }).then(regions => {
        res.send(regions);
    }).catch(next);
}

// post a region
const post = (req, res, next) => {
    Region.create(req.body)
    .then( region => {
        res.send(region);
    }).catch(next);
}

// find region by id
const findById = (req, res, next) => {
    let id = req.params.id;
    Region.findById(id)
    .then(region => {
        if(!region) res.sendStatus(404);
        else {
            res.send(region);
        }
    })
    .catch(next);
}

// update a particular region
const updateById = (req,res,next) => {
    Region.update({...req.body}, {where: {id: req.params.id}})
    .then(() => {
        res.send('Updated a region successfully.');
    }).catch(next);
}

// delete a region by id
const deleteById = (req, res, next) => {
    const id = req.params.id;
    Region.destroy({
        where: {id: id}
    })
    .then(() => {
        res.send(`Deleted Region ${id}`);
    }).catch(next);
}

module.exports = {
    importcsv,
    exportcsv,
    getRegionList,
    getAll,
    post,
    findById,
    updateById,
    deleteById
}
