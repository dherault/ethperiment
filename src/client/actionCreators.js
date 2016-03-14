/* global fetch */
import isPlainObject from 'lodash.isplainobject';
import appConfig from '../config.json';
import web3 from './web3';

/* Sync actionCreator */

/* Async actionCreators */
export const readAccounts = () => ({
  types: createTypes('readAccounts'),
  promise: new Promise((resolve, reject) => web3.eth.getAccounts((err, result) => err ? reject(err) : resolve(result)))
});

export const readBalance = ({ address }) => ({
  params: { address },
  types: createTypes('readBalance'),
  promise: new Promise((resolve, reject) => web3.eth.getBalance(address, (err, result) => err ? reject(err) : resolve(result.toString(10))))
});

export const createAccount = createActionCreator('createAccount');

export const readInformations = () => !web3.isConnected() ? {
    type: 'SUCCESS_READ_INFORMATIONS',
    payload: {
      isConnected: false,
    }
  } : {
    types: createTypes('readInformations'),
    promise: Promise.all([
      new Promise((a, b) => web3.version.getNode((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.net.getListening((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.net.getPeerCount((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.eth.getMining((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.eth.getCoinbase((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.eth.getHashrate((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.eth.getGasPrice((e, x) => e ? b(e) : a(x))),
      new Promise((a, b) => web3.eth.getBlockNumber((e, x) => e ? b(e) : a(x))),
    ]).then(([node, isListening, peerCount, isMining, coinbase, hashrate, gasPrice, blockNumber]) => ({
      node, isListening, peerCount, isMining, coinbase, hashrate, blockNumber,
      gasPrice: gasPrice.toString(10),
      isConnected: true,
      defaultAccount: web3.eth.defaultAccount,
      defaultBlock: web3.eth.defaultBlock
    }))
};
// Creates async actionCreators that call the API
function createActionCreator(intention) {
  
  return (params) => {
    
    if (params && !isPlainObject(params)) throw new Error(`actionCreator ${intention}: params should be a plain object.`);
    
    console.log('.A.', intention, params);
    
    return {
      intention,
      params,
      types: createTypes(intention),
      promise: fetch(`http://localhost:${appConfig.apiPort}/${intention}`, { 
        method: 'POST', // This project only uses POST method
        body: JSON.stringify(params),
        headers: {
          ['Content-Type']: 'application/json',
        },
      }).then(checkStatus).then(r => r.json())
    };
  };
}

function createTypes(intention) {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].map(t => `${t}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase());
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw response;
  }
}