import React from 'react';
import { readAccounts, createAccount } from '../state/actionCreators';

export default class AccountsManager extends React.Component {
  
  constructor() {
    super();
    this.state = {
      password: '',
      revealed: false,
    };
  }
  
  componentDidMount() {
    this.props.dispatch(readAccounts());
  }
  
  handleInput(e) {
    this.setState({
      password: e.target.value
    });
  }
  
  handleRevealClick(e) {
    this.setState({
      revealed: !this.state.revealed
    });
  }
  
  handleReadAccounts(e) {
    this.props.dispatch(readAccounts());
  }
  
  handleCreateAccount(e) {
    e.preventDefault();
    this.props.dispatch(createAccount({
      password: this.state.password
    }));
  }
  
  
  render() {
    const { accounts } = this.props;
    const { revealed, password } = this.state;
    const accountsKeys = Object.keys(accounts);
    
    const table_s = {
      width: '50%',
      marginBottom: 15,
    };
    const td_s = {
      paddingTop: 3,
      paddingBottom: 3,
    };
    const tPos_s = {
      width: '2%',
    };
    const thAddress_s = {
      textAlign: 'left',
      width: '30%',
    };
    const thBalance_s = {
      textAlign: 'left',
      width: '20%',
    };
    const reveal_s = {
      cursor: 'pointer',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none',
    };
    
    return <div>
      <h2>Accounts</h2>
      { 
        accountsKeys.length ?  
          <table style={table_s}>
            <thead>
              <tr>
                <th style={tPos_s}></th>
                <th style={thAddress_s}>Address</th>
                <th style={thBalance_s}>Balance</th> 
              </tr>
            </thead>
            <tbody>
            {
              accountsKeys.map((key, pos) => {
              const { address, balance } = accounts[key];
              
              return <tr key={key}>
                <td style={td_s}>{pos + 1}</td>
                <td style={td_s}>{address}</td>
                <td style={td_s}>{balance ? `${balance} wei` : ''}</td>
              </tr>;
              })
            }
            </tbody>
          </table>
          :
          <span>No account found.</span>
      }
      
      <div>
        <button onClick={this.handleReadAccounts.bind(this)}>Retrieve accounts from remote node</button>
      </div>
      <br />
      
      <div>
        <strong>Create new account</strong>
        <div>Warning: There is no way of retrieving your password, do not forget it or you will loose your account forever.</div>
        
        <form onSubmit={this.handleCreateAccount.bind(this)}>
          <input 
            type={revealed ? 'text' : 'password'}
            value={password} 
            placeholder='Password'
            onChange={this.handleInput.bind(this)} />
          <input
            disabled={!this.state.password.length}
            type='submit'
            value='Go!' />
          <span style={reveal_s} onClick={this.handleRevealClick.bind(this)}>
            <input type='checkbox' checked={revealed} /> 
            Reveal password
          </span>
        </form>
      </div>
    </div>;
  }
}
