import Web3 from 'web3'; 
import appConfig from '../config.json';

export default new Web3(new Web3.providers.HttpProvider(`http://localhost:${appConfig.rpcPort}`));
