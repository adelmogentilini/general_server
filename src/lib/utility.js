'use strict'
const dateformat = require('dateformat')
const fs = require('fs')

function getFormatDate (data) {
  return dateformat(data, 'dd/mm/yyyy')
}

function getFormatDatetime (data) {
  return dateformat(data, 'UTC:dd/mm/yyyy HH:MM:ss')
}

function getDateAsISO (data) {
  /**
   const cetOffsetInMilliseconds = 60 * 1000 * 60;
   const dt = new Date(data - cetOffsetInMilliseconds)
   return dateformat(dt, "yyyy-mm-dd'T'HH:MM'Z'") */

  return dateformat(data, 'UTC:yyyy-mm-dd\'T\'HH:MM\'Z\'')
}

function isEmptyObject (obj) {
  if (typeof obj === 'undefined') {
    // lo consideriamo vuoto
    return true
  }
  // There is no key in Object probably is {}
  if (obj) {
    return !Object.keys(obj).length
  } else {
    return true
  }
}

function prettyPrintJSON (json) {
  const object = JSON.parse(json)
  console.dir(object, { depth: null, colors: true })
}

/**
 * Ritorna un oggetto identico al parametro, con le keys in "minuscolo".
 * lascia intatto l'oggetto passato in obj, il risultato è restituito nella return.
 *
 * @param {*} obj
 */
function normalizzaNames (obj) {
  if (obj === null) {
    return null
  }
  if (obj === undefined) {
    return {}
  }
  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    // il parametro è array: normalizzo i singoli elementi
    const result = []
    for(let i =0; i<obj.length; i++){
      const el = obj[i]
      const norm = normalizzaNames(el)
      result.push(norm)
    }
    return result
  }

  let norm = {}
  if (Object.keys(obj).length === 0) {
    norm = obj
  } else {
    for(let i=0; i< Object.keys(obj).length; i++ ){
      const el =  Object.keys(obj)[i]
      if (el.toLowerCase() === 'ts') {
        // escludiamo il campo di nome ts (su arca sono Timestamp)
      } else {
        if (Array.isArray(obj[el])) {
          const temp = []
          for(let j=0; j<obj[el].length; j++){
            const elarr = obj[el][j]
            temp.push(normalizzaNames(elarr))
          }
          norm[el.toLowerCase()] = temp
        } else if (typeof obj[el] === 'object') {
          norm[el.toLowerCase()] = normalizzaNames(obj[el])
        } else {
          norm[el.toLowerCase()] = obj[el]
        }
      }
    }
  }

  return norm
}

function isValidDate (d) {
  return d instanceof Date && !isNaN(d)
}

/**
 * estrae dall'header http i parametri generici, come ad esempio quelli inseriti dall'autenticazione
 * @param headers
 * @returns {Promise<{requestheaders: {username: *}}>}
 */
async function extractOptionsFromHeaders (headers) {
  const ret = {
    auth: headers.auth
  }
  return ret
}

/**
 * Aggiunge una clausola all'oggetto params.condizioni
 *
 * @param params
 * @param codice
 * @returns {*}
 */
function paramsCondizioniAddClausola (params, nome, valore) {

  // aggiungo la condizione per la chiave
  if (!params || typeof params !== 'object') {
    // param NON è definito o non è un object
    params = {
      condizioni: {}
    }
    params.condizioni[nome] = valore
  } else if (!params.condizioni) {
    // param.condizioni NON è definito
    params.condizioni = {}
    params.condizioni[nome] = valore
  } else if (Array.isArray(params.condizioni)) {
    // param.condizioni è definito ed è un ARRAY
    if (params.condizioni.length > 0) {
      // un array pieno
      for (let i = 0; i < params.condizioni.length; i++) {
        params.condizioni[i][nome] = valore
      }
    } else {
      // un array vuoto
      params.condizioni = [{}]
      params.condizioni[0][nome] = valore
    }
  } else {
    // condizioni è definito e NON è un array
    params.condizioni[nome] = valore
  }

  return params
}

/**
 * Dato un JSON  la chiave del valore cercato nella forma K1.K2 con
 * K1 che è gerarchicamente il padre di K2, analizza il JSON e torna
 * il valore cercato.
 * Se ci sono dei + concatena i campi specificati
 * @param {*} json
 * @param {*} stringkey
 */
