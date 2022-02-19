var mongoose = require('mongoose');

var LogFileSchema = new mongoose.Schema({
  filename: String,
  operator_id: String,
  report_datetime: { type: Date},
  recv_datetime: { type: Date, default: Date.now },
  report_type: String,
  version: Number,
  hash: { type: String, default: null },
  accepted: Boolean,
  message: Object

});

LogFileSchema.methods.create = function (fileInfo) {
  this.filename = fileInfo.filename;
  this.operator_id = fileInfo.operID;
  if (fileInfo.UTCdatetime) this.report_datetime = fileInfo.UTCdatetime;
  if (fileInfo.type)this.report_type = fileInfo.type;
  this.hash = fileInfo.hash || null;
  this.message = fileInfo.message;
  this.accepted = fileInfo.valid;
  mongoose.model('LogFile', LogFileSchema).create(this)
}

LogFileSchema.methods.fileInfoExist = function (fileInfo, cb) {

  mongoose.model('LogFile', LogFileSchema).countDocuments({ filename: fileInfo.filename }, function (err, count) {
    cb(count);
  })
}

LogFileSchema.methods.findFilebyName = function (cb) {
  return mongoose.model('LogFile').find({ filename: new RegExp('.*' + this.filename + '.*', 'i') }, cb);
}

mongoose.model('LogFile', LogFileSchema);

module.exports = mongoose.model('LogFile');