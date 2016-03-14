import React from 'react';
import { readAccounts, createAccount } from '../actionCreators';

export default class AccountManager extends React.Component {
  
  constructor() {
    super();
    this.state = {
      password: '',
    };
  }
  
  handleInput(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }
  
  componentDidMount() {
    this.props.dispatch(readAccounts());
  }
  
  handleReadAccounts(e) {
    console.log('handleRetrieveAccount');
    this.props.dispatch(readAccounts());
  }
  
  handleCreateAccount(e) {
    e.preventDefault();
    console.log('handleCreateAccount');
    this.props.dispatch(createAccount({
      password: this.state.password
    }));
  }
  
  render() {
    
    const { accounts } = this.props;
    const accountsKeys = Object.keys(accounts);
    
    const table_s = {
      width: '100%',
      marginBottom: 15,
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
    
    return <div>
      <h2>Accounts</h2>
      { 
        accountsKeys.length ?  
          <table style={table_s}>
            <thead>
              <tr>
                <th style={tPos_s}></th>
                <th style={thAddress_s}>Address (hex)</th>
                <th style={thBalance_s}>Balance</th> 
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              accountsKeys.map((key, pos) => <AccountRow key={pos} account={accounts[key]} pos={pos} />)
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
            type='password'
            value={this.state.password} 
            placeholder='Password'
            onChange={this.handleInput.bind(this, 'password')} />
          <input
            disabled={!this.state.password.length}
            type='submit'
            value='Go!' />
          </form>
      </div>
    </div>;
  }
}

class AccountRow extends React.Component {
  
  constructor() {
    super();
    this.state = {
      hovered: false,
    };
  }
  
  handleHover() {
    this.setState({
      hovered: !this.state.hovered
    });
  } 
  
  render() {
    
    const { pos, account: { address, balance } } = this.props;
    const handleHover = this.handleHover.bind(this);
    
    const td_s = {
      paddingTop: 3,
      paddingBottom: 3,
    };
    const getKeystore_s = {
      cursor: 'pointer',
      textDecoration: this.state.hovered ? 'underline' : 'none',
    };
    
    return <tr>
      <td style={td_s}>{pos + 1}</td>
      <td style={td_s}>{address}</td>
      <td style={td_s}>{balance ? `${balance} wei` : ''}</td>
      <td style={td_s}><span style={getKeystore_s} onMouseEnter={handleHover} onMouseLeave={handleHover}>Get keystore file</span></td>
    </tr>;
  }
}