function getJsonValue (json, stringkey, separator) {
  const partJson = stringkey.split('+')
  let valtot = ''
  for (let part = 0; part < partJson.length; part++) {
    const keyArray = partJson[part].trim().split('.')
    let valore = json
    for (let i = 0; i < keyArray.length; i++) {
      if (valore != undefined) {
        valore = valore[keyArray[i]]
      } else {
        valore = ''
      }
    }
    valtot = valtot + separator + valore
  }

  return valtot.trim()
}

function lpad (str, padString, length) {
  while (str.length < length)
    str = padString + str
  return str
}

/**
 * dato un oggetto in input torna un array piatto con tutti le chiavi degli oggetti che ne
 * fanno parte espresse in maniera con dot-notation.
 *
 * @param obj
 * @returns {FlatArray<unknown[], number>[]}
 */
function arrayFlatOfFields (obj) {
  return arrayOfFields(obj, '').flat(10)
}

function arrayOfFields (testObj, pre) {
  return Object.keys(testObj).map((k) => {
    if (isObject(testObj[k])) {
      return arrayOfFields(testObj[k], k + '.')
    } else {
      return (pre + k)
    }
  })
}

/**
 * Mi dice se il parametro è un oggetto o un tipo predefinito.
 *
 * @param a
 * @returns {boolean}
 */
function isObject (a) {
  return (a != null && typeof (a) === 'object')
}

function extractSingleKey (obj, key, target) {
  if (obj[key]) {
    if ((typeof obj[key]) === 'string') {
      if (key == target) {
        return obj[key]
      } else {
        return ''
      }
    } else {
      return '(' + extractListOfKey(obj[key], target) + ')'
    }
  } else {return ''}
}


function decodeBase64 (data) {
  if (data === undefined) {
    return null
  }
  const buff = Buffer.from(data, 'base64')
  return buff.toString('ascii')
}

function isBase64(str){
  return (Buffer.from(str, 'base64').toString('base64') === str)
}

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}



/**
 * Data una stringa un formato e il carattere separatore trasforma la
 * stringa in un DATE.
 *
 * @param _date
 * @param _format
 * @param _delimiter
 * @returns {Date}
 */
function stringToDate(_date,_format,_delimiter)
{
  let formatLowerCase=_format.toLowerCase();
  let formatItems=formatLowerCase.split(_delimiter);
  let dateItems=_date.split(_delimiter);
  let monthIndex=formatItems.indexOf("mm");
  let dayIndex=formatItems.indexOf("dd");
  let yearIndex=formatItems.indexOf("yyyy");
  let month=parseInt(dateItems[monthIndex]);
  month-=1;
  let formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
  return formatedDate;
}


/**
 * Lettura del file CSV passato come parametro.
 * Utilizza il separatore che di default vale ; e le
 * funzioni di lettura file SINCRONE.
 *
 * @param {*} filename
 * @returns
 */
function readCsv (filename, separatore = ';') {
  const csv = []
  const fileread = fs.readFileSync(filename)
  const rows = Buffer.from(fileread).toString().split('\n')
  const testa = rows[0].split(separatore)
  for (let i = 1; i < rows.length; i++) {
    const riga = rows[i].split(separatore)
    if (riga.length == testa.length) {
      csv.push(rows[i].split(separatore))
    }
  }
  return csv
}

module.exports.isBase64 = isBase64

module.exports.readCsv = readCsv
module.exports.stringToDate = stringToDate
module.exports.sleep = sleep
module.exports.decodeBase64 = decodeBase64
module.exports.arrayFlatOfFields = arrayFlatOfFields
module.exports.isObject = isObject
module.exports.arrayOfFields = arrayOfFields

module.exports.lpad = lpad
module.exports.getJsonValue = getJsonValue
module.exports.isEmptyObject = isEmptyObject
module.exports.prettyPrintJSON = prettyPrintJSON
module.exports.normalizzaNames = normalizzaNames

module.exports.getFormatDatetime = getFormatDatetime
module.exports.getFormatDate = getFormatDate
module.exports.getDateAsISO = getDateAsISO

module.exports.paramsCondizioniAddClausola = paramsCondizioniAddClausola
module.exports.isValidDate = isValidDate
module.exports.extractOptionsFromHeaders = extractOptionsFromHeaders
