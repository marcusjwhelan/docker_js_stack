import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AnyAction} from 'redux'
import {TexampleDispatch} from './types'
import {EXAMPLE} from './index'

export type TclearGetExampleAction = typeof clearGetExampleAction

export const clearGetExampleAction = (): ThunkAction<void, {}, {}, AnyAction> => {
    return (dispatch: ThunkDispatch<TexampleDispatch, {}, AnyAction>, _getState: any): void => {
        dispatch({
            type: EXAMPLE.GET_EXAMPLE_CLEAR
        })
    }
}