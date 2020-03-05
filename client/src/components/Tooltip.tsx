import { withStyles, Theme} from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

export const HMTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: theme.palette.background.paper,
        boxShadow:  '0px 0px 15px -2px #141414'
    }
}))(Tooltip)