import React, {Component} from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = (_theme: Theme) => createStyles({
    root: {
        paddingLeft: 0,
        paddingRight: 0,
        maxWidth: 1600,
        marginTop: '1rem',
        marginBottom: '1rem'
    }
})

interface State {}
interface InjectedProps extends WithStyles<typeof styles> {}

type FooterProps = InjectedProps

class Footer extends Component<FooterProps, State> {
    constructor(props: FooterProps) {
        super(props)
    }
    public render() {
        const {classes} = this.props
        return (
            <Container maxWidth={false} className={classes.root}>
                <Box display={'flex'}
                     flexDirection={'row'}
                >
                    <Box>Footer</Box>
                </Box>
            </Container>
        )
    }
}

export default withStyles(styles)(Footer)