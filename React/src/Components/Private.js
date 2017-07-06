import React, { Component } from 'react'
import Flexbox from 'flexbox-react'

import { getRooms, createNewRoom, logout, connectToRoom } from '../State/ServerActions'
import { svgIcon } from './icons'
import DungeonRun from './DungeonRun'

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import AppBar from 'material-ui/AppBar'

import { curry } from 'ramda'
import { _ } from 'underscore'

const roomStyle = {
  border: 'solid',
  borderColor: 'grey',
  borderWith: '1px',
  padding: '25px',
  margin: '25px',
}

class Private extends Component {

  constructor(props){
    super(props)
    this.state = Object.assign({}, this.propsConst(props), {
      newRun: false,
      runDetails: { dungeon: 0 },
      availableRooms: [],
    })
  }

  propsConst = (props) => {
    return({
      props: props,
      dispatch: props.dispatch,
      errorMessage: props.errorMessage,
      isFetching: props.isFetching,
      socketManager: props.socketManager,
      managingSocket: props.managingSocket,
      connectedRoom: props.connectedRoom,
      username: props.username,
    })
  }

  handleGetRoomsCallback = (rooms) => {
    this.setState({ availableRooms: rooms })
  }

  componentWillMount(){
    this.state.dispatch(getRooms(this.handleGetRoomsCallback))
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  handleNewRun = () => {
    this.setState({ newRun: true })
  }

  closeNewRun = () => this.setState({ newRun: false })

  handleChangeDetails = (id, event, value) => {
    const tempDetails = this.state.runDetails
    if(_.isNumber(value)){
      tempDetails[id] = value
    } else {
      tempDetails[id] = event.target.value
    }
    this.setState({ runDetails: tempDetails, errorMessage: '' })
  }

  curryHandleChangeDetails = curry(this.handleChangeDetails)

  handleCreateNewRun = () => {
    this.state.dispatch(createNewRoom(this.state.runDetails.roomname, this.state.runDetails.password, this.translateToDungeon(), this.closeNewRun))
  }

  translateToDungeon = () => {
    switch(this.state.runDetails.dungeon){
      case 0:
        return 'Tutorial'
      default:
        return ''
    }
  }

  logout = () => {
    this.state.dispatch(logout())
  }

  joinRoom = (room, event) => {
    this.state.dispatch(connectToRoom(room))
  }

  curryJoinRoom = curry(this.joinRoom)

  render() {
    const actions = [
    <RaisedButton label='Cancel' secondary={ true } onTouchTap={ this.closeNewRun } style={ { marginRight: '10px' } } />,
    <RaisedButton label='Create Run!' onTouchTap={ this.handleCreateNewRun } />
    ]
    return (
      <Flexbox flexDirection='column' flexBasis='auto'>
        <AppBar title='Dungeon Run' iconElementLeft={ <IconButton tooltip='New Dungeon Run' tooltipPosition='bottom-right' onTouchTap={ this.handleNewRun }> { svgIcon('redPlus') } </IconButton> } iconElementRight={ <IconButton tooltip='Logout' onTouchTap={ this.logout }> { svgIcon('logout') } </IconButton> } />
        { this.state.connectedRoom ?
          <DungeonRun dispatch={ this.state.dispatch } socketManager={ this.state.socketManager } managingSocket={ this.state.managingSocket } username={ this.state.username } 
          connectedRoom={ this.state.connectedRoom } />
          :
          <div>
            { _.isEmpty(this.state.availableRooms) ?
              <Flexbox justifyContent='center' alignItems='center' style={ { marginTop: '15px' } }>
                <font size={ 3 }> No dungeons running. Start your own: <IconButton tooltip='New Dungeon Run' tooltipPosition='bottom-right' onTouchTap={ this.handleNewRun }> { svgIcon('redPlus') } </IconButton> </font> 
              </Flexbox>
              :
              <Flexbox>
                { this.state.availableRooms.map( (entry, index) => (
                  <Flexbox flexDirection='column' justifyContent='center' alignItems='center' key={ index } style={ roomStyle }>
                    <Flexbox alignItems='center'> <font size={ 7 }> { entry.roomname.replaceAll('%20', ' ') } </font> { _.isString(entry.password) && <IconButton tooltip='Password Protected' style={ { width: 36, height: 36, padding: 8 } } iconStyle={ { width: 16, height: 16 } }> { svgIcon('lock') } </IconButton> } </Flexbox>
                    <font size={ 4 } style={ { marginTop: '10px', marginBottom: '10px' } }> Dungeon: { entry.dungeon } </font>
                    <RaisedButton label='Join Run' fullWidth={ true } primary={ true } onTouchTap={ this.curryJoinRoom(entry) } />
                  </Flexbox>
                  ))
                }
              </Flexbox>
            }
          </div>
        }
        <Dialog open={ this.state.newRun } onRequestClose={ this.closeNewRun } title='New Dungeon Run' actions={ actions }>
          <Flexbox flexDirection='column' alignItems='center'>
            <TextField floatingLabelText='Room Name' onChange={ this.curryHandleChangeDetails('roomname') } />
            <TextField floatingLabelText='Password' onChange={ this.curryHandleChangeDetails('password') } />
            <SelectField floatingLabelText='Dungeon' value={ this.state.runDetails.dungeon } onChange={ this.curryHandleChangeDetails('dungeon') }>
              <MenuItem value={ 0 } primaryText='Tutorial' />
            </SelectField>
            { this.state.isFetching &&
              <CircularProgress />
            }
            <font color='red'> { _.isString(this.state.errorMessage) && this.state.errorMessage } </font>
          </Flexbox>
        </Dialog>
      </Flexbox>
    );
  }
}

String.prototype.replaceAll = function(str1, str2, ignore) {
  // eslint-disable-next-line
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

export default Private;
