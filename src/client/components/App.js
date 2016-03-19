import React from 'react';
import { connect } from 'react-redux';

import ErrorBar from './ErrorBar';
import InformationsDisplay from './InformationsDisplay';
import AccountsManager from './AccountsManager';
import TransactionsManager from './TransactionsManager';

class App extends React.Component {
  
  render() {
    const { dispatch, informations, accounts, transactions, records } = this.props;
    
    const wrapper_s = {
      width: '80%',
      margin: 'auto',
    };
    
    return <div style={wrapper_s}>
      <ErrorBar records={records} />
      
      <h1>Ethperiment</h1>
      
      <InformationsDisplay dispatch={dispatch} informations={informations} />
      
      <AccountsManager dispatch={dispatch} accounts={accounts}/>
      
      <TransactionsManager dispatch={dispatch} accounts={accounts} transactions={transactions}/>
      
    </div>;
  }
}

export default connect(s => s)(App);
