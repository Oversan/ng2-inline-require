const path = require('path')
const glob = require('glob')
const isFile = require('./fileHelpers').isFile
const isDirectory = require('./fileHelpers').isDirectory

const ext = "**/*.ts"

function fileListCreator(srcPath, destPath) {
  if (isFile(srcPath) && !isDirectory(destPath)) {
    return [{
      src: srcPath,
      dest: destPath
    }]
  } else if (isDirectory(srcPath) && isDirectory(destPath)) {
    const options = {
      cwd: srcPath,
      dot: true,
      ignore: [
        '**/node_modules/**/*'
      ]
    }

    return glob.sync(ext, options)
      .map(item => {
        return {
          src: path.join(srcPath, item),
          dest: path.join(destPath, path.basename(item))
        }
      })
  } else {
    return []
  }
}

module.exports = fileListCreator
