import React from 'react'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'
import withStyles from '@material-ui/core/styles/withStyles'
import {connect} from 'react-redux'
import HideOnScroll from '../HideOnScroll'
import {
    HeaderBase, HeaderProps, HeaderIDispatchProps, HeaderInjectedProps, HeaderIStateProps,
    HeaderMapDispatchToProps, HeaderMapStateToProps
} from './classes/Header'

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1
    },
    appBar: {
        // @ts-ignore
        backgroundColor: 'black'
    },
    logoIconButton: {
        borderRadius: 0
    },
    logo: {
        // marginLeft: 8,
        'minHeight': 36,
        'maxHeight': 36,
        '@media (min-width:0px) and (orientation: landscape)': {
            'minHeight': 28,
            'maxHeight': 28
        },
        '@media (min-width:600px)': {
            'minHeight': 44,
            'maxHeight': 44
        }
    },
    paper: {
        position: 'absolute',
        top: 68,
        width: 126.883,
        zIndex: 10
    },
    dropDownList: {
        padding: 0
    }
})

interface State {}
interface IStyles extends WithStyles<typeof styles> {}

class DesktopHeader extends HeaderBase<IStyles, State> {
    constructor(props: HeaderProps & IStyles) {
        super(props)
        this.state = {
            ...this.ErrorHandlerStateInit
        }
        this.selectHome = this.selectHome.bind(this)
    }

    private selectHome(_: React.KeyboardEvent | React.MouseEvent) {
        if (this.props.path !== '/') {
            this.props.push('/')
        }
    }

    public render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <HideOnScroll {...this.props}>
                    <AppBar position="static"
                            className={clsx(classes.appBar)}
                    >
                        <Toolbar>
                            <Box display={'flex'} width={'100%'} flexDirection={'row'}>
                                <Box>
                                    <IconButton edge="start"
                                                classes={{root: classes.logoIconButton}}
                                                onClick={this.selectHome}>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                {this.renderErrorHandler()}
            </div>
        )
    }
}

export const DesktopHeader_Comp = withStyles(styles)(
    connect<HeaderIStateProps, HeaderIDispatchProps, HeaderInjectedProps>(HeaderMapStateToProps, HeaderMapDispatchToProps)(DesktopHeader)
)