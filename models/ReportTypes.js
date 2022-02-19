var mongoose = require('mongoose');

var reportTypeSchema = new mongoose.Schema({
name: String,
schema_name: String,
Tp: String,
PrdTp: String,
Ctgy: String,
RptPrd: String,
RptToCntry:String,
RprtOprtr:String,
CrtDtTime: Date,
RprtStrtDt: Date,
VrsNb: Number
});

/**
 * @param {*} fileHeader
 */
reportTypeSchema.methods.create = function (reportHeader) {

    mongoose.model('ReportType', reportTypeSchema).create(this)
}

/**
 * Check if a file exist using fileInfo Object
 * @param {fileInfo}
 * @callback cb 
 */
reportTypeSchema.methods.fileInfoExist = function (fileInfo, cb) {

    mongoose.model('ReportType', reportTypeSchema).countDocuments({ filename: fileInfo.filename }, function (err, count) { //<!-- @todo add error routines
    cb(count);
  })
}

reportTypeSchema.methods.findReportbyName = function (cb) {
    return mongoose.model('ReportType').find({ filename: new RegExp('.*' + this.filename + '.*','i') }, cb);
}

mongoose.model('ReportType', reportTypeSchema);
module.exports = mongoose.model('ReportType');