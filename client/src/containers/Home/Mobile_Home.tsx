import React from 'react'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import {connect} from 'react-redux'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import {IExample} from '../../models/example'
import {clearGetExampleAction, getExampleAction, TclearGetExampleAction, TgetExampleAction} from '../../actions/example'
import {IExampleReducer} from '../../reducers/example'
import {ThunkDispatch} from 'redux-thunk'
import {AppState} from '../../store'
import {bindActionCreators} from 'redux'
import {ErrorHandlerHoc, EHHocState} from '../../components/classes/ErrorHandlerHoc'

const styles = (theme: Theme) => createStyles({
    root: {
        height: '100%',
        paddingLeft: 0,
        paddingRight: 0
    },
    variableHeight: {
        width: '100%',
        height: '350px',
        // Extra small devices
        '@media only screen and (max-width: 300px)': {
            height: 350
        },
        '@media only screen and (min-width: 300px)': {
            height: 350
        },
        // Small devices
        '@media only screen and (min-width: 600px)': {
            height: 550
        },
        // Medium devices
        '@media only screen and (min-width: 800px)': {
            height: 780
        },
        contained: {
            color: theme.palette.text.primary,
            // @ts-ignore
            backgroundColor: 'blue',
            '&:hover': {
                // @ts-ignore
                backgroundColor: 'blue'
            }
        }
    }
})

interface State {
    getExampleWaiter: boolean
}

interface IStateProps {
    get_example: IExample | null
    get_example_error: string | null
}

interface IDispatchProps {
    getExampleAction: TgetExampleAction
    clearGetExampleAction: TclearGetExampleAction
}

interface InjectedProps extends WithStyles<typeof styles> {}

type HomeProps = InjectedProps & IStateProps & IDispatchProps

const mapStateToProps = (state: any): IStateProps => {
    const example = state.example as IExampleReducer
    return {
        get_example: example.get_example,
        get_example_error: example.get_example_error
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>): IDispatchProps => {
    return {
        getExampleAction: bindActionCreators(getExampleAction, dispatch),
        clearGetExampleAction: bindActionCreators(clearGetExampleAction, dispatch)
    }
}

class MobileHome extends ErrorHandlerHoc<HomeProps, State> {
    private _getExampleWaiter: string = 'getExampleWaiter'
    constructor(props: HomeProps) {
        super(props)
        this.state = {
            ...this.ErrorHandlerStateInit,
            getExampleWaiter: false
        }
    }

    public componentDidMount(): void {
        this.setValue(this._getExampleWaiter, true)
        this.props.getExampleAction('hello world')
    }

    public componentDidUpdate(_prevProps: Readonly<HomeProps>, _prevState: Readonly<EHHocState & State>,
                              _snapshot?: any): void {
        /** Handle example */
        if (this.state.getExampleWaiter &&
            (this.props.get_example || this.props.get_example_error)
        ) {
            if (this.props.get_example_error) {
                // handle example error
                this.setValue(this._errorMessage, 'error')
                this.openSnackbar(this._error)
            }
            if (this.props.get_example) {
                // handle example success
                this.setValue(this._successMessage, 'success')
                this.openSnackbar(this._success)
                this.props.clearGetExampleAction()
            }
        }
    }

    public render() {
        const {classes} = this.props
        return (
            <Container className={classes.root}>
                <Box>
                    Hello world
                </Box>
            </Container>
        )
    }
}

export default withStyles(styles)(
    connect<IStateProps, IDispatchProps, InjectedProps>(mapStateToProps, mapDispatchToProps)(MobileHome)
)