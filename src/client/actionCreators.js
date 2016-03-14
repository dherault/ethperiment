/* global fetch */
import isPlainObject from 'lodash.isplainobject';
import appConfig from '../config.json';

const apiUrl = `http://localhost:${appConfig.apiPort}`;

export const readAccount = createActionCreator('readAccount');

// Creates async actionCreators
function createActionCreator(intention, method) {
  
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(t => `${t}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase());
  
  return (params) => {
    
    if (params && !isPlainObject(params)) throw new Error(`actionCreator ${intention}: params should be a plain object.`);
    
    console.log('.A.', intention, params);
    
    return {
      intention,
      types,
      params,
      promise: fetch(`${apiUrl}/${intention}`, { 
        method: 'POST', // This project only uses POST method
        body: JSON.stringify(params),
        headers: {
          ['Content-Type']: 'application/json',
        },
      })
    };
  };
}