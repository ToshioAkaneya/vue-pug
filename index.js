#!/usr/bin/env node

const argv = require('yargs').argv
const htmlPugConverter = require('html-pug-converter')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const {JSDOM} = require("jsdom");
const to = require('to-case')

const walk = (dir, filelist = []) => {
  if (fs.statSync(dir).isDirectory()) {
    const files = fs.readdirSync(dir)
    for (file of files) {
      if (file[0] === '.' || file === 'node_modules') {
        continue
      }
      const filepath = path.join(dir, file)
      const stat = fs.statSync(filepath)

      if (stat.isDirectory()) {
        filelist = walk(filepath, filelist)
      } else {
        filelist.push(filepath)
      }
    }
  } else {
    if (!dir.match(/\.vue$/)) {
      throw new Error('Error: Please specify a .vue file')
    }
    filelist.push(dir)
  }
  return filelist
}

if (argv._.length !== 1) {
  throw new Error('Error: Please specify a .vue file or a directory')
}
const fileList = walk(argv._[0])
for (file of fileList) {
  if (!file.match(/\.vue$/)) {
    continue
  }
  try {
    let vue = fs.readFileSync(file, 'utf8')
    let $ = cheerio.load(vue, {
      decodeEntities: false,
      // lowerCaseTags: false
      xmlMode: true
    })
    $('*').each((i, el) => {
      el.tagName = to.slug(el.tagName)
    })
    vue = ($.xml());
    let dom = new JSDOM('<html xmlns="http://www.w3.org/1999/xhtml">' + vue + '</html>', {contentType: 'text/xml'})
    const window = dom.window;
    $ = cheerio.load(window.document.documentElement.outerHTML, {
      decodeEntities: false
    })
    const templateElement = $('head > template')
    if (templateElement.attr('lang') === 'pug') {
      console.log(file + '...lang="pug" detected. skipping...')
      continue
    }
    const template = templateElement.html()
    if (!template) {
      continue
    }
    let pug = htmlPugConverter(template)
    pug = pug.replace(`html
  head
  body`, '').replace(/^ {2}/gm, '')
    templateElement.attr('lang', 'pug')
    templateElement.html('')
    templateElement.text(pug + '\n')
    let output = $.html()
    output = output.replace(/^<html xmlns="http:\/\/www.w3.org\/1999\/xhtml"><head>/, '').replace(/<\/head><body><\/body><\/html>$/, '')
    fs.writeFileSync(file, output, 'utf8')
    console.log(file + '...done')
  } catch (err) {
    console.error('Error: Failed to process ' + file)
    throw err
  }
}

