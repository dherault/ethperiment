import hapi from 'hapi';
import Web3 from 'web3';
import EtherSim from 'ethersim';
import appConfig from './config.json';

const port = appConfig.apiPort;
const web3 = new Web3();
const sim = new EtherSim.init();
const server = new hapi.Server();

server.connection({ port });
web3.setProvider(sim.provider);

server.route({
  method: 'GET',
  path: '/new_account',
  config: {
    cors: true
  },
  handler: (request, reply) => {
    console.log('new_account');
    const response = reply.response().hold();
    
    sim.createAccounts(1, (err, dataArray) => {
      
      if (err) return reply500(response, err);
      
      const data = dataArray[0];
      
      const newAccount = {
        secretKey: data.secretKey.toString('hex'),
        publicKey: data.publicKey.toString('hex'),
        address: data.address,
      };
      
      console.log(newAccount);
      response.source = newAccount;
      response.send();
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
