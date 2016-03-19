const informationsInitialState = {
  isConnected: false,
  nodeName: '',
  isMining: false,
};

export default {
  informations: (state=informationsInitialState, action) => {
    
    switch (action.type) {
      case 'SUCCESS_READ_INFORMATIONS':
        return Object.assign({}, action.payload);
      
      default:
        return state;
    }
  },
  
  accounts: (state={}, action) => {
    
    switch (action.type) {
      case 'SUCCESS_READ_ACCOUNTS': {
        const newState = {};
        action.payload.forEach(hexAddress => {
          const address = hexAddress.substring(2);
          newState[address] = { address, balance: '' };
        });
        return newState;
      }
      
      case 'SUCCESS_READ_BALANCE': {
        const newState = Object.assign({}, state);
        newState[action.params.hexAddress.substring(2)].balance = action.payload;
        return newState;
      }
      
      case 'SUCCESS_CREATE_ACCOUNT':{
        const newState = Object.assign({}, state);
        const { address } = action.payload;
        newState[address] = { address, balance: '' };
        return newState;
      }
      
      default:
        return state;
    }
  },
  
  transactions: (state={}, action) => {
    
    return state;
  },
  
  records: (state=[], action) => [...state, Object.assign({ time: new Date().getTime() }, action)]
};
