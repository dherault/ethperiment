import React from 'react';
import { connect } from 'react-redux';

import AccountManager from './AccountManager';
import InformationsDisplay from './InformationsDisplay';

class App extends React.Component {
  
  render() {
    const { dispatch, accounts, informations } = this.props;
    
    const wrapper_s = {
      width: '80%',
      margin: 'auto',
    };
    
    return <div style={wrapper_s}>
      <h1>Ethperiment</h1>
      
      <InformationsDisplay dispatch={dispatch} informations={informations} />
      
      <AccountManager dispatch={dispatch} accounts={accounts}/>
      
    </div>;
  }
}

export default connect(s => s)(App);
