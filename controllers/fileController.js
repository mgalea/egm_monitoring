/**
 * HTTP File Upload Controller
 * @module File Controllers
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

const LogFile = require('../models/LogFile');
const Multer = require("multer");
const FS = require("fs");
const path = require("path");

const log = require(path.join(global.__utilsPath, 'logUtils'));
const sep = path.sep;

/**
 * @constant storage sets the Multer disk storage parameter used in this module
 * @description required to ensure that files are saved by the same name they were uploaded at source
 */
const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, global.__uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var DocFilter = function (req, file, cb) {

    if (!file.originalname.match(new RegExp(process.env.REPORT_FILENAME_REGEX, 'i'))) {
        return cb(new Error('Incorrect filename or filetype'), false);
    }
    cb(null, file);
};

/**
 * @param Multer object - must include storage type
 * @param request.file.filename - original filename of the uploaded file
 * @callback REQ/RES
*/

var controllers =
{
    FindFilebyName: function (req, res) {
        const logFile = new LogFile({ filename: req.params.filename });
        logFile.findFilebyName(function (err, result) {
            res.status(200).json(result);
        });
    },
    UploadFile: function (request, response) {
        var upload = Multer({ storage: storage, fileFilter: DocFilter }).single("report");
        upload(request, response, function (err) {
            if (err) {

                response.status(404).json({ received: err.message, status: 'Aborted' });
            } else {
                if (typeof request.file === 'undefined')
                    response.status(404).json({ received: 'FAIL', status: 'no upload - aborted' }); //@todo has not been tested
                else
                    response.status(200).json({ received: 'OK', status: 'processing', filename: request.file.filename });
            }
        });
    },

    CountDirFiles: function (request, response) {

        if ((typeof request.body.year === 'undefined') || (typeof request.body.month === 'undefined')) {
            response.status(404).json({ value: "Year and month cannot be null.", total: false });
            return;
        }

        if (!(isNumeric(request.body.month))) {
            response.status(404).json({ value: "Month must be integer.", total: false });
            return;
        } else if (parseInt(request.body.month) < 1 || parseInt(request.body.month) > 12) {
            response.status(404).json({ value: "Month must be integer between 1 and 12.", total: false });
            return;
        }
        const month = ("0" + request.body.month).slice(-2);

        if (!(isNumeric(request.body.year))) {
            response.status(404).json({ value: "Year must be an integer", total: false });
            return;
        } else if (parseInt(request.body.year) < 2021 || parseInt(request.body.day) > 2021) {
            response.status(404).json({ value: "Year must be integer between 2021 and 2021.", total: false });
            return;
        }
        var day = "";
        if (typeof request.body.day === 'string') {
            if (!(isNumeric(request.body.day))) {
                response.status(404).json({ value: "Day must be an integer", total: false });
                return;
            } else if (parseInt(request.body.day) < 1 || parseInt(request.body.day) > 31) {
                response.status(404).json({ value: "Day must be integer between 1 and 31.", total: false });
                return;
            }

            day = ("0" + request.body.day).slice(-2);
        }

        let pattern = undefined;

        if (typeof request.body.pattern === 'string') {
            console.log(pattern);
            pattern = new RegExp(request.body.pattern, 'i');

        }

        fullPath = path.join(global.__archivePath, sep, request.body.year, month, sep, (typeof day === 'string') ? day : '');

        console.log(fullPath);

        const result = getAllDirFiles(fullPath) || [];

        response.status(200).json({ result: result, total: result.length });


        function getAllDirFiles(dirPath, arrayOfFiles) {
            try {
                files = FS.readdirSync(dirPath)
            } catch (err) {
                log.error("No such file or Directory: ", dirPath);
                return;
            }

            arrayOfFiles = arrayOfFiles || []

            files.forEach(function (file) {
                if (FS.statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
                } else {
                    if (typeof pattern === 'undefined') {

                        arrayOfFiles.push(file);

                    } else if (file.search(pattern) >= 0) {
                        arrayOfFiles.push(file);
                    }

                }
            })

            return arrayOfFiles;
        }

        function isNumeric(str) {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                !isNaN(parseInt(str)) // ...and ensure strings of whitespace fail
        }

    }

}

module.exports = controllers;
