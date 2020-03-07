const { spawn } = require('child_process');

const mainProcess = process;

const logFormatter = (logdata, prefix) => {
  return logdata.toString()
    .split('\n')
    .filter((p) => {
      return (p.trim() != '')
    })
    .map((p) => `\n[${prefix}] ${p.trim()}`)
    .join();
}

exports.runBind = () => {

  const bind = spawn('named', ['-c', '/etc/bind/named.conf', '-g', '-u', 'named']);

  bind.stdout.on('data', (data) => {
    mainProcess.stdout.write(logFormatter(data, 'bind'));
  });

  bind.stderr.on('data', (data) => {
    mainProcess.stdout.write(logFormatter(data, 'bind'));
  });

  bind.on('close', (code) => {
    console.log(`bind child process exited with code ${code}`);
  });
}

exports.getBindStatus = () => {
  return new Promise((resolve,reject) => {
    const rndcConfig = spawn('rndc', ['status']);

    rndcConfig.stdout.on('data', (data) => {
      mainProcess.stdout.write(logFormatter(data, 'rndc status'));
    });

    rndcConfig.stderr.on('data', (data) => {
      mainProcess.stdout.write(logFormatter(data, 'rndc status'));
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
      mainProcess.stdout.write(logFormatter(data, 'rndc-confgen'));
    });

    rndcConfig.stderr.on('data', (data) => {
      mainProcess.stdout.write(logFormatter(data, 'rndc-confgen'));
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
      mainProcess.stdout.write(logFormatter(data, 'chown'));
    });

    rndcConfig.stderr.on('data', (data) => {
      mainProcess.stdout.write(logFormatter(data, 'chown'));
    });

    rndcConfig.on('close', (code) => {
      resolve(`chown child process exited with code ${code}`);
    });

    rndcConfig.on('error', (error) => {
      reject('Error running chown. Message: ' + error.message);
    });
  });
}

exports.reloadBind = () => {
  const reload = spawn('rndc', ['reload']);

  reload.stdout.on('data', (data) => {
    mainProcess.stdout.write(logFormatter(data, 'rndc reload'));
  });

  reload.stderr.on('data', (data) => {
    mainProcess.stdout.write(logFormatter(data, 'rndc reload'));
  });

  reload.on('close', (code) => {
    console.log(`reload child process exited with code ${code}`);
  });

  reload.on('error', (error) => {
    console.log('Error running reload. Message: ' + error.message);
  })
}