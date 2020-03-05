import React from 'react'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window
    children: React.ReactElement
}

export default function HideOnScroll(props: Props) {
    const { children, window } = props
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window. this needs to be passed as reference to use this
    const trigger = useScrollTrigger({ target: window ? window() : undefined })
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}
