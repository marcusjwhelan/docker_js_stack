import {combineReducers} from 'redux'
import {History} from 'history'
import {connectRouter, RouterState} from 'connected-react-router'
import {ExampleReducer, IExampleReducer} from './example'

export interface ApplicationState {
    router: RouterState
    example: IExampleReducer
}

export const rootReducer = (history: History) => combineReducers<ApplicationState>({
    router: connectRouter(history),
    example: ExampleReducer
})