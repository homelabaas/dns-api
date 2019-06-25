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

app.listen(port, async () => {
    console.log('Listening on port ' + port.toString());

    const testContent = {
        dns1: '192.168.0.1',
        dns2: '192.168.0.2',
        zones: [
            {
                name: 'test.com',
                filename: 'db.test.com',
                records: [
                    {
                        fqdn: 'test.test.com',
                        type: 'A',
                        address: '192.168.0.1'
                    }
                ]
            }
        ]
    }

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