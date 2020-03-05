import React, {Component} from 'react'
import {MobileHeader_Comp} from './Mobile_Header'
import {DesktopHeader_Comp} from './Desktop_Header'

interface State {
    mobile: boolean
}

class Header extends Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            mobile: true
        }
        this.resize = this.resize.bind(this)
        this.setValue = this.setValue.bind(this)
    }
    public componentDidMount(): void {
        window.addEventListener('resize', this.resize)
        this.resize()
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
        const {mobile} = this.state
        return (
            <div>
                {mobile ?
                    <MobileHeader_Comp
                    />
                    :
                    <DesktopHeader_Comp
                    />
                }
            </div>
        )
    }
}

export const Header_Comp = Header