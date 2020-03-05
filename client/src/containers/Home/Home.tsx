import React, {Component} from 'react'
import DesktopHome from './Desktop_Home'
import MobileHome from './Mobile_Home'
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles'
import Box from '@material-ui/core/Box'
import {AppState} from '../../store'
import {ThunkDispatch} from 'redux-thunk'
import {connect} from 'react-redux'
import {match, withRouter} from 'react-router'
import {createStyles, Theme} from '@material-ui/core'
import {History, Location} from 'history'

const styles = (_theme: Theme) => createStyles({
    root: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -100,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        opacity: 0.5
    }
})

interface InjectedProps extends WithStyles<typeof styles> {}

interface State {
    mobile: boolean
}

interface IStateProps {
}

interface IDispatchProps {
}

interface HocInjected {
    location: Location
    match: match
    history: History
}

type HomeProps = IStateProps & IDispatchProps & InjectedProps & HocInjected

const mapStateToProps = (state: any): IStateProps => {
    return {
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>): IDispatchProps => {
    return {
    }
}

class Home extends Component<HomeProps, State> {
    constructor(props: HomeProps) {
        super(props)
        this.state = {
            mobile: false
        }
        this.resize = this.resize.bind(this)
        this.setValue = this.setValue.bind(this)
    }
    public componentDidMount(): void {
        window.addEventListener('resize', this.resize)
        this.resize()
    }
    public componentDidUpdate(_prevProps: Readonly<HomeProps>, _prevState: Readonly<State>, _snapshot?: any): void {

    }

    public componentWillUnmount(): void {
        window.removeEventListener('resize', this.resize)
    }
    private setValue(key: string, value: any) {
        this.setState(((): any => ({[key]: value}))())
    }
    private resize() {
        this.setValue('mobile', window.innerWidth <= 840)
    }
    public render() {
        const {classes} = this.props
        const {mobile} = this.state
        return (
            <Box height={'100%'} width={'100%'}>
                <div className={classes.root}/>
                {mobile ?
                    <MobileHome/>
                    :
                    <DesktopHome/>
                }
            </Box>
        )
    }
}

export default withRouter<HocInjected, any>(withStyles(styles)(
    connect<IStateProps, IDispatchProps, InjectedProps>(mapStateToProps, mapDispatchToProps)(Home)
))