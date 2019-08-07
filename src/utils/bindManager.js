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
      console.log(`child process exited with code ${code}`);
  });
}

exports.reloadBind = async () => {
  
}