import React from 'react';

export default class AccountManager extends React.Component {
  
  constructor() {
    super();
    this.state = {
      create_password: '',
      retrieve_address: 'bcddf4e10154518dfa25488efd295a3d192e0601',
      retrieve_password: 'password',
    };
  }
  
  handleInput(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }
  
  handleCreateAccount(e) {
    e.preventDefault();
    console.log('handleCreateAccount');
  }
  handleRetrieveAccount(e) {
    e.preventDefault();
    console.log('handleRetrieveAccount');
  }
  
  render() {
    
    const { address, keystore, balance } = this.props.account;
    
    const accountInfo = address && keystore ?
      <div>
        <div><strong>Address:</strong>{ address }</div>
        <div><strong>Keystore:</strong>{ keystore }</div>
        <div><strong>Balance:</strong>{ balance }</div>
      </div>
      : 'No account found.';
    
    return <div>
      <h2>Account</h2>
      { accountInfo }
      
      <div>
        <h4>Retrieve existing account</h4>
        <form onSubmit={this.handleRetrieveAccount.bind(this)}>
          <div>
            Address:
            <input 
              type='text'
              value={this.state.retrieve_address} 
              placeholder='Address'
              onChange={this.handleInput.bind(this, 'retrieve_address')} />
          </div>
          <div>
            Password:
            <input 
              type='password'
              value={this.state.retrieve_password} 
              placeholder='Password'
              onChange={this.handleInput.bind(this, 'retrieve_password')} />
          </div>
          <input
            type='submit'
            value='Go!' />
        </form>
      </div>
      
      <div>
        <h4>Create new account</h4>
        <div>Warning: There is no way of retrieving your password, do not forget it or you will loose your account forever.</div>
        <form onSubmit={this.handleCreateAccount.bind(this)}>
          <input 
            type='password'
            value={this.state.create_password} 
            placeholder='Password'
            onChange={this.handleInput.bind(this, 'create_password')} />
          <input
            type='submit'
            value='Go!' />
          </form>
      </div>
    </div>;
  }
}
