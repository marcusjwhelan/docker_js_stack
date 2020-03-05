import React from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core'

const useStyles = makeStyles((_theme: Theme) => createStyles({
    root: {
        display: 'flex'
    }
}))

export const Loading = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            Loading...
        </div>
    )
}