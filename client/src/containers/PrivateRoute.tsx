import React from 'react'
import {Route, Redirect, RouteProps} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {AppState} from '../store'
import {push} from 'connected-react-router'
import {ThunkDispatch} from 'redux-thunk'

interface IStateProps {
    router: any
}

interface IDispatchProps {
    push: (path: string) => void
}

interface InjectedProps extends RouteProps {
    // base values
    super_redirectPath: string
    // string values to toggle appropriate snackbars
    _super_warning: string
    _super_error: string
    _super_warningMessage: string
    _super_errorMessage: string
    // parent method to open snackbar
    super_openSnackbar: (type: string) => void
    // set parent state
    super_setValue: (key: string, value: any) => void
}

type PrivateRouteProps = InjectedProps & IDispatchProps & IStateProps

const mapStateToProps = (state: any): IStateProps => {
    const router = state.router
    return {
        router: router
    }
}
const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>): IDispatchProps => {
    return {
        push: bindActionCreators(push, dispatch),
    }
}

class PrivateRoute extends Route<PrivateRouteProps> {
    // save
    private _init: string = 'init'
    constructor(props: PrivateRouteProps) {
        super(props)
        this.state = {
            init: true
        }
        this.setValue = this.setValue.bind(this)
    }
    /**
     * Used to make React state changes functional instead.
     * Issues with using this.setState have unpredictable setters
     * while using this method within setState makes setState commit
     * state changes in the order you describe
     * @param key
     * @param value
     */
    private setValue(key: string, value: any) {
        this.setState(((): any => ({[key]: value}))())
    }

    public componentDidMount(): void {
       this.setValue(this._init, false)
    }

    public componentDidUpdate(_prevProps: Readonly<PrivateRouteProps>, _prevState: Readonly<any>, _snapshot?: any): void {
    }

    public render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {
            super_redirectPath
        } = this.props

        // some decision code for routing
        // possible switch statement and other options for route to return

        const renderComponent1 = () => (<Redirect to={{pathname: super_redirectPath}}/>)
        return <Route {...this.props} component={renderComponent1}/>
    }
}
export const PrivateRouter = connect<IStateProps, IDispatchProps, InjectedProps>(mapStateToProps, mapDispatchToProps)(PrivateRoute)