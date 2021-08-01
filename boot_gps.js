/**
 * Metodo costruito manualmente per la configurazione del sistema usando comunque Autoload.
 */
const Fastify = require('fastify')

const path = require('path')
const AutoLoad = require('fastify-autoload')

const fastify = Fastify({
  logger: true
})

async function bootstrapApp () {
  
  try {
    fastify.log.info('START AUTOLOAD PLUGINS')
    fastify.register(AutoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: Object.assign({}, process.argv)
    })

    fastify.log.info('START AUTOLOAD ROUTES')
    fastify.register(AutoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: Object.assign({}, process.argv)
    })

    fastify.listen(1000, '0.0.0.0').then(() => {
      fastify.log.info(`Server General Purpose Server'
                attivo su porta ${fastify.server.address().port}
                `)
    })
  } catch (error) {
    console.log(`ERRORE ${error}`)
    fastify.log.error(error)
    process.exit(1)
  }
}

bootstrapApp()
