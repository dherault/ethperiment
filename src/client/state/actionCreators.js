/* global fetch */
import isPlainObject from 'lodash.isplainobject';
import appConfig from '../../config.json';
import web3 from '../web3';

/* Sync actionCreator */

/* Async actionCreators */
export const readAccounts = () => ({
  types: createTypes('readAccounts'),
  promise: promisify(web3.eth.getAccounts),
});

export const readBalance = ({ address }) => ({
  params: { address },
  types: createTypes('readBalance'),
  promise: promisify(web3.eth.getBalance, address).then(x => x.toString(10)), // Big number stringification
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
      promisify(web3.version.getNode),
      promisify(web3.net.getListening),
      promisify(web3.net.getPeerCount),
      promisify(web3.eth.getMining),
      promisify(web3.eth.getCoinbase),
      promisify(web3.eth.getHashrate),
      promisify(web3.eth.getGasPrice),
      promisify(web3.eth.getBlockNumber),
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
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) return response.json();
        else throw response;
      })
    };
  };
}

function createTypes(intention) {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].map(t => `${t}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase());
}

function promisify(fun, ...args) {
  return new Promise((resolve, reject) => fun(...args, (err, result) => err ? reject(err) : resolve(result)));
}