const { spawn } = require('child_process');

exports.runBind = async () => {

  const bind = spawn('named', ['-c', '/etc/bind/named.conf', '-g', '-u', 'named']);

  bind.stdout.on('data', (data) => {
      console.log(`bind_stdout: ${data}`);
  });

  bind.stderr.on('data', (data) => {
      console.log(`bind_stderr: ${data}`);
  });

  bind.on('close', (code) => {
      console.log(`bind child process exited with code ${code}`);
  });
}

exports.reloadBind = async () => {
  const reload = spawn('rdnc', ['reload']);

  reload.stdout.on('data', (data) => {
    console.log(`reload_stdout: ${data}`);
  });

  reload.stderr.on('data', (data) => {
      console.log(`reload_stderr: ${data}`);
  });

  reload.on('close', (code) => {
      console.log(`reload child process exited with code ${code}`);
  });
}