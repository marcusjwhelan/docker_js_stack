import React, {Component} from 'react'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import CustomSnackbar from './CustomSnackbar'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = (_theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        zIndex: 1400
    }
})

type Tvertical = 'top' | 'bottom'
type Thorizontal = 'left' | 'right' | 'center'
interface InjectedProps extends WithStyles<typeof styles> {
    // waiter
    snackBarWaitTime: number
    // position
    horizontal: Thorizontal
    vertical: Tvertical
    // snackbar show
    success: boolean
    info: boolean
    warning: boolean
    error: boolean
    // snackbar messages
    successMessage: string
    infoMessage: string
    warningMessage: string
    errorMessage: string
    // methods
    closeSnackbar: (type: string, reason?: string) => void
}

class ErrorHandlerBasic extends Component<InjectedProps, {}> {
    private _success: string = 'success'
    private _info: string = 'info'
    private _warning: string = 'warning'
    private _error: string = 'error'
    constructor(props: InjectedProps) {
        super(props)
    }
    public render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{
                        vertical: this.props.vertical,
                        horizontal: this.props.horizontal
                    }}
                    open={this.props.success}
                    onClose={(_e: any, reason: string) => {
                        this.props.closeSnackbar(this._success, reason)
                    }}
                    autoHideDuration={this.props.snackBarWaitTime}
                >
                    <CustomSnackbar
                        variant={this._success}
                        onClose={() => this.props.closeSnackbar(this._success)}
                        message={this.props.successMessage}
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: this.props.vertical,
                        horizontal: this.props.horizontal
                    }}
                    open={this.props.info}
                    onClose={(_e: any, reason: string) => {
                        this.props.closeSnackbar(this._info, reason)
                    }}
                    autoHideDuration={this.props.snackBarWaitTime}
                >
                    <CustomSnackbar
                        variant={this._info}
                        onClose={() => this.props.closeSnackbar(this._info)}
                        message={this.props.infoMessage}
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: this.props.vertical,
                        horizontal: this.props.horizontal
                    }}
                    open={this.props.warning}
                    autoHideDuration={this.props.snackBarWaitTime}
                    onClose={(_e: any, reason: string) => {
                        this.props.closeSnackbar(this._warning, reason)
                    }}
                >
                    <CustomSnackbar
                        variant={this._warning}
                        onClose={() => this.props.closeSnackbar(this._warning)}
                        message={this.props.warningMessage}
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: this.props.vertical,
                        horizontal: this.props.horizontal
                    }}
                    open={this.props.error}
                    autoHideDuration={this.props.snackBarWaitTime}
                    onClose={(_e: any, reason: string) => {
                        this.props.closeSnackbar(this._error, reason)
                    }}
                >
                    <CustomSnackbar
                        variant={this._error}
                        onClose={() => this.props.closeSnackbar(this._error)}
                        message={this.props.errorMessage}
                    />
                </Snackbar>
            </div>
        )
    }
}

export default withStyles(styles)(ErrorHandlerBasic)