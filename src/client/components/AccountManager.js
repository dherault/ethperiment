import React from 'react';
import { readAccounts, createAccount, readKeyfile } from '../state/actionCreators';

export default class AccountManager extends React.Component {
  
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
  
  handleInput(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }
  
  handleRevealClick(e) {
    this.setState({
      revealed: !this.state.revealed
    });
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
    const { accounts, dispatch } = this.props;
    const { revealed, password } = this.state;
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
                <th style={thAddress_s}>Address (hex)</th>
                <th style={thBalance_s}>Balance</th> 
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              accountsKeys.map((key, pos) => <AccountRow key={pos} dispatch={dispatch} account={accounts[key]} pos={pos} />)
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
            onChange={this.handleInput.bind(this, 'password')} />
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
  
  handleClick() {
    // this.props.dispatch(readKeyfile({
    //   address: this.props.account.address
    // }));
    const xhr = new XMLHttpRequest();
    
    xhr.onError = err => console.log(err);
    xhr.open('GET', 'http://localhost:3001/readKeyfile?address=' + this.props.account.address, true);
    xhr.send();
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
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none',
    };
    
    return <tr>
      <td style={td_s}>{pos + 1}</td>
      <td style={td_s}>{address}</td>
      <td style={td_s}>{balance ? `${balance} wei` : ''}</td>
      <td style={td_s}><span style={getKeystore_s} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={this.handleClick.bind(this)}>Get keystore file</span></td>
    </tr>;
  }
}
