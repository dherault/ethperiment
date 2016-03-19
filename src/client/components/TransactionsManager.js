import React from 'react';
import { createTransaction } from '../state/actionCreators';

export default class TransactionsManager extends React.Component {
  
  constructor() {
    super();
    this.state = {
      value: 0,
      errorMessage: '',
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const addresses = Object.keys(this.props.accounts);
    
    if (addresses.length) return;
    
    const nextAddresses = Object.keys(nextProps.accounts);
    
    if (nextAddresses.length) this.setState({
      from: nextAddresses[0],
      to: nextAddresses[1] || nextAddresses[0],
    });
  }
  
  handleChange(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    let errorMessage = '';
    const { from, to, value } = this.state;
    
    if (value === 0) errorMessage = 'Please enter a non-null amount.';
    else if (from === to) errorMessage = 'Sender and receiver are identical.';
    else this.props.dispatch(createTransaction({ from, to, value }));
    
    this.setState({ errorMessage });
  }
  
  render() {
    
    const { accounts, transactions } = this.props;
    const { from, to, value, errorMessage } = this.state;
    const addresses = Object.keys(accounts);
    const options = addresses.map(address => <option key={address} value={address}>{ address }</option>);
    
    const error_s = {
      color: 'red',
    };
    
    return <div>
      <h2>Transactions</h2>
      <strong>New transaction</strong>
      <div style={error_s}>{ errorMessage }</div>
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div>
          <select value={from} onChange={this.handleChange.bind(this, 'from')}>
          {
            options
          }
          </select>
          {' → '}
          <select value={to} onChange={this.handleChange.bind(this, 'to')}>
          {
            options
          }
          </select>
        </div>
        <div>
          Amount (wei):&nbsp;
          <input type="number" value={value} min={0} onChange={this.handleChange.bind(this, 'value')} />
          <input type="submit" value={"Send"} />
        </div>
      </form>
      <ol>
      {
        Object.keys(transactions).map(key => <li key={key}>
          { JSON.stringify(transactions) }
        </li>)
      }
      </ol>
    </div>;
  }
}
