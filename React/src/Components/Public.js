import React, { Component } from 'react'
import Flexbox from 'flexbox-react'

import { createNewUser, loginUser } from '../State/ServerActions'

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'

import { curry } from 'ramda'

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
      isFetching: props.isFetching,
      errorMessage: props.errorMessage,
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  handleRegisterCallback = (data) => {
    console.log('Received registration', data)
  }

  handleLoginCallback = (data) => {
    console.log('Received login', data)
  }

  registerUser = () => {
    this.state.dispatch(createNewUser(this.state.loginDetails.username, this.state.loginDetails.password, this.handleRegisterCallback))
  }

  loginUser = () => {
    this.state.dispatch(loginUser(this.state.loginDetails.username, this.state.loginDetails.password, this.handleLoginCallback))
  }

  changeDetails = (id, event) => {
    const loginDetails = this.state.loginDetails
    loginDetails[id] = event.target.value
    this.setState({ loginDetails: loginDetails })
  }

  curryChangeDetails = curry(this.changeDetails)

  render() {
    return (
      <Flexbox flexDirection='column' flexBasis='auto' style={ { maxHeight: '350px', maxWidth: '350px' } }>
        <Flexbox flexDirection='column' alignItems='center'>
          <TextField floatingLabelText='Username' onChange={ this.curryChangeDetails('username') } />
          <TextField type='password' floatingLabelText='Password' onChange={ this.curryChangeDetails('password') } />
        </Flexbox>
        <Flexbox justifyContent='center'>
          { this.state.isFetching ?
            <CircularProgress />
            :
            <Flexbox justifyContent='center'>
              <RaisedButton label='Login' primary={ true } onTouchTap={ this.loginUser } style={ { marginRight: '5px' } } />
              <RaisedButton label='Register' onTouchTap={ this.registerUser } />
            </Flexbox>
          }
        </Flexbox>
        <Flexbox>
          <font color='red'> { this.state.errorMessage } </font>
        </Flexbox>
      </Flexbox>
    );
  }
}

export default Public;
