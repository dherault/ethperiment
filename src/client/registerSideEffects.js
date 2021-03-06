import { readAccounts, readBalance } from './state/actionCreators';

export default function registerSideEffect({ subscribe, dispatch, getState }) {
  
  const internals = {};
  
  const sideEffects = {
    
    // For each retrieved account, read its balance
    SUCCESS_READ_ACCOUNTS: ({ payload }) => payload.forEach(hexAddress => dispatch(readBalance({ hexAddress }))),
    
    // Allows refreshing after reconnection
    SUCCESS_READ_INFORMATIONS: ({ payload: { isConnected }}) => {
      if (internals.isConnected === false && isConnected) dispatch(readAccounts());
      
      internals.isConnected = isConnected;
    }
  };
  
  const seKeys = Object.keys(sideEffects);
  console.log('.E.', `Registering ${seKeys.length} side-effects: ${seKeys}`);
  
  subscribe(() => {
    const state = getState();
    const lastAction = state.records[state.records.length - 1];
    const lastActionType = lastAction.type;
    
    if (seKeys.indexOf(lastActionType) !== -1) {
      console.log('.E.', `Found side effect for ${lastActionType}`);
      sideEffects[lastActionType](lastAction, state);
    }
  });
}
