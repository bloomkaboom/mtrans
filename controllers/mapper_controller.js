const db = require('../models/index');

const Municipality = db.Municipality;
const Province = db.Province;
const Region = db.Region;



exports.getLocs = (req, res, next) => {
    Region.findAll({
        include: [{
            model: Province,
            include: [Municipality]
        }],
        paranoid: false
    }).then(municipalities => {
        res.send({Regions: municipalities});
    }).catch(next);
}


