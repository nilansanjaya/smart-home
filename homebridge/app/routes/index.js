var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('devices.sqlite')

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS devices (device_id TEXT, name TEXT, ip TEXT, status TEXT)')
})

db.close()

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var devices = [];
	var db = new sqlite3.Database('devices.sqlite')
db.serialize(function () {
	db.each('SELECT rowid AS id, device_id,name,ip,status FROM devices', function (err, row) {
		console.log(row.name);
	  	devices.push({"device_id": row.device_id, "name" : row.name, "ip" : row.ip, "status": row.status});
	}, function() {
		console.log(devices);
		res.render('index.html', { title: 'Homebridge', 'devices': devices });
	})
})

	db.close();
});

module.exports = router;