/**
 * @module File Utils
 * @description file-based Utility function 
 * 
 */
var fs = require('fs-extra');
const path = require('path');
const os = require('os');
const sep = path.sep;

/**
 * @function fileExists
 * @description check if a file already exists
 * @param  filepath:string filepath to search for
 * @param  {object} fileInfo fileInfo
 *
 */
function existsInArchive(file, cb) {
    var fullname = path.join(global.__archivePath, sep, date.replace(/[^0-9]/g, sep), file);

    if (fs.existsSync(fullname)) {
        cb(true, 'File already exist in archive.');
    } else {
        cb(false);
    }
}

function getCurrentFilenames(dirname) {
    console.log("\nCurrent filenames:");
    fs.readdirSync(dirname).forEach(file => {
        console.log(file);
    });
    console.log("\n");
}

/**
 * @function mkDirByPathSync
 * @param {string} targetDir 
 * @param {boolean} isRelativeToScript
 * @return CurDir:  The path Created Directory or false if failed
 * @description Default, make directories relative to current working directory.
 * @description mkDirByPathSync('path/to/dir').
 * @description Make directories relative to the current script.
 * @description mkDirByPathSync('path/to/dir', { isRelativeToScript: true }).
 * @description Make directories with an absolute path.
 * @description mkDirByPathSync('/path/to/dir').
 */
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir, { recursive: true });
        } catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                log.info('Directory %s already exists', targetDir);
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                log.info(`EACCES: permission denied, mkdir ${parentDir}`);
                return -1;
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                log.info(err);
                return -1;
            }
        }
        return curDir;
    }, initDir);
}
/**
 * @function mkTmpDirByPathSync
 * @param {string} targetDir
 * @description Default, create directory in the OS default Temp folder
 * @description mkDirByPathSync('path/to/dir').
 */
function mkTmpDirByPathSync(targetDir) {
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = os.tmpdir() ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir, { recursive: true });
        } catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                throw err; // Throw if it's just the last created dir.
            }
        }

        return curDir;
    }, initDir);
}


/**
 * @function createDir
 * @description create a Directory if it does not exist
 * @param  dirPath string: directory path
 * @returns true: if directory was created
 *          false: if directory already exists
 *          err: any other error
 */
async function createDirSync(dirPath) {

    try {
        if (!fs.existsSync(dirPath)) {
            return mkDirByPathSync(dirPath);
        } else {
            return false;
        }

    } catch (err) {
        return false;
    }

}

/**
 * @param  {} filepath
 * @param  {} fileInfo
 * @param  {} cb
 */
function storeFile(fileInfo, cb) {
    var archive_dir = path.join(process.env.ARCHIVE_DIR + '/' + fileInfo.date.replace(/[^0-9]/g, sep));

    if (createDirSync(archive_dir) === false) {
        cb(true, archive_dir);
    } else {
        move(fileInfo.filepath, path.join(archive_dir, '/', fileInfo.filename), (err) => {
            if (err) {
                console.dir(err);
                cb('File could not be moved or copied to archive ' + archive_dir, null);
            }
            else {
                cb(null, archive_dir);
            }

        });
    }
}

/**
 * @function move 
 * @description moves a file from oldPath, newPath
 * @param  {} oldPath
 * @param  {} newPath
 * @param  {} callback
 */
function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {  //This occurs if the oldpath and newpath are not mounted on the same filing system
                copy();
            } else {
                if (callback) {
                    callback();
                }
            }
            return;
        }
        if (callback) {
            callback();
        }
    });
    /**
     * @hideconstructor 
     */
    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', (e) => {
            callback(e);
        }
        );
        writeStream.on('error', (e) => {
            callback(e);
        }
        );

        writeStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}
module.exports.move = move;
module.exports.store = storeFile;
module.exports.createDir = mkDirByPathSync;
module.exports.createTmpDir = mkTmpDirByPathSync;