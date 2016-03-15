import React from 'react';
import { readInformations } from '../actionCreators';

export default class InformationsDisplay extends React.Component {
  
  constructor() {
    super();
    this.state = {
      hovered: false,
      opened: false,
    };
  }
  
  componentDidMount() {
    this.props.dispatch(readInformations());
    this.timer = setInterval(() => this.props.dispatch(readInformations()), 3000);
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  
  handleHover() {
    this.setState({
      hovered: !this.state.hovered
    });
  }
  
  handleOpen() {
    this.setState({
      hovered: false,
      opened: !this.state.opened
    });
  }
  
  render() {
    
    const { informations } = this.props;
    const { isConnected } = informations;
    
    const handleHover = this.handleHover.bind(this);
    const handleOpen = this.handleOpen.bind(this);
    
    const status_s = {
      color: isConnected ? 'green' : 'red',
    };
    const underlined_s = {
      cursor: 'pointer',
      textDecoration: this.state.hovered ? 'underline' : 'none',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none',
    };
    
    return <div>
      <h2>RPC endpoint</h2>
      
      <div> Status: <span style={status_s}>{isConnected ? `connected` : 'disconnected'}</span> { isConnected ? `(${informations.node})` : '' }</div>
      {
        !this.state.opened ? 
          <div style={underlined_s} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={handleOpen}>
            + More informations
          </div> :
          <div>
            {
              ['isListening', 'isMining', 'peerCount', 'defaultAccount', 'coinbase', 'defaultBlock', 'blockNumber', 'hashrate', 'gasPrice'].map(key => <div key={key}>
                { `${key}: ${informations[key]}` }
              </div>)
            }
            <div style={underlined_s} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={handleOpen}>
              - Less informations
            </div>
          </div>
      }
    </div>;
  }
}
