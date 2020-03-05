import withStyles from '@material-ui/core/styles/withStyles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails'

export const ExpansionPanel = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.grey['800'],
        width: '100%',
        zIndex: 4,
        '&:before': {
            display: 'none'
        },
        '&$expanded': {
            margin: 'auto'
        }
    },
    rounded: {
        '&:first-child': {
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8
        },
        '&:last-child': {
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8
        }
    },
    expanded: {
        '&:not(:last-child)': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.40)'
        },
        '&:last-child': {
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0
        }
    }
}))(MuiExpansionPanel)

export const ExpansionPanelSummaryTop = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.grey['800'],
        boxShadow:  '0px 1px 4px 1px #141414',
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
            backgroundColor: theme.palette.action.selected
        },
        '&:first-child': {
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
    content: {
        '&$expanded': {
            margin: '12px 0'
        },
        '&:first-child': {
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8
        },
        '&:not(:first-child)': {
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0
        }
    },
    expanded: {}
}))(MuiExpansionPanelSummary)

export const ExpansionPanelSummary = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.grey['800'],
        boxShadow:  '0px 1px 4px 1px #141414',
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
            backgroundColor: theme.palette.action.selected
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
    content: {
        '&$expanded': {
            margin: '12px 0'
        }
    },
    expanded: {}
}))(MuiExpansionPanelSummary)

export const ExpansionPanelSummaryBottom = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.grey['800'],
        boxShadow:  '0px 1px 4px 1px #141414',
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
            backgroundColor: theme.palette.action.selected
        },
        '&:first-child': {
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
    content: {
        '&$expanded': {
            margin: '12px 0'
        },
        '&:first-child': {
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8
        }
    },
    expanded: {
        '&:first-child': {
            borderRadius: 0
        }
    }
}))(MuiExpansionPanelSummary)

// @ts-ignore
export const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiExpansionPanelDetails)