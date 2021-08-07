'use strict'


module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/exit', async function (request, reply) {
    setTimeout(function () {
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
    }, 1000);
    return {message: "restart"}

  })
}
