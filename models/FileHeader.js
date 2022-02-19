var mongoose = require('mongoose');

var fileHeaderSchema = new mongoose.Schema({
  report_type: String,
  frequency: String,
  category: String,
  creation_datetime: { type: Date },
  report_datetime: { type: Date },
  period_hours: String,
  report_country: String,
  operator_id: String,
  operator_url: [],
  version: Number,
  meta: {
    filename: String,
    schema: String,
    recv_datetime: { type: Date, default: Date.now }
  }
});

/**
 * @param {*} fileHeader
 */
fileHeaderSchema.methods.create = function (fileHeader, fileInfo) {
  this.report_type = fileHeader.Tp || 'Report';
  this.frequency = fileHeader.PrdTp || 'Periodic';
  this.category = fileHeader.Ctgy || 'Summary';
  this.creation_datetime = fileHeader.CrtDtTm;
  this.report_datetime = fileHeader.RprtStrtDt;
  this.period_hours = fileHeader.RptPrd || 'P1D';
  this.report_country = fileHeader.RprtToCntry || 'MT';
  this.operator_id = fileInfo.operID;
  this.version = fileInfo.version;
  this.meta.schema = fileInfo.schema || '';
  this.meta.filename = fileInfo.filename;
  mongoose.model('FileHeader', fileHeaderSchema).create(this)
}

/**
 * Check if a file exist using fileInfo Object
 * @param {fileInfo}
 * @callback cb 
 */
fileHeaderSchema.methods.fileNameExist = function (fileInfo, cb) {

  mongoose.model('FileHeader', fileHeaderSchema).countDocuments({'meta.filename': fileInfo.filename }, function (err, count) { //<!-- @todo add error routines
    cb(count);
  })
}

fileHeaderSchema.methods.findFilebyName = function (cb) {
  return mongoose.model('FileHeader').find({ filename: new RegExp('.*' + this.filename + '.*', 'i') }, cb);
}

fileHeaderSchema.methods.findFileVersionsbyName = function (cb) {
  return mongoose.model('FileHeader').find({ filename: new RegExp('.*' + this.filename + '.*', 'i') }, cb);
}

mongoose.model('FileHeader', fileHeaderSchema);

module.exports = mongoose.model('FileHeader');