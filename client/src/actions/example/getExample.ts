import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AnyAction} from 'redux'
import axios, {AxiosResponse, AxiosError, AxiosRequestConfig} from 'axios'
import {IExample} from '../../models/example'
import {EXAMPLE} from './index'
import {TexampleDispatch} from './types'

export type TgetExampleAction = typeof getExampleAction

export const getExampleAction = (param1: string): ThunkAction<void, {}, {}, AnyAction> => {
    return (dispatch: ThunkDispatch<TexampleDispatch, {}, AnyAction>, _getState: any): void => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `exampleEndpoint.com/api/v1/getExample`,
            params: {
                param1
            }
        }
        axios.request(config)
            .then((res: AxiosResponse<IExample>) => {
                return dispatch({
                    type: EXAMPLE.GET_EXAMPLE,
                    payload: res.data
                })
            })
            .catch((err: AxiosError) => {
                return dispatch({
                    type: EXAMPLE.GET_EXAMPLE_ERROR,
                    payload: err.message
                })
            })
    }
}