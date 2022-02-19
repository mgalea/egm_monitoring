var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

const color = require(path.join(global.__utilsPath, "color"));
const log = require(path.join(global.__utilsPath, 'logUtils'));
const dbEvents = require(path.join(global.__utilsPath, 'dbUtils'));

var schemaList = require(path.join(global.__root, process.env.SCHEMA_DOCUMENT_FILE));

var dbConnected = false;

const reportSchema = new mongoose.Schema({
    updated: { type: Date, default: Date.now },
}, { strict: false });

/**
 * @param {*} reportModel
 */
reportSchema.methods.create = async function (fileInfo, jsonData, cb) {
    var Document = mongoose.model(fileInfo.type, reportSchema);
    var document = new Document(jsonData);

    if (dbConnected == true) {
        document.save(function (err, doc) {
            if (err) return log.error(err);
            log.info(fileInfo.type + " - Document inserted in Db successfully");
        });
        return document;
    } else{
        return log.error('Database not connected to application.')
    }

}

dbEvents
    .on('DBCONNECT', () => {
        log.info("Registering schema in DB for Reports");

        dbConnected = true;

    })
    .on('DBERROR', () => {
        log.info("Delinking from DB");
        dbConnected = false;
    }
    );

var key = 1;
schemaList.forEach(element => {
    console.log(color.yellow((key++) + ". " + element.name + ": " + element.schema));
    mongoose.model(element.schema, reportSchema);
    module.exports = mongoose.model(element.schema);
})