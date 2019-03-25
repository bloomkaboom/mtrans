const db = require('../models/index');
const utils = require('../helpers/utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Jeepney = db.Jeepney;

// CREATE
const post = (req, res, next) => {
    Jeepney.create(req.body)
    .then( jeep => {
        res.send(jeep);
    }).catch(next);
}

// GET ALL
const getAll = (req, res, next) => {
    Jeepney.findAll({
        paranoid: false
    }).then(jeepneys => {
        res.send(jeepneys);
    }).catch(next);
}

// FIND BY ID
const findById = (req, res, next) => {
    let id = req.params.id;
    Jeepney.findByPk(id)
    .then(region => {
        if(!region) res.sendStatus(404);
        else {
            res.send(region);
        }
    })
    .catch(next);
}

// UPDATE
const updateById = (req,res,next) => {
    Jeepney.update({...req.body}, {where: {id: req.params.id}})
    .then(() => {
        res.send('Jeepney unit updated.');
    }).catch(next);
}

// DELETE
const deleteById = (req, res, next) => {
    const id = req.params.id;
    Jeepney.destroy({
        where: {id: id}
    })
    .then(() => {
        res.send(`Deleted jeepney ID no.: ${id}`);
    }).catch(next);
}

// IMPORT CSV FILE
const importcsv = async (req, res) => {
    const file = req.file ? req.file.path : null;
    console.log('File', file);
    if(!file) return ReE(res, { message: 'CSV file not found'}, 400);

    const csv = require('../helpers/csv_validator');

    const headers = {
        plateNumber: '',
        route: '',
        coding: '',
        color: '',
        bodyType: ''
    }

    async function insert(json) {
        let err, jeepney;
        [err, jeepney] = await to(Jeepney.bulkCreate(json));
        if(err) return ReE(res, err, 500);

        return ReS(res, {
            message: 'Successfully imported CSV file',
            data: jeepney
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

// EXPORT CSV FILE
const exportcsv = async (req, res) => {
    let err, jeepney;

    [err, jeepney] = await to(Jeepney.findAll());
    if(err) return ReE(res, err, 500);
    if(!jeepney) return ReE(res, {message:'No data to download'}, 400);

    jeepney = utils.clone(jeepney);

    const json2csv = require('json2csv').Parser;
    const parser = new json2csv({encoding:'utf-8', withBOM: true});
    const csv = parser.parse(jeepney);

    res.setHeader('Content-disposition', 'attachment; filename=JeepneyUnits.csv');
    res.set('Content-type','text/csv');
    res.send(csv);
}

// FILTER (FIELDS)
const filter = async (req, res, next) => {
	let reqQuery = req.query;
	let reqQuery_Sort = req.query.sortBy;
	let condition = {};
	let sort = [];
    if (Object.keys(reqQuery).length > 0) {
        if (reqQuery_Sort) {
            sort = await db.convertToArrSort(reqQuery_Sort); //get Array Sort
            delete reqQuery.sortBy; //remove sortBy key from req.query
        }
        condition = reqQuery; //get Condition(s)
    }

    Jeepney.findAll({
        attributes: [
            [db.sequelize.fn('concat', db.sequelize.col('plateNumber'), ', ', db.sequelize.col('route')), 'Result: ']
		],
        where: condition,
        order: sort,
        limit: 10
    }).then(users => {
        res.send(users);
    }).catch(err => {
        console.log(err);
    });
}

// SEARCH (LIKE) 
const search = async (req, res, next) => {
    res.setHeader('Content-type','application/json');
    const {
        id,
        plateNumber,
        route,
        coding,
        color,
        bodyType
    } = req.query;
    [err, jeepney] = await to(Jeepney.findAll({
        attributes: [
            [db.sequelize.fn('concat', db.sequelize.col('plateNumber'), ', ', db.sequelize.col('route')), 'Result: ']
		],
        where: {
            [Sequelize.Op.or]: [
                {id: {[Sequelize.Op.like]: '%' +id+ '%'}},
                {plateNumber: {[Sequelize.Op.like]: '%' +plateNumber+ '%'}},
                {route: {[Sequelize.Op.like]: '%' +route+ '%'}},
                {color: {[Sequelize.Op.like]: '%' +color+ '%'}},
                {bodyType: {[Sequelize.Op.like]: '%' +bodyType+ '%'}},
            ]
        },
        limit: 10
    }));
    if(err) return ReE(res, err, 500);
    return ReS(res, {
        message: 'Search result: ',
        data: jeepney
    }, 200);
 }

//  PAGINATION
const getJeepneyList = (req, res, next) => {
    let limit = 10;
    let offset = 0;
    Jeepney.findAndCountAll()
    .then(data => {
        let page = req.params.page;
        let pages = Math.ceil(data.count / limit);
            offset = limit * (page -1);
        Jeepney.findAll({
            attributes: ['id','plateNumber','route','coding','color','bodyType'],
            limit: limit,
            offset: offset,
            $sort: { id: 1}
        })
        .then( jeep => {
            res.status(200).json({'result': jeep, 'count':data.count, 'pages': pages});
        });
    })
    .catch(err => {
        res.status(500).send('Internal server error');
    });
}

module.exports = {
    post,
    getAll,
    findById,
    updateById,
    deleteById,
    importcsv,
    exportcsv,
    filter,
    search,
    getJeepneyList
}