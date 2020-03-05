import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {ApplicationState, rootReducer} from '../reducers'
import {routerMiddleware as createRouterMiddleware} from 'connected-react-router'
import {History, createHashHistory} from 'history'
import logger from 'redux-logger'

// export const history: History = createBrowserHistory()
export const history: History = createHashHistory()
export type AppState = ReturnType<typeof rootReducer>

export const configureStore = (initialState: any = {}) => {
    const routerMiddleware = createRouterMiddleware(history)
    let middlewares = (process.env.ENV === 'production') ?
        [thunk, routerMiddleware]
        :
        [thunk, routerMiddleware, logger]

    const middleware = compose(applyMiddleware(...middlewares))
    // root state is all reducers names an types in interface
    // root actions is all actions types as one type
    // root state, root actions
    return createStore<ApplicationState, any, {}, {}>(
        rootReducer(history),
        initialState as any,
        middleware
    )
}