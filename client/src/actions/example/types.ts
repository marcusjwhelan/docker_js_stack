import {Action} from 'redux'

export enum EXAMPLE {
    GET_EXAMPLE = 'GET_EXAMPLE',
    GET_EXAMPLE_ERROR = 'GET_EXAMPLE_ERROR',
    GET_EXAMPLE_CLEAR = 'GET_EXAMPLE_CLEAR'
}

import {IExample} from '../../models/example'

/**
 * Interfaces/Types for Example
 */
export interface IexampleSuccess extends Action<any> {
    type: EXAMPLE.GET_EXAMPLE
    payload: IExample
}

export interface IexampleError extends Action<any> {
    type: EXAMPLE.GET_EXAMPLE_ERROR
    payload: IExample
}

export interface IexampleClear extends Action<any> {
    type: EXAMPLE.GET_EXAMPLE_CLEAR
}

export type TexampleDispatch = IexampleSuccess | IexampleError | IexampleClear
/** --------------------------------------------------------------- */
