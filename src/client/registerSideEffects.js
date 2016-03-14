import { readBalance } from './actionCreators'

export default function registerSideEffect({ subscribe, dispatch, getState}) {
  
  const sideEffects = {
    SUCCESS_READ_ACCOUNTS: (action) => {
      action.payload.forEach(address => {
        dispatch(readBalance({ address }));
      });
    },
  };
  
  const seKeys = Object.keys(sideEffects);
  console.log('.E.', `Registering ${seKeys.length} side-effects: ${seKeys}`);
  
  subscribe(() => {
    const state = getState();
    const lastAction = state.records[state.records.length - 1];
    const lastActionType = lastAction.type;
    
    if (seKeys.includes(lastActionType)) {
      console.log('.E.', `Found side effect for ${lastActionType}`);
      sideEffects[lastActionType](lastAction, state);
    }
  });
}