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
    const destPattern = '**/' + destPath.replace(/^[\.\/]+/, '').replace(/\/$/g, '') + '/**/*'
    const options = {
      cwd: srcPath,
      dot: true,
      ignore: [
        '**/node_modules/**/*',
        destPattern
      ]
    }

    return glob.sync(ext, options)
      .map(item => {
        return {
          src: item,
          dest: path.join(destPath, path.basename(item))
        }
      })
  } else {
    return []
  }
}

module.exports = fileListCreator
