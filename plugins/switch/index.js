var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-switch", "HTTPSwitch", HTTPSwitchAccessory);
}

function HTTPSwitchAccessory(log, config) {
    // global vars
    this.log = log;

    // configuration vars
    this.name = config["name"];
    this.upURL = '';
    this.downURL = '';
    this.httpMethod = config["http_method"] || "POST";

    this.device_id = config["device_id"];

    request({
    method: "GET",
    url: "http://localhost:3000/api/getip/"+this.device_id,
    }, function(err, response, body) {

        this.upURL = "http://"+body+"/?pin=ON";
        this.downURL = "http://"+body+"/?pin=OFF";

    

    console.log(this.upURL);

    // state vars
    this.lastPosition = 0; // last known position of the blinds, down by default
    this.currentPositionState = 2; // stopped by default
    this.currentTargetPosition = 0; // down by default

    // register the service and provide the functions
    this.service = new Service.WindowCovering(this.name);

    // the current position (0-100%)
    // https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L493
    this.service
        .getCharacteristic(Characteristic.CurrentPosition)
        .on('get', this.getCurrentPosition.bind(this));

    // the position state
    // 0 = DECREASING; 1 = INCREASING; 2 = STOPPED;
    // https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1138
    this.service
        .getCharacteristic(Characteristic.PositionState)
        .on('get', this.getPositionState.bind(this));

    // the target position (0-100%)
    // https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1564
    this.service
        .getCharacteristic(Characteristic.TargetPosition)
        .on('get', this.getTargetPosition.bind(this))
        .on('set', this.setTargetPosition.bind(this));


    }.bind(this));
}

HTTPSwitchAccessory.prototype.getCurrentPosition = function(callback) {
    this.log("Requested CurrentPosition: %s", this.lastPosition);
    callback(null, this.lastPosition);
}

HTTPSwitchAccessory.prototype.getPositionState = function(callback) {
    this.log("Requested PositionState: %s", this.currentPositionState);
    callback(null, this.currentPositionState);
}

HTTPSwitchAccessory.prototype.getTargetPosition = function(callback) {
    this.log("Requested TargetPosition: %s", this.currentTargetPosition);
    callback(null, this.currentTargetPosition);
}

HTTPSwitchAccessory.prototype.setTargetPosition = function(pos, callback) {
    this.log("Set TargetPosition: %s", pos);
    this.currentTargetPosition = pos;
    const moveUp = (this.currentTargetPosition >= this.lastPosition);
    this.log((moveUp ? "Moving up" : "Moving down"));

    this.service
        .setCharacteristic(Characteristic.PositionState, (moveUp ? 1 : 0));

    this.httpRequest((moveUp ? this.upURL : this.downURL), this.httpMethod, function() {
        this.log("Success moving %s", (moveUp ? "up (to 100)" : "down (to 0)"))
        this.service
            .setCharacteristic(Characteristic.CurrentPosition, (moveUp ? 100 : 0));
        this.service
            .setCharacteristic(Characteristic.PositionState, 2);
        this.lastPosition = (moveUp ? 100 : 0);

        callback(null);
    }.bind(this));
}

HTTPSwitchAccessory.prototype.httpRequest = function(url, method, callback) {
  request({
    method: method,
    url: url,
  }, function(err, response, body) {
    /*if (!err && response.statusCode == 200) {
      callback(null);
    } else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }*/
    callback(null);
  }.bind(this));
}

HTTPSwitchAccessory.prototype.getServices = function() {
  return [this.service];
}
