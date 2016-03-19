import React from 'react';

export default class ErrorBar extends React.Component {
  
  constructor() {
    super();
    this.state = {
      message: '',
      timeout: undefined,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const lastRecord = nextProps.records[nextProps.records.length - 1];
    
    if (lastRecord.type && lastRecord.type.startsWith('FAILURE')) {
      clearTimeout(this.state.timeout);
      const { payload } = lastRecord;
      
      this.setState({
        message: payload.message || JSON.stringify(payload),
        timeout: setTimeout(() => this.setState({ message: '' }), 3000),
      });
    }
  }
  
  
  render() {
    
    const { message } = this.state;
    
    const main_s = {
      position: 'absolute',
      top: message ? 0 : -100,
      left: 0,
      zIndex: 1000,
      textAlign: 'center',
      width: '100%',
      padding: '10px 0 10px 0',
      fontSize: '1.1rem',
      color: 'white',
      background: '#F55540',
      transitionProperty: 'top',
      transitionDuration: '0.5s',
      transitionTimingFunction: 'linear',
    };
    
    return <div style={main_s}>{ message }</div>;
  }
}
