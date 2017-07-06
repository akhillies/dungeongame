import React, { Component } from 'react'
import Flexbox from 'flexbox-react'

import { disconnectFromRoom } from '../State/ServerActions'

import RaisedButton from 'material-ui/RaisedButton'

import { curry } from 'ramda'
import { _ } from 'underscore'

import { Unity, Message } from 'react-unity-webgl'

class Public extends Component {

  constructor(props){
    super(props)
    this.state = Object.assign({}, this.propsConst(props), {
      loginDetails: {},
    })
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      socketManager: props.socketManager,
      managingSocket: this.state ? this.state.managingSocket : props.managingSocket,
      username: props.username,
      connectedRoom: props.connectedRoom,
    })
  }

  componentWillMount(){
    if(!_.isObject(this.state.managingSocket)){
      const newSocket = this.state.socketManager.socket('/' + this.state.connectedRoom.roomname)
      newSocket.open()
      this.setState({ managingSocket: newSocket })
    } else {
      this.state.managingSocket.open()
    }
  }

  componentDidMount(){
    this.state.managingSocket.emit('identify', this.state.username)
    this.handleAllSocketEmits()
  }

  handleAllSocketEmits = () => {
    this.state.managingSocket.on('Move', function(movement) {
      console.log(movement)
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  handleDisconnect = () => {
    this.state.dispatch(disconnectFromRoom())
  }

  componentWillUnmount(){
    this.state.managingSocket.disconnect()
  }

  handleTouch = (direction, event) => {
    this.state.managingSocket.emit(direction, 1)
  }

  curryHandleTouch = curry(this.handleTouch)

  render() {
    return (
      <Flexbox flexDirection='column'>
        <Flexbox justifyContent='flex-end' style={ { marginTop: '10px', marginRight: '10px' } }>
          <RaisedButton label='Disconnect' onTouchTap={ this.handleDisconnect } />
        </Flexbox>
        <Flexbox flexDirection='column' alignItems='flex-start' flexBasis='content'>
          <RaisedButton label='Up' onTouchTap={ this.curryHandleTouch('Up') } />
          <RaisedButton label='Down' onTouchTap={ this.curryHandleTouch('Down') } />
          <RaisedButton label='Left' onTouchTap={ this.curryHandleTouch('Left') } />
          <RaisedButton label='Right' onTouchTap={ this.curryHandleTouch('Right') } />
        </Flexbox>
        <Unity src='' />
      </Flexbox>
    );
  }
}

export default Public;
