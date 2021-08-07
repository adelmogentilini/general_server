'use strict'


module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { versione : '1.0' }
  })

  fastify.get('/exit', async function (request, reply) {
    setInterval(function () {
      // When NodeJS exits
      process.on("exit", function () {

        const subprocess = require("child_process").spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached : true,
          stdio: "inherit"
        });
        subprocess.unref()
      });

      process.exit();
    }, 3000);
    return {message: "restart"}

  })
}

