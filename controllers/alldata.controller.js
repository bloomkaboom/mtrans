const db = require('../models/index');
const utils = require('../helpers/utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Jeepney = db.Jeepney;
const Schedule = db.Schedule;
const Driver = db.Driver;
const Boundary = db.Boundary;

const getAllData = (req, res, next) => {
    Jeepney.findAll({paranoid: false,
        include: [
            {paranoid: false,
                model: Schedule,
                include: [
                    {paranoid: false,
                        model: Driver,
                        include: [
                            {paranoid: false,
                                model: Boundary
                            }
                        ]
                    }
                ]
            }
        ]
    }).then( all => {
        res.send({List: all});
    }).catch(err => {
        res.status(500).send('Internal server error');
    });
}

module.exports = {
    getAllData
}