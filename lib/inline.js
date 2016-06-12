const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const sass = require('node-sass')

function inline(srcFilePath, destFilePath) {
  const dirname = path.dirname(srcFilePath)

  function arrayOfFilenames(arrayOfFilenamesWithBrackets, dirname) {
    return arrayOfFilenamesWithBrackets
      .map(item => item.replace(/\'/g,''))
      .map(item => path.join(dirname, item))
  }

  function allExtensionsEqual(arrayOfFilenames) {
    return arrayOfFilenames
      .map(item => path.extname(item))
      .reduce((prev, current) => {return (prev === current) ? prev : false })
  }

  function filesToString(arrayOfFilenames) {
    switch(allExtensionsEqual(arrayOfFilenames)) {
      case '.scss' || '.sass':
        return arrayOfFilenames.reduce((total, item) => {
          return total += sass.renderSync({
            file: item
          }).css
        }, '')
        break
      case '.html' || '.css':
        return arrayOfFilenames.reduce((total, item) => {
          return total += fs.readFileSync(item, {encoding: 'UTF-8'})
        }, '')
        break
      default:
        return false
        break
    }
  }

  function notAllExtensionsEqual(arr) {
    if (!allExtensionsEqual(arr)) {
      console.log(chalk.red('Termination'))
      console.log(chalk.red('Some files could not be inlined'))
      console.log(chalk.red('All file extensions should be the same in array'))
      return true
    } else {
      return false
    }
  }

  let fileString = fs.readFileSync(srcFilePath, {encoding: 'UTF-8'})

  const stylesBlockRegexp = /styles\s*:\s*(\[[^\]]+])/i
  const templateBlockRegexp = /template\s*:\s*(require\(.*html'\))/i
  const filepathRegexp = /['"]([^)]+)['"]/g

  const stylesArray = fileString.match(stylesBlockRegexp)
  const stylesRequiresWithBrackets = stylesArray[1].match(filepathRegexp)
  const stylesRequires = arrayOfFilenames(stylesRequiresWithBrackets, dirname)

  if (notAllExtensionsEqual(stylesRequires)) return false
  const stylesString = "[`" + filesToString(stylesRequires) + "`]"

  const templateArray = fileString.match(templateBlockRegexp)
  const templateRequiresWithBrackets = templateArray[1].match(filepathRegexp)
  const templateRequires = arrayOfFilenames(templateRequiresWithBrackets, dirname)

  if (notAllExtensionsEqual(templateRequires)) return false
  const templateString = "`" + filesToString(templateRequires) + "`"

  fileString = fileString
    .replace(stylesArray[1], stylesString)
    .replace(templateArray[1], templateString)

  fs.writeFileSync(destFilePath, fileString)

  console.log(chalk.yellow('File have generated with inlined styles and template'))
}

module.exports = inline
