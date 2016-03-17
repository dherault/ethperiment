import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import hapi from 'hapi';
import boom from 'boom';
import inert from 'inert';

import appConfig from '../config.json';

const port = appConfig.apiPort;
const ethereumDataDir = path.resolve(__dirname, '../../custom_blockchain');
const server = new hapi.Server();

server.connection({ port });
server.register(inert, () => {}); // adds .file() method to hapijs's reply object

const config = { cors: true }; // Welcome to the party
const keystoreDir = path.resolve(__dirname, '../../custom_blockchain/keystore');

/* ACCOUNT CREATION */
server.route({
  config,
  method: 'POST',
  path: '/createAccount',
  handler: (request, reply) => {
    console.log('createAccount');
    
    // Let's check for a password in the payload
    if (!request.payload) return reply(boom.badRequest('Missing payload'));
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

/* KEYFILE RETRIEVAL */
// server.route({
//   config,
//   method: 'GET',
//   path: '/readKeyfile',
//   handler: (request, reply) => {
//     console.log('readKeyfile');
    
//     // Let's check for an address in the payload
//     if (!request.query) return reply(boom.badRequest('Missing query'));
//     const { address } = request.query;
//     if (!address) return reply(boom.badRequest('Missing address in query'));
//     if (typeof address !== 'string') return reply(boom.badRequest('Expected address to be a string'));
    
//     const nonHexAddress = address.startsWith('0x') ? address.substring(2) : address;
    
//     // Sync... because we can't call reply.file if we invoke reply.reponse.hold() to do async stuff
//     // Can't call reply twice...
//     const filename = fs.readdirSync(keystoreDir).find(name => name.endsWith(nonHexAddress));
//     if (!filename) {
//       console.log('Keyfile not found:', nonHexAddress);
//       return reply(boom.notFound());
//     }
    
//     console.log('Found keyfile:', filename);
//     reply.response.header('Content-Type', 'application/x-download');
//     // reply.file(`${keystoreDir}/${filename}`, {
//     reply.file(`${__dirname}/api_server.js`, {
//       mode: 'attachment' // includes the 'Content-Disposition' header with the response
//     });
//   }
// });
server.route({
  config,
  method: 'GET',
  path: '/readKeyfile',
  handler: (request, reply) => {
    console.log('readKeyfile');
    
    // Let's check for an address in the payload
    if (!request.query) return reply(boom.badRequest('Missing query'));
    const { address } = request.query;
    if (!address) return reply(boom.badRequest('Missing address in query'));
    if (typeof address !== 'string') return reply(boom.badRequest('Expected address to be a string'));
    
    const response = reply.response().hold();
    
    fs.readdir(keystoreDir, (err, files) => {
      if (err) return reply500(response, err);
      
      const nonHexAddress = address.startsWith('0x') ? address.substring(2) : address;
      const filename = files.find(name => name.endsWith(nonHexAddress));
      
      if (!filename) {
        console.log('Keyfile not found:', nonHexAddress);
        response.statusCode = 404;
        response.source = 'Not found.';
        return response.send();
      }
      
      console.log('Found keyfile:', filename);
      
      fs.readFile(`${keystoreDir}/${filename}`, (err, data) => {
        if (err) return reply500(response, err);
        
        response.source = data;
        response.header('Content-Type', 'application/x-download');
        response.header('Content-Disposition', `attachment filename="${filename}"`);
        // response.charset('utf-8');
        response.send();
      });
    });
  }
});

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
