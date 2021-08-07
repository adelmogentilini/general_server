const { bootstrapApp } = require('./_coreboot');


function main() {
  // 'git pull ' per autoaggiornare il sistema, e riconoscendo sull'stdout un valore aggiornato si potrebbe far ripartire il tutto ... vedere come fare'

  // setTimeout(function () {
  //   require('child_process').exec('git pull ', (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     let gitresp = stdout
  //     console.log(`${stdout}`);
  //     console.error(`${stderr}`);
  //     if(gitresp.indexOf("Already up to date") > -1)
  //     {
  //       console.log( "Controllo versione OK")
  //     }else{
  //       console.log("Andrebbe AGGIORNATO")
  //     }
  //   }, 2000);
  // })
  return bootstrapApp();



}

main();
