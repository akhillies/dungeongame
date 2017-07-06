import React, { Component } from 'react'
import './App.css'

import Flexbox from 'flexbox-react'

import { mapStateToProps } from './State/StateMethods'
import { connect } from 'react-redux'
import { Manager } from 'socket.io-client'

import Private from './Components/Private'
import Public from './Components/Public'

import { _ } from 'underscore'

class App extends Component {

  constructor(props){
    super(props)
    this.state = Object.assign({}, this.propsConst(props), {
      socketManager: new Manager(process.env.REACT_APP_DUNGEONGAME_URL, {'autoConnect': true} )
    })
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      isFetching: props.serverActions.isFetching, 
      errorMessage: props.serverActions.errorMessage,
      username: props.serverActions.username,
      password: props.serverActions.password,
      id: props.serverActions.id,
      connectedRoom: props.serverActions.connectedRoom,
      managingSocket: (this.state && this.state.managingSocket) ? this.state.managingSocket : props.serverActions.managingSocket,
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  render() {
    return (
      <Flexbox flexDirection='column'>
        { _.isString(this.state.id) ?
          <Private props={ this.props } dispatch={ this.state.dispatch } errorMessage={ this.state.errorMessage } isFetching={ this.state.isFetching } 
          socketManager={ this.state.socketManager } managingSocket={ this.state.managingSocket } connectedRoom={ this.state.connectedRoom } username={ this.state.username } />
          :
          <Public dispatch={ this.state.dispatch } isFetching={ this.state.isFetching } errorMessage={ this.state.errorMessage } />
        }
      </Flexbox>
    );
  }
}

export default connect(mapStateToProps)(App);
