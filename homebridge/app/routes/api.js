var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('devices.sqlite')

/* GET users listing. */
router.get('/register/:id/:name/:ip', function(req, res, next) {
	db.all('SELECT * from devices where device_id="'+req.params.id+'"',function(err,rows){
		if(rows.length) {
			db.run('UPDATE devices SET ip=?, status=? where device_id=? ', [req.params.ip, 'Active', req.params.id]);
		} else {
			db.run('INSERT INTO devices VALUES (?,?,?,?)', [req.params.id, req.params.name, req.params.ip, 'Active']);
		}
	});

  	res.send(req.params);
});

module.exports = router;