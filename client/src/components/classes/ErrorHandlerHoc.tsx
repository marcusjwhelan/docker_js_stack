import React, {Component, Suspense, lazy} from 'react'
import {IControlErrorHandler} from '../interfaces/ControlErrorHandler'
import {Loading} from '../Loading'
const ErrorHandlerBasic = lazy(() => import('../ErrorHandlerBasic'))

export interface EHHocState {
    // snackbar show
    success: boolean,
    info: boolean,
    warning: boolean,
    error: boolean,
    // snackbar messages
    successMessage: string,
    infoMessage: string,
    warningMessage: string,
    errorMessage: string,
}

export class ErrorHandlerHoc<T, C> extends Component<T, EHHocState & C> {
    // error handling
    protected _success: string = 'success'
    protected _info: string = 'info'
    protected _warning: string = 'warning'
    protected _error: string = 'error'
    protected _successMessage: string = 'successMessage'
    protected _infoMessage: string = 'infoMessage'
    protected _warningMessage: string = 'warningMessage'
    protected _errorMessage: string = 'errorMessage'
    protected ErrorHandlerStateInit = {
        // snackbar show
        success: false,
        info: false,
        warning: false,
        error: false,
        // snackbar messages
        successMessage: '',
        infoMessage: '',
        warningMessage: '',
        errorMessage: ''
    }
    // protected value
    protected snackBarWaitTime: number = 3000
    constructor(props: T) {
        super(props)
        this.setValue = this.setValue.bind(this)
        this.openSnackbar = this.openSnackbar.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.errorHandlerConstructor = this.errorHandlerConstructor.bind(this)
        this.renderErrorHandler = this.renderErrorHandler.bind(this)
    }
    protected setValue(key: string, value: any) {
        this.setState(((): any => ({[key]: value}))())
    }
    protected openSnackbar(type: string) {
        this.setValue(type, true)
    }
    protected closeSnackbar(type: string, reason?: string) {
        if (reason && reason === 'clickaway') {
            return
        }
        this.setValue(type, false)
        switch (type) {
            case this._success:
                this.setValue(this._successMessage, '')
                break
            case this._info:
                this.setValue(this._infoMessage, '')
                break
            case this._warning:
                this.setValue(this._warningMessage, '')
                break
            case this._error:
                this.setValue(this._errorMessage, '')
                break
            default:
                break
        }
    }
    protected errorHandlerConstructor(): IControlErrorHandler {
        return {
            // snackbar show
            success: this.state.success,
            info: this.state.info,
            warning: this.state.warning,
            error: this.state.error,
            // snackbar messages
            successMessage: this.state.successMessage,
            infoMessage: this.state.infoMessage,
            warningMessage: this.state.warningMessage,
            errorMessage: this.state.errorMessage,
            // methods
            EH_openSnackbar: this.openSnackbar,
            EH_closeSnackbar: this.closeSnackbar,
            EH_setValue: this.setValue
        }
    }
    protected renderErrorHandler() {
        return (
            <Suspense fallback={<Loading/>}>
                <ErrorHandlerBasic
                    snackBarWaitTime={this.snackBarWaitTime}
                    horizontal={'left'}
                    vertical={'bottom'}
                    success={this.state.success}
                    info={this.state.info}
                    warning={this.state.warning}
                    error={this.state.error}
                    successMessage={this.state.successMessage}
                    infoMessage={this.state.infoMessage}
                    warningMessage={this.state.warningMessage}
                    errorMessage={this.state.errorMessage}
                    closeSnackbar={this.closeSnackbar}
                />
            </Suspense>
        )
    }
}