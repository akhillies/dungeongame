import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import thunkMiddleware from 'redux-thunk'
import injectTapEventPlugin from 'react-tap-event-plugin'

import political_capital from './State/Reducers'
import { saveState, loadState } from './State/StateStoreLoad'

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { getMuiTheme } from 'material-ui/styles'

let createStoreWithThunk = applyMiddleware(thunkMiddleware)(createStore)
const persistedState = loadState()
let store = createStoreWithThunk(political_capital, persistedState)

store.subscribe( () => {
	saveState(store.getState())
})

injectTapEventPlugin()

ReactDOM.render((
  <Provider store={ store }>
  	<MuiThemeProvider muiTheme={ getMuiTheme(lightBaseTheme) }>
  		<BrowserRouter>
  			<Switch>
    			<Route path='*' component={ App } />
    		</Switch>
    	</BrowserRouter>
    </MuiThemeProvider>
  </Provider>),
  document.getElementById('root')
)
registerServiceWorker();