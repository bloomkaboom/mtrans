const db = require('../models/index')

const Municipality = db.Municipality;

// get all municipality
exports.getAll = (req, res, next) => {
    Municipality.findAll({
        paranoid: false
    }).then(municipalities => {
        res.send(municipalities);
    }).catch(next);
}

// post a municipality
exports.post = (req, res, next) => {
    Municipality.create(req.body)
    .then( municipality => {
        res.send(municipality);
    }).catch(next);
}

// find municipality by id
exports.findById = (req, res, next) => {
    let id = req.params.id;
    Municipality.findById(id)
    .then(municipality => {
        if(!municipality) res.sendStatus(404);
        else {
            res.send(municipality);
        }
    })
    .catch(next);
}

// update a particular municipality
exports.updateById = (req,res,next) => {
    Municipality.update({...req.body}, {where: {id: req.params.id}})
    .then(() => {
        res.send('Updated a municipality successfully.');
    }).catch(next);
}

// delete a municipality by id
exports.deleteById = (req, res, next) => {
    const id = req.params.id;
    Municipality.destroy({
        where: {id: id}
    })
    .then(() => {
        res.send('Deleted a municipality!');
    }).catch(next);
}
