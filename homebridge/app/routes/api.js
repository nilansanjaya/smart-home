var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('devices.sqlite')

/* GET users listing. */
router.get('/register/:id/:name/:ip', function(req, res, next) {
	db.run('INSERT INTO devices VALUES (?,?,?,?)', [req.params.id, req.params.name, req.params.ip, 'Active']);
  	res.send(req.params);
});

module.exports = router;