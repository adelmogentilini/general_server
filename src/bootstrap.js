const { bootstrapApp } = require('./_coreboot');

function main() {
	console.log('Release di prova 3');
	setInterval(async function() {
		try {
			require('child_process').exec('git pull ', (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return;
				}
				let gitresp = stdout;
				if (gitresp.indexOf('Already up to date') > -1) {
					console.log('Controllo versione OK');
				} else {
					console.log('Aggiornamento in corso .... ');
					require('child_process').exec('npm install ', (error, stdout, stderr) => {
						if (error) {
							console.error(`exec error: ${error}`);
							return;
						}
						console.log(`${stdout}`);
						console.log('..... esco dal server pronto per il reboot');
						process.exit(1);
					});
				}
			});
		} catch (e) {
			console.error(e);
		}
	}, 15000);

	require('child_process').exec('git status ', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log("***********************************************************")
		console.log(`${stdout}`);
		console.log("***********************************************************")
		bootstrapApp();
	});
}

main();
