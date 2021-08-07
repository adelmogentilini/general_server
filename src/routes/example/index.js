'use strict'

const startDate =new Date().toISOString().
replace(/T/, ' ').      // replace T with a space
replace(/\..+/, '')     // delete the dot and everything after
module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'this is an example started at: '+startDate
  })
}
