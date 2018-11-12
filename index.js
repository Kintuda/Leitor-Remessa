let env = require('dotenv').config()
const fs = require('fs')
const OS = require('os')
const path = require('path')
const process = require('./modules/process')
const basePath = './remessas'
const savePath = './result'
const { promisify } = require('util')

let config = {
  saveFile: true
}
const checkDirectory = async time => {
  let files = fs.readdirSync(basePath)
  if (files.length === 0) {
    console.log('Pasta Vazia')
    return null
  }
  let result = new Array()
  files
    .filter(remessa => path.extname(remessa) === '.rem')
    .map(async (location) => {
      let remessa = fs.readFileSync(path.join(basePath, location), 'latin1')
      let segmentos = remessa.replace(/[^\x00-\x7F]/g, '').split(OS.EOL)
      let cnab = null
      let banco = null
      console.log(segmentos[0].length);
      switch (segmentos[0].length) {
        case 401:
          cnab = 400
          banco = segmentos[0].substring(76, 79)
          break
        case 241:
          cnab = 240
          banco = segmentos[0].substring(0, 3)
          break
        default:
          // fs.unlinkSync(path.join(basePath, location))
          throw new Error('Numero de posições inválido')
      }
      result.push(process(cnab, banco, segmentos, path.join(basePath, location)))
      // fs.unlinkSync(path.join(basePath, location))
    })
  return Promise.all(result)
}

const init = async time => {
  try {
    let timer = promisify(setTimeout)
    await timer(time)
    console.log('Inicializando processo')
    let res = await checkDirectory()
    if (res) {
      if (config.saveFile) {
        fs.writeFileSync(`${savePath}/${new Date().toString()}.json`, JSON.stringify(res, null, 2))
      }
    }
    console.log('Finalizando processo')
    inicilize()
  } catch (error) {
    console.log(error)
    inicilize(error)
  }
}
let inicilize = err => {
  err ? console.log(err) : init(5000)
}
inicilize()