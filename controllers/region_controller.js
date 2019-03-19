const db = require('../models/index');

const Region = db.Region;
const Province = db.Province;

// get all regions
exports.getAll = (req, res, next) => {
    Region.findAll({
        // include: [Province],
        paranoid: false
    }).then(regions => {
        res.send(regions);
    }).catch(next);
}

// post a region
exports.post = (req, res, next) => {
    Region.create(req.body)
    .then( region => {
        res.send(region);
    }).catch(next);
}

// find region by id
exports.findById = (req, res, next) => {
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
exports.updateById = (req,res,next) => {
    Region.update({...req.body}, {where: {id: req.params.id}})
    .then(() => {
        res.send('Updated a region successfully.');
    }).catch(next);
}

// delete a region by id
exports.deleteById = (req, res, next) => {
    const id = req.params.id;
    Region.destroy({
        where: {id: id}
    })
    .then(() => {
        res.send('Deleted a Region!');
    }).catch(next);
}
