import hapi from 'hapi';
import Web3 from 'web3';
import appConfig from '../config.json';

const port = appConfig.apiPort;
const web3 = new Web3();
const server = new hapi.Server();

server.connection({ port });
// web3.setProvider(sim.provider);

server.route({
  method: 'GET',
  path: '/readAccount',
  config: {
    cors: true
  },
  handler: (request, reply) => {
    console.log('retrieve_account');
    const response = reply.response().hold();
    
    response.send({
      address: 'test',
      keystore: 'test',
      balance: 0,
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
  response.send();
}
