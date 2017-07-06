import $ from 'jquery'

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST'
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'

function registerUserRequest(){
	return {
		type: REGISTER_USER_REQUEST,
		isFetching: true
	}
}

function registerUserFailure(){
	return {
		type: REGISTER_USER_FAILURE,
		isFetching: false,
		errorMessage: 'Duplicate username',
	}
}

function registerUserSuccess(user){
	return {
		type: REGISTER_USER_SUCCESS,
		isFetching: false,
		username: user.username,
		password: user.password,
		id: user._id,
	}
}

export function createNewUser(username, password, callback){
	return dispatch => {
		dispatch(registerUserRequest())

		$.ajax({
			url: process.env.REACT_APP_DUNGEONGAME_URL + '/users',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({ username: username, password: password }),
			contentType: 'application/json',
			cache: false,
			success: function(user) {
				dispatch(registerUserSuccess(user))
				if (callback) {
					callback(user)
				}
			},
			error: function(error) {
				dispatch(registerUserFailure())
			}
		})
	}
}

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST'
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'

function loginUserRequest(){
	return {
		type: LOGIN_USER_REQUEST,
		isFetching: true
	}
}

function loginUserFailure(){
	return {
		type: LOGIN_USER_FAILURE,
		isFetching: false,
		errorMessage: 'Duplicate username',
	}
}

function loginUserSuccess(user){
	return {
		type: LOGIN_USER_SUCCESS,
		isFetching: false,
		username: user.username,
		password: user.password,
		id: user._id,
	}
}

export function loginUser(username, password, callback){
	return dispatch => {
		dispatch(loginUserRequest())

		$.ajax({
			url: process.env.REACT_APP_DUNGEONGAME_URL + '/login',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({ username: username, password: password }),
			contentType: 'application/json',
			cache: false,
			success: function(user) {
				dispatch(loginUserSuccess(user))
				if (callback) {
					callback(user)
				}
			},
			error: function(error) {
				dispatch(loginUserFailure())
			}
		})
	}
}

export const NEW_ROOM_REQUEST = 'NEW_ROOM_REQUEST'
export const NEW_ROOM_FAILURE = 'NEW_ROOM_FAILURE'
export const NEW_ROOM_SUCCESS = 'NEW_ROOM_SUCCESS'

function newRoomRequest(){
	return {
		type: NEW_ROOM_REQUEST,
		isFetching: true
	}
}

function newRoomFailure(){
	return {
		type: NEW_ROOM_FAILURE,
		isFetching: false,
		errorMessage: 'Duplicate room name',
	}
}

function newRoomSuccess(room){
	return {
		type: NEW_ROOM_SUCCESS,
		isFetching: false,
		roomname: room.roomname,
		gameManager: room.gameManager,
		dungeon: room.dungeon,
		password: room.password,
		roomId: room._id,
	}
}

export function createNewRoom(roomname, password, dungeon, callback){
	return dispatch => {
		dispatch(newRoomRequest())

		$.ajax({
			url: process.env.REACT_APP_DUNGEONGAME_URL + '/rooms',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({ roomname: roomname, password: password, dungeon: dungeon }),
			contentType: 'application/json',
			cache: false,
			success: function(room) {
				dispatch(newRoomSuccess(room))
				if (callback) {
					callback(room)
				}
			},
			error: function(error) {
				dispatch(newRoomFailure())
			}
		})
	}
}

export const GET_ROOMS_REQUEST = 'GET_ROOMS_REQUEST'
export const GET_ROOMS_FAILURE = 'GET_ROOMS_FAILURE'
export const GET_ROOMS_SUCCESS = 'GET_ROOMS_SUCCESS'

function getRoomRequest(){
	return {
		type: GET_ROOMS_REQUEST,
		isFetching: true
	}
}

function getRoomFailure(errorMessage){
	return {
		type: GET_ROOMS_FAILURE,
		isFetching: false,
		errorMessage: errorMessage,
	}
}

function getRoomSuccess(rooms){
	return {
		type: GET_ROOMS_SUCCESS,
		isFetching: false,
		rooms,
	}
}

export function getRooms(callback){
	return dispatch => {
		dispatch(getRoomRequest())

		$.ajax({
			url: process.env.REACT_APP_DUNGEONGAME_URL + '/rooms',
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			cache: false,
			success: function(rooms) {
				dispatch(getRoomSuccess(rooms))
				if (callback) {
					callback(rooms)
				}
			},
			error: function(error) {
				dispatch(getRoomFailure(error))
			}
		})
	}
}

export const LOGOUT = 'LOGOUT'

function logout_action(){
	return {
		type: LOGOUT,
	}
}

export function logout(){
	return dispatch => {
		dispatch(logout_action())
	}
}

export const CONNECT_TO_ROOM = 'CONNECT_TO_ROOM'

function connectToRoomAction(connectedRoom){
	return {
		type: CONNECT_TO_ROOM,
		connectedRoom: connectedRoom,
	}
}

export function connectToRoom(connectedRoom){
	return dispatch => {
		dispatch(connectToRoomAction(connectedRoom))
	}
}

export const DISCONNECT_FROM_ROOM = 'DISCONNECT_FROM_ROOM'

function disconnectFromRoomAction(){
	return {
		type: DISCONNECT_FROM_ROOM,
	}
}

export function disconnectFromRoom(){
	return dispatch => {
		dispatch(disconnectFromRoomAction())
	}
}