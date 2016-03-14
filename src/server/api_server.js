import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import hapi from 'hapi';
import boom from 'boom';
// import Web3 from 'web3';
import appConfig from '../config.json';

const port = appConfig.apiPort;
const ethereumDataDir = path.resolve(__dirname, '../../custom_blockchain');
// const web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:${appConfig.rpcPort}`));
const server = new hapi.Server();

server.connection({ port });

server.route({
  method: 'POST',
  path: '/createAccount',
  config: {
    cors: true
  },
  handler: (request, reply) => {
    console.log('createAccount');
    
    // Let's check for a password in the payload
    const { password } = request.payload;
    
    if (!password) return reply(boom.badRequest('Missing password in payload'));
    if (typeof password !== 'string') return reply(boom.badRequest('Expected password to be a string'));
    
    const response = reply.response().hold();
    const filename = path.join(__dirname, 'tmp', 'password_' + Math.random().toString(10).slice(2));
    
    // We're going to create then delete a temp file
    fs.writeFile(filename, password, 'utf8', (err) => {
      if (err) return reply500(response, err);
      
      // In order to call geth in non-interactive mode
      exec(`geth --password ${filename} --datadir ${ethereumDataDir} account new`, (err, stdout) => {
        if (err) return reply500(response, err);
        
        console.log(stdout);
        
        fs.unlink(filename, (err) => {
          if (err) return reply500(response, err);
          
          response.source = {
            address: '0x' + stdout.match(/{(.*)}/)[1],
            balance: '0',
          };
          response.send();
          
        });
      });
    });
  }
});

// if (web3.isConnected()) {
//   server.start(err => {
//     if (err) return console.log(err.stack);
//     console.log(`API listening on port ${port}.`);
//   });
// } else {
//   console.log('API error: no RPC connection.');
// }
server.start(err => {
  if (err) return console.log(err.stack);
  console.log(`API listening on port ${port}.`);
});


function reply500(response, err) {
  console.log(err.stack || err);
  response.statusCode = 500;
  response.source = 'Internal server error.',
  response.send();
}
