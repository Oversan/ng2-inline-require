const fs = require('fs')

function stats(path, obj) {
  try {
    const stats = fs.statSync(path)
    return stats[obj]()
  } catch(err) {
    return false
  }
}

function isFile(path) {
  return stats(path, 'isFile')
}

function isDirectory(path) {
  return stats(path, 'isDirectory')
}

module.exports = {
  isFile,
  isDirectory
}
