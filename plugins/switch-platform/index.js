var Accessory, Service, Characteristic, UUIDGen;

module.exports = function (homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform('homebridge-switch-platform', 'SwitchPlatform', SwitchPlatform, true);
};

function SwitchPlatform() {
	device = {
		id: "alskdalskd",
		name: "switch"
	};
	this.addAccessory(device);
}

SwitchPlatform.prototype.addAccessory = function(device, callback) {
    const name = device.name;
    console.log('Adding: %s', name);

    const platformAccessory = new Accessory(name, UUIDGen.generate(device.id), 7 /* Accessory.Categories.OUTLET */);
    platformAccessory.addService(Service.Outlet, name);

    platformAccessory.context.deviceId = device.id;
    //platformAccessory.context.device = device;

    //const accessory = new OrviboAccessory(this.log, platformAccessory, this.orvibo);

    //accessory.configure();
    //this.accessories.set(device.macAddress, accessory);
    this.api.registerPlatformAccessories('homebridge-switch-platform-switch', 'switch', [platformAccessory]);
  }

