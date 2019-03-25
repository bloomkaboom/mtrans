const db = require('../models/index');
const utils = require('../helpers/utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Schedule = db.Schedule;

// CREATE
const post = (req, res, next) => {
    Schedule.create(req.body)
    .then( sched => {
        res.send(sched);
    }).catch(next);
}

// GET ALL
const getAll = (req, res, next) => {
    Schedule.findAll({
        paranoid: false
    }).then(sched => {
        res.send(sched);
    }).catch(next);
}

// FIND BY ID
const findById = (req, res, next) => {
    let id = req.params.id;
    Schedule.findByPk(id)
    .then(schedule => {
        if(!schedule) res.sendStatus(404);
        else {
            res.send(schedule);
        }
    })
    .catch(next);
}

// UPDATE
const updateById = (req,res,next) => {
    Schedule.update({...req.body}, {where: {id: req.params.id}})
    .then(() => {
        res.send('Schedule updated.');
    }).catch(next);
}

// DELETE
const deleteById = (req, res, next) => {
    const id = req.params.id;
    Schedule.destroy({
        where: {id: id}
    })
    .then(() => {
        res.send(`Deleted Schedule ID: ${id}`);
    }).catch(next);
}

// IMPORT CSV FILE
const importcsv = async (req, res) => {
    const file = req.file ? req.file.path : null;
    console.log('File', file);
    if(!file) return ReE(res, { message: 'CSV file not found'}, 400);

    const csv = require('../helpers/csv_validator');

    const headers = {
        name: '',
        timeIn: '',
        timeOut: '',
        jeepneyId: ''
    }

    async function insert(json) {
        let err, schedule;
        [err, schedule] = await to(Schedule.bulkCreate(json));
        if(err) return ReE(res, err, 500);

        return ReS(res, {
            message: 'Successfully imported CSV file',
            data: schedule
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
    let err, schedule;

    [err, schedule] = await to(Schedule.findAll());
    if(err) return ReE(res, err, 500);
    if(!schedule) return ReE(res, {message:'No data to download'}, 400);

    schedule = utils.clone(schedule);

    const json2csv = require('json2csv').Parser;
    const parser = new json2csv({encoding:'utf-8', withBOM: true});
    const csv = parser.parse(schedule);

    res.setHeader('Content-disposition', 'attachment; filename=schedule.csv');
    res.set('Content-type','text/csv');
    res.send(csv);
}

// FILTER (FIELDS)
const filter = async (req, res, next) => {
	let reqQuery = req.query;
	let reqQuery_Sort = req.query.sortBy;
	let condition = {id,
        name,
        timeIn,
        timeOut};
	let sort = [];
    if (Object.keys(reqQuery).length > 0) {
        if (reqQuery_Sort) {
            sort = await db.convertToArrSort(reqQuery_Sort); //get Array Sort
            delete reqQuery.sortBy; //remove sortBy key from req.query
        }
        condition = reqQuery; //get Condition(s)
    }

    Schedule.findAll({
        attributes: [
            [db.sequelize.fn('concat', db.sequelize.col('name'), ', ', db.sequelize.col('jeepneyId')), 'Result: ']
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
    let condition = {
        id,
        name,
        timeIn,
        timeOut
    } = req.query;
    [err, schedule] = await to(Schedule.findAll({
        attributes: [
            [db.sequelize.fn('concat', db.sequelize.col('name'), ', ', db.sequelize.col('jeepneyId')), 'Result: ']
        ],
        where: {
            [Sequelize.Op.or]: [
                {id: {[Sequelize.Op.like]: '%' +id+ '%'}},
                {name: {[Sequelize.Op.like]: '%' +name+ '%'}},
                {timeIn: {[Sequelize.Op.like]: '%' +timeIn+ '%'}},
                {timeOut: {[Sequelize.Op.like]: '%' +timeOut+ '%'}}
            ]
        },
        limit: 10
    }));
    if(err) return ReE(res, err, 500);
    return ReS(res, {
        message: 'Search result: ',
        data: schedule
    }, 200);
 }

 //  PAGINATION
const getScheduleList = (req, res, next) => {
    let limit = 10;
    let offset = 0;
    Schedule.findAndCountAll()
    .then(data => {
        let page = req.params.page;
        let pages = Math.ceil(data.count / limit);
            offset = limit * (page -1);
            Schedule.findAll({
            attributes: ['id','name','timeIn','timeOut'],
            limit: limit,
            offset: offset,
            $sort: { id: 1}
        })
        .then( schedule => {
            res.status(200).json({'result': schedule, 'count':data.count, 'pages': pages});
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
    getScheduleList
}