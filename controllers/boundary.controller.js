const db = require('../models/index');
const utils = require('../helpers/utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Boundary = db.Boundary;

// CREATE
const post = (req, res, next) => {
    Boundary.create(req.body)
    .then(boundary => {
        res.send(boundary);
    }).catch(next);
}

// GET ALL
const getAll = (req, res, next) => {
    Boundary.findAll({
        paranoid: false
    }).then(boundary => {
        res.send(boundary);
    }).catch(next);
}

// FIND BY ID
const findById = (req, res, next) => {
    let id = req.params.id;
    Boundary.findByPk(id)
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
    Boundary.update({...req.body}, {where: {id: req.params.id}})
    .then(() => {
        res.send('Boundary updated.');
    }).catch(next);
}

// DELETE
const deleteById = (req, res, next) => {
    const id = req.params.id;
    Boundary.destroy({
        where: {id: id}
    })
    .then(() => {
        res.send(`Deleted Boundary ID no.: ${id}`);
    }).catch(next);
}

// IMPORT CSV FILE
const importcsv = async (req, res) => {
    const file = req.file ? req.file.path : null;
    console.log('File', file);
    if(!file) return ReE(res, { message: 'CSV file not found'}, 400);

    const csv = require('../helpers/csv_validator');

    const headers = {
        amountGiven: '',
        targetAmount: '',
        date: '',
        driverId: ''
    }

    async function insert(json) {
        let err, boundary;
        [err, boundary] = await to(Boundary.bulkCreate(json));
        if(err) return ReE(res, err, 500);

        return ReS(res, {
            message: 'Successfully imported CSV file',
            data: boundary
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
    let err, boundary;

    [err, boundary] = await to(Boundary.findAll());
    if(err) return ReE(res, err, 500);
    if(!boundary) return ReE(res, {message:'No data to download'}, 400);

    boundary = utils.clone(boundary);

    const json2csv = require('json2csv').Parser;
    const parser = new json2csv({encoding:'utf-8', withBOM: true});
    const csv = parser.parse(boundary);

    res.setHeader('Content-disposition', 'attachment; filename=boundaryUnits.csv');
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

    Boundary.findAll({
        attributes: [
            [db.sequelize.fn('concat', db.sequelize.col('amountGiven'), ', ', db.sequelize.col('date')), 'Result: ']
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
        amountGiven,
        targetAmount,
        date,
        driverId
    } = req.query;
    [err, boundary] = await to(Boundary.findAll({
        attributes: [
            [db.sequelize.fn('concat', db.sequelize.col('amountGiven'), ', ', db.sequelize.col('date')), 'Result: ']
		],
        where: {
            [Sequelize.Op.or]: [
                {id: {[Sequelize.Op.like]: '%' +id+ '%'}},
                {amountGiven: {[Sequelize.Op.like]: '%' +amountGiven+ '%'}},
                {targetAmount: {[Sequelize.Op.like]: '%' +targetAmount+ '%'}},
                {date: {[Sequelize.Op.like]: '%' +date+ '%'}},
                {driverId: {[Sequelize.Op.like]: '%' +driverId+ '%'}},
            ]
        },
        limit: 10
    }));
    if(err) return ReE(res, err, 500);
    return ReS(res, {
        message: 'Search result: ',
        data: boundary
    }, 200);
 }

//  PAGINATION
const getBoundaryList = (req, res, next) => {
    let limit = 10;
    let offset = 0;
    Boundary.findAndCountAll()
    .then(data => {
        let page = req.params.page;
        let pages = Math.ceil(data.count / limit);
            offset = limit * (page -1);
            Boundary.findAll({
            attributes: ['id','amountGiven','targetAmount','date','driverId'],
            limit: limit,
            offset: offset,
            $sort: { id: 1}
        })
        .then( boundary => {
            res.status(200).json({'result': boundary, 'count':data.count, 'pages': pages});
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
    getBoundaryList
}