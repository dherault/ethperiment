/* global fetch */
import web3 from '../web3';
import appConfig from '../../config.json';

export default class Account {
  
  constructor({ address, locked }) {
    
    this.address = address; // can be undefined
    this.locked = locked || true;
    
    if (address) this.hexAddress = '0x' + address;
  }
  
  create(passphrase) {
    
    const options = {
      method: 'POST',
      body: JSON.stringify({ passphrase }),
      headers: { 
        ['Content-Type']: 'application/json',
      },
    };
    return fetch(`http://localhost:${appConfig.apiPort}/createAccount`, options)
      .then(response => {
        if (response.status >= 200 && response.status < 300) return response.json();
        else throw response;
      })
      .then(({ address }) => {
        this.address = address;
        this.hexAddress = '0x' + address;
        this.locked = false;
        
        return this;
      });
  }
  
  unlock(passphrase) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ passphrase }),
      headers: { 
        ['Content-Type']: 'application/json',
      },
    };
    
  }
}