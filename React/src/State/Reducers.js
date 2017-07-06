import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { 
	REGISTER_USER_REQUEST, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS,
	LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT,
	NEW_ROOM_REQUEST, NEW_ROOM_FAILURE, NEW_ROOM_SUCCESS,
	GET_ROOMS_REQUEST, GET_ROOMS_FAILURE, GET_ROOMS_SUCCESS,
	CONNECT_TO_ROOM, DISCONNECT_FROM_ROOM
} from './ServerActions'

import { reducer } from 'redux-form'

function serverActions(state = {
	isFetching: false
}, action) {
	const fetch = {
		isFetching: action.isFetching,
	}
	switch (action.type) {
		case REGISTER_USER_REQUEST:
			return Object.assign({}, state, fetch, {
				username: action.username,
				password: action.password,
			})
		case REGISTER_USER_SUCCESS:
			return Object.assign({}, state, fetch, {
				username: action.username,
				password: action.password,
				id: action.id,
			})
		case REGISTER_USER_FAILURE:
			return Object.assign({}, state, fetch, {
				errorMessage: action.errorMessage,
			})
		case LOGIN_USER_REQUEST:
			return Object.assign({}, state, fetch)
		case LOGIN_USER_FAILURE:
			return Object.assign({}, state, fetch, {
				errorMessage: action.errorMessage,
			})
		case LOGIN_USER_SUCCESS:
			return Object.assign({}, state, fetch, {
				username: action.username,
				password: action.password,
				id: action.id,
			})
		case NEW_ROOM_REQUEST:
			return Object.assign({}, state, fetch)
		case NEW_ROOM_FAILURE:
			return Object.assign({}, state, fetch, {
				errorMessage: action.errorMessage,
			})
		case NEW_ROOM_SUCCESS:
			return Object.assign({}, state, fetch, {
				roomId: action.roomId,
				gameManager: action.gameManager,
				roomname: action.roomname,
				dungeon: action.dungeon,
				password: action.password
			})
		case GET_ROOMS_REQUEST:
			return Object.assign({}, state, fetch)
		case GET_ROOMS_FAILURE:
			return Object.assign({}, state, fetch, {
				errorMessage: action.errorMessage,
			})
		case GET_ROOMS_SUCCESS:
			return Object.assign({}, state, fetch, {
				rooms: action.rooms,
			})
		case CONNECT_TO_ROOM:
			return Object.assign({}, state, fetch, {
				connectedRoom: action.connectedRoom,
			})
		case DISCONNECT_FROM_ROOM:
			return Object.assign({}, state, fetch, {
				connectedRoom: undefined,
			})
		case LOGOUT:
			return {}
		default:
			return state
	}
}

const dungeongame = combineReducers({
	serverActions,
	routing: routerReducer,
	form: reducer
})

export default dungeongame