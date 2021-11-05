var path = require("path");
var fs = require("fs")

var TMP_FOLDER_LOCATION = path.join(__dirname, '..', 'test', 'tmp');

!fs.existsSync(TMP_FOLDER_LOCATION) && fs.mkdirSync(TMP_FOLDER_LOCATION);

function cleanCRLF(str) {
  return str.trim().replace(/\r\n/gm, '\n');
}

function readCleanCRLF(fpath) {
  return fs.readFileSync(fpath, 'utf8')
    .trim()
    .replace(/\r\n/gm, '\n');
}

function getTmpfilePath(name) {
  return path.join(TMP_FOLDER_LOCATION, name)
}

function writeTmpFile(name, content) {
  // Create the tmp directory if it doesn't exist
  !fs.existsSync(TMP_FOLDER_LOCATION) && fs.mkdirSync(TMP_FOLDER_LOCATION);

  // Write the metadata to a file
  fs.writeFileSync(
    path.join(TMP_FOLDER_LOCATION, name),
    content,
  );
}

function readTmpFile(name) {
  var fullPath = path.join(TMP_FOLDER_LOCATION, name)
  return fs.readFileSync(fullPath, 'utf8');
}

function deleteTmpFolder() {
  if (!fs.existsSync(TMP_FOLDER_LOCATION)) {
    throw new Exception("Failed to delete files in " + TMP_FOLDER_LOCATION);
  }

  fs.readdirSync(TMP_FOLDER_LOCATION).forEach(function(file){
    var curPath = path.join(TMP_FOLDER_LOCATION, file);
    var isDirectory = fs.lstatSync(curPath).isDirectory();

    if (isDirectory) { // recurse
      deleteTmpFolder(curPath);
    } else { // Single file, delete it
      fs.unlinkSync(curPath);
    }
  });

  // Finally, erase the folder
  fs.rmdirSync(TMP_FOLDER_LOCATION);
};

module.exports = {
  cleanCRLF,
  deleteTmpFolder,
  getTmpfilePath,
  readCleanCRLF,
  readTmpFile,
  TMP_FOLDER_LOCATION,
  writeTmpFile,
}