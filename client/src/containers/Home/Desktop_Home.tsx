import React, {Component} from 'react'
import {createStyles, Theme, WithStyles} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import axios, {AxiosRequestConfig} from 'axios'

const styles = (_theme: Theme) => createStyles({
    ContainerRoot: {
        height: '100%',
        paddingLeft: '1rem',
        paddingRight: '2rem',
        maxWidth: 1600,
        paddingTop: 24
    }
})

interface InjectedProps extends WithStyles<typeof styles> {}

type HomeProps = InjectedProps

class DesktopHome extends Component<HomeProps, {}> {
    constructor(props: HomeProps) {
        super(props)
        console.log(process.env)
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `http://localhost:8080/customers`
        }
        axios.request(config)
        .then((res: any) => {
            console.log(res.data)
        })
        .catch((err: any) => {
            console.error(err)
        })
    }

    public render() {
        const {classes} = this.props
        return (
            <Container classes={{root: classes.ContainerRoot}}>
                <Box display={'flex'} pb={8}>
                    <Box  flexGrow={1}
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'flex-start'}
                    >
                        Home
                    </Box>
                </Box>
            </Container>
        )
    }
}

export default withStyles(styles)(DesktopHome)