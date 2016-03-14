/* global fetch */
import web3 from './web3'; 
import appConfig from '../config.json';
import {
  getAccounts,
  getBalance,
} from './web3Wrappers';

const apiUrl = `http://localhost:${appConfig.apiPort}`;
const defaultAccount = web3.eth.defaultAccount;
console.log('Hello client!', web3.isConnected() ? 'Connected': 'No connection');
console.log(defaultAccount ? `defaultAccount: ${defaultAccount}` : 'No default account found');

// fetch()
