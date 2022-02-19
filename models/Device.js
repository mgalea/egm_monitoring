var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
    device_id: String,
    location_id: Number,
    install_date: { type: Date, default: Date.now },
});

/**
 * @param {*} Devices
 */
deviceSchema.methods.create = function (deviceInfo) {
    const today = new Date().toISOString();
    this.id = device.id;
    this.location_id = device.location;
    this.install_date = today;
    mongoose.model('devices', deviceSchema).create(this)
}

/**
 * Check if a file exist using fileInfo Object
 * @param {fileInfo}
 * @callback cb 
 */
deviceSchema.methods.listDevices = function (fileInfo, cb) {

    mongoose.model('devices', deviceSchema).distinct({ id }, function (err, list) { //<!-- @todo add error routines
        cb(list);
    })
}

deviceSchema.methods.findDevicebyName = function (cb) {
    return mongoose.model('devices').find({ filename: new RegExp('.*' + this.filename + '.*', 'i') }, cb);
}

var device =mongoose.model('devices', deviceSchema);

module.exports = device;