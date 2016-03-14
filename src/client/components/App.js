import React from 'react';
import { connect } from 'react-redux';

import AccountManager from './AccountManager';

class App extends React.Component {
  
  render() {
    const { account} = this.props;
    
    const wrapper_s = {
      width: '80%',
      margin: 'auto',
    };
    
    return <div style={wrapper_s}>
      <h1>Ethperiment</h1>
      
      <AccountManager account={account}/>
      <hr/>
      
    </div>;
  }
}

export default connect(s => s)(App);
