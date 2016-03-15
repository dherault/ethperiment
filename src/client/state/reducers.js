const informationsInitialState = {
  isConnected: false,
  nodeName: '',
  isMining: false,
};

export default {
  accounts: (state={}, action) => {
    
    console.log('.R.', action.type, action.payload);
    
    switch (action.type) {
      case 'SUCCESS_READ_ACCOUNTS': {
        const newState = {};
        action.payload.forEach(address => newState[address] = { address, balance: '' });
        return newState;
      }
      
      case 'SUCCESS_READ_BALANCE': {
        const newState = Object.assign({}, state);
        newState[action.params.address].balance = action.payload;
        return newState;
      }
      
      case 'SUCCESS_CREATE_ACCOUNT':{
        const newState = Object.assign({}, state);
        newState[action.payload.address] = action.payload;
        return newState;
      }
      
      default:
        return state;
    }
  },
  
  informations: (state=informationsInitialState, action) => {
    
    switch (action.type) {
      case 'SUCCESS_READ_INFORMATIONS':
        return Object.assign({}, action.payload);
      
      default:
        return state;
    }
  },
  
  records: (state=[], action) => [...state, Object.assign({ date: new Date().getTime() }, action)]
};
