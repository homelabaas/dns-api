const express = require('express');
const { spawn } = require('child_process');

const app = express();
const router = express.Router();
const port = process.env.port || 80;

router.use(function (req,res,next) {
    console.log('/' + req.method);
    next();
});
  
router.get('/', function(req,res){
    res.json({ success: true });
    res.statusCode = 200;
});

app.use('/', router);

app.listen(port, function () {
    console.log('Listening on port ' + port.toString());

    const bind = spawn('named', ['-c', '/etc/bind/named.conf', '-g', '-u', 'named']);

    bind.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    bind.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    bind.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});