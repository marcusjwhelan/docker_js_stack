import React, {Suspense, lazy} from 'react'
import {Route, Switch} from 'react-router'
import {Header_Comp} from '../components/Header/Header'
import Footer_comp from '../components/Footer/Footer'
// import {PrivateRouter} from './PrivateRoute'
import {connect} from 'react-redux'
import Box from '@material-ui/core/Box'
import {Loading} from '../components/Loading'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import Toolbar from '@material-ui/core/Toolbar'
import Fab from '@material-ui/core/Fab'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import {ErrorHandlerHoc, EHHocState} from '../components/classes/ErrorHandlerHoc'

const ScrollTop = lazy(() => import('../components/ScrollTop'))
const Home = lazy(() => import('./Home/Home'))

const styles = (theme: Theme) => createStyles({
    container: {
        position: 'relative',
        display: 'flex',
        minHeight: '100%',
        flexDirection: 'column',
        margin: 0
    },
    header: {
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 15
    },
    toolBarG: {
        minHeight: 69
    },
    content: {
        marginTop: 0,
        minHeight: '100vh',
        zIndex: 0
    },
    fab: {
        zIndex: 100
    },
    footer: {
        bottom: 0,
        zIndex: 0,
        width: '100%',
        // @ts-ignore
        backgroundColor: 'black'
    }
})
interface State {
    mobile: boolean
}
interface IStateProps {
    router: any
}

interface IDispatchProps {
}
interface InjectedProps extends WithStyles<typeof styles> {}

type BaserRouterProps = IStateProps & IDispatchProps & InjectedProps

const mapStateToProps = (state: any): IStateProps => {
    const router = state.router
    return {
        router: router
    }
}

class BaseRouter extends ErrorHandlerHoc<BaserRouterProps, State> {
    /**
     * Local Variables
     */
    constructor(props: BaserRouterProps) {
        super(props)
        this.state = {
            ...this.ErrorHandlerStateInit,
            // set background color
            mobile: false
        }
        this.resize = this.resize.bind(this)
    }
    private resize() {
        this.setValue('mobile', window.innerWidth <= 840)
    }
    public componentDidMount(): void {
        window.addEventListener('resize', this.resize)
        this.resize()
    }
    public componentDidUpdate(_prevProps: Readonly<BaserRouterProps>, _prevState: Readonly<EHHocState & State>, _snapshot?: any): void {
    }

    public render() {
        const {classes} = this.props
        const {mobile} = this.state
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <Header_Comp />
                </div>
                <Toolbar className={classes.toolBarG} disableGutters={true} variant={'dense'} id={'back-to-top-anchor'}/>
                <Box className={classes.content} bgcolor={mobile ? 'grey.800' : 'background.default'}>
                    {/* Main section for Routes */}
                    <Suspense fallback={<Loading/>}>
                        <Switch>
                              {/* Example private */}
{/*                            <PrivateRouter path={'/example'}
                                           component={Example}
                                           super_redirectPath={'/Example'}
                                           super_openSnackbar={this.openSnackbar}
                                           super_setValue={this.setValue}
                                           _super_warning={this._warning}
                                           _super_error={this._error}
                                           _super_warningMessage={this._warningMessage}
                                           _super_errorMessage={this._errorMessage}
                            />*/}
                            <Route exact path="/" name="Home" component={Home}/>
                        </Switch>
                    </Suspense>
                    {/* Error messages and information */}
                    {this.renderErrorHandler()}
                </Box>
                <div className={classes.footer}>
                    <Footer_comp/>
                </div>
                <Suspense fallback={<div/>}>
                    <ScrollTop {...this.props}>
                        <Fab className={classes.fab} color="primary" size="large" aria-label="scroll back to top">
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </ScrollTop>
                </Suspense>
            </div>
        )
    }
}

export const Base_Router = withStyles(styles)(
    connect<IStateProps, null, InjectedProps>(mapStateToProps, null)(BaseRouter)
)