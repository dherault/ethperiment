import web3 from './web3';

/* Promise wrappers for web3 methods */

export function getBalance(publicKey) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(publicKey, (err, data) => {
      return err ? reject(err) : resolve(data.toString(10));
    });
  });
}

export function getAccounts() {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
}
