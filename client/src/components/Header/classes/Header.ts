import {bindActionCreators} from 'redux'
import {ThunkDispatch} from 'redux-thunk'
import {AppState} from '../../../store'
import {ErrorHandlerHoc} from '../../classes/ErrorHandlerHoc'
import {push} from 'connected-react-router'

export interface HeaderState {
}

export interface HeaderIStateProps {
    path: string
}

export interface HeaderIDispatchProps {
    push: (path: string) => void
}

export interface HeaderInjectedProps {
}

export type HeaderProps = HeaderInjectedProps & HeaderIDispatchProps & HeaderIStateProps

export const HeaderMapStateToProps = (state: any): HeaderIStateProps => {
    const pathname = state.router.location.pathname
    return {
        path: pathname
    }
}

export const HeaderMapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>): HeaderIDispatchProps => {
    return {
        push: bindActionCreators(push, dispatch)
    }
}

export class HeaderBase<T, C> extends ErrorHandlerHoc<HeaderProps & T, HeaderState & C> {
    constructor(props: HeaderProps & T) {
        super(props)
    }
}