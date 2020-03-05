import React from 'react'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import HomeIcon from '@material-ui/icons/Home'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'
import withStyles from '@material-ui/core/styles/withStyles'
import {connect} from 'react-redux'
import HideOnScroll from '../HideOnScroll'
import {
    HeaderBase, HeaderProps, HeaderMapStateToProps, HeaderMapDispatchToProps,
    HeaderIStateProps, HeaderInjectedProps, HeaderIDispatchProps
} from './classes/Header'

const drawerWidth: number = 240
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
    toolBar: {
        paddingRight: '.5rem',
        paddingLeft: '1rem'
    },
    logo: {
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
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start'
    },
    paper: {
        position: 'absolute',
        top: 64,
        zIndex: 4
    }
})

interface State {
    // toggles
    mobileDrawerOpen: boolean
}

interface IStyles extends WithStyles<typeof styles> {}

class MobileHeader extends HeaderBase<IStyles, State> {
    // toggles
    private _mobileDrawerOpen: string = 'mobileDrawerOpen'
    constructor(props: HeaderProps & IStyles) {
        super(props)
        this.state = {
            // snackbar show
            ...this.ErrorHandlerStateInit,
            // toggles
            mobileDrawerOpen: false
        }
        this.openMobileDrawer = this.openMobileDrawer.bind(this)
        this.closeMobileDrawer = this.closeMobileDrawer.bind(this)
        this.toggleMobileDrawer = this.toggleMobileDrawer.bind(this)
        this.selectHome = this.selectHome.bind(this)
    }

    private openMobileDrawer() {
        this.setValue(this._mobileDrawerOpen, true)
    }

    private closeMobileDrawer() {
        this.setValue(this._mobileDrawerOpen, false)
    }

    private toggleMobileDrawer(_: React.KeyboardEvent | React.MouseEvent) {
        if (this.state.mobileDrawerOpen) {
            this.closeMobileDrawer()
        } else {
            this.openMobileDrawer()
        }
    }

    private selectHome(_: React.KeyboardEvent | React.MouseEvent) {
        this.closeMobileDrawer()
        if (this.props.path !== '/') {
            this.props.push('/')
        }
    }

    public render() {
        const {classes} = this.props
        const {mobileDrawerOpen} = this.state

        return (
            <div className={classes.root}>
                <HideOnScroll {...this.props}>
                    <AppBar position="static"
                            className={clsx(classes.appBar)}
                    >
                        <Toolbar className={classes.toolBar}>
                            <Box display={'flex'} width={'100%'}>
                                <Box>
                                    <IconButton edge="start"
                                                classes={{
                                                    root: classes.logoIconButton
                                                }}
                                                onClick={this.selectHome}>
                                    </IconButton>
                                </Box>
                                <Box ml={'auto'}>
                                    <IconButton
                                        onClick={this.toggleMobileDrawer}
                                    >
                                        <MenuIcon fontSize={'large'}/>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Drawer
                    className={classes.drawer}
                    anchor="right"
                    open={mobileDrawerOpen}
                    onClose={this.toggleMobileDrawer}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.toggleMobileDrawer}>
                            <ChevronRightIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem button onClick={this.selectHome}>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Home'}/>
                        </ListItem>
                    </List>
                </Drawer>
                {this.renderErrorHandler()}
            </div>
        )
    }
}

export const MobileHeader_Comp = withStyles(styles)(
    connect<HeaderIStateProps, HeaderIDispatchProps, HeaderInjectedProps>(HeaderMapStateToProps, HeaderMapDispatchToProps)(MobileHeader)
)
