const { spawn } = require('child_process');

const mainProcess = process;

exports.runBind = () => {

  const bind = spawn('named', ['-c', '/etc/bind/named.conf', '-g', '-u', 'named']);

  bind.stdout.on('data', (data) => {
    process.stdout.write(`${data}`);
  });

  bind.stderr.on('data', (data) => {
    const initialString = data.toString();
    if (initialString != '') {
      formattedLog = initialString
        .split('\n')
        .filter((p) => {
          return (p.trim() != '')
        })
        .map((p) => `\n[bind] ${p.trim()}`).join()
      mainProcess.stdout.write(`${formattedLog}`);
    }
  });

  bind.on('close', (code) => {
    console.log(`bind child process exited with code ${code}`);
  });
}

exports.getBindStatus = () => {
  return new Promise((resolve,reject) => {
    const rndcConfig = spawn('rndc', ['status']);

    rndcConfig.stdout.on('data', (data) => {
      console.log(`status_stdout: ${data}`);
    });

    rndcConfig.stderr.on('data', (data) => {
        console.log(`status_stderr: ${data}`);
    });

    rndcConfig.on('close', (code) => {
        resolve(`rndc status child process exited with code ${code}`);
    });

    rndcConfig.on('error', (error) => {
      reject('Error running rndc status. Message: ' + error.message);
    });
  });
}

exports.configureRndc = () => {
  return new Promise((resolve,reject) => {
    const rndcConfig = spawn('rndc-confgen', ['-a']);

    rndcConfig.stdout.on('data', (data) => {
      console.log(`rndc_stdout: ${data}`);
    });

    rndcConfig.stderr.on('data', (data) => {
        console.log(`rndc_stderr: ${data}`, {  });
    });

    rndcConfig.on('close', (code) => {
        resolve(`rndc config child process exited with code ${code}`);
    });

    rndcConfig.on('error', (error) => {
      reject('Error running rndc config. Message: ' + error.message);
    });
  });
}

exports.ownConfig = () => {
  return new Promise((resolve,reject) => {
    const rndcConfig = spawn('chown', ['named', '/etc/bind/rndc.key']);

    rndcConfig.stdout.on('data', (data) => {
      console.log(`rndc_stdout: ${data}`);
    });

    rndcConfig.stderr.on('data', (data) => {
      console.log(`rndc_stderr: ${data}`);
    });

    rndcConfig.on('close', (code) => {
      resolve(`rndc config child process exited with code ${code}`);
    });

    rndcConfig.on('error', (error) => {
      reject('Error running rndc config. Message: ' + error.message);
    });
  });
}

exports.reloadBind = () => {
  const reload = spawn('rndc', ['reload']);

  reload.stdout.on('data', (data) => {
    console.log(`reload_stdout: ${data}`);
  });

  reload.stderr.on('data', (data) => {
    console.log(`reload_stderr: ${data}`);
  });

  reload.on('close', (code) => {
    console.log(`reload child process exited with code ${code}`);
  });

  reload.on('error', (error) => {
    console.log('Error running reload. Message: ' + error.message);
  })
}