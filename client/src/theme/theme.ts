import {createMuiTheme} from '@material-ui/core/styles'

// @ts-ignore
export const HMTheme = createMuiTheme({
    breakpoints: {
        'keys': ['xs', 'sm', 'md', 'lg', 'xl'],
        'values': {
            'xs': 0,
            'sm': 600,
            'md': 960,
            'lg': 1280,
            'xl': 1920
        }
    },
    mixins: {
        toolbar: {
            'minHeight': 56,
            '@media (min-width:0px) and (orientation: landscape)': {
                'minHeight': 48
            },
            '@media (min-width:600px)': { 'minHeight': 64 }
        }
    },
    transitions: {
        easing: {
            'easeInOut': 'cubic-bezier(0.4, 0, 0.2, 1)',
            'easeOut': 'cubic-bezier(0.0, 0, 0.2, 1)',
            'easeIn': 'cubic-bezier(0.4, 0, 1, 1)',
            'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)'
        },
        duration: {
            'standard': 300,
            'short': 250,
            'enteringScreen': 225,
            'shorter': 200,
            'leavingScreen': 195,
            'shortest': 150,
            'complex': 375
        }
    },
    typography: {
        fontFamily: '"Helvetica Light", "Roboto", "Arial", sans-serif',
        fontSize: 18,
        fontWeightLight: 500,
        fontWeightRegular: 600,
        fontWeightMedium: 700
    },
    zIndex: {
        mobileStepper: 1000,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500
    },
    shape: {
        'borderRadius': 4
    },
    props: {
    },
    overrides: {
        MuiInputBase: {
            input: {
                '&:-webkit-autofill': {
                    transitionDelay: '9999s',
                    transitionProperty: 'background-color, color'
                }
            }
        }
    },
    palette: {
        tonalOffset: 0.2,
        background: {
            default: '#212121',
            paper: '#616161'
        },
        contrastThreshold: 3,
        grey: {
            '50': '#fafafa',
            '100': '#f5f5f5',
            '200': '#eeeeee',
            '300': '#e0e0e0',
            '400': '#bdbdbd',
            '500': '#9e9e9e',
            '600': '#757575',
            '700': '#616161',
            '800': '#424242',
            '900': '#212121',
            'A700': '#616161',
            'A100': '#d5d5d5',
            'A400': '#303030',
            'A200': '#aaaaaa'
        },
        text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
            hint: 'rgba(255, 255, 255, 0.5)',
            icon: 'rgba(255, 255, 255, 0.5)'
        },
        divider: 'rgba(255, 255, 255, 0.40)',
        primary: {
            'main': '#116c8f',
            'light': '#279bc0',
            'dark': '#064d6e',
            'contrastText': '#fff'
        },
        secondary: {
            'main': '#ae007d',
            'light': '#ca53a0',
            'dark': '#82006e',
            'contrastText': '#fff'
        },
        common: {
            'black': '#000',
            'white': '#fff'
        },
        error: {
            'light': '#ec7273',
            'main': '#ee3333',
            'dark': '#cf2026',
            'contrastText': '#fff'
        },
        type: 'dark',
        action: {
            active: '#fff',
            hover: 'rgba(255, 255, 255, 0.1)',
            hoverOpacity: 0.1,
            selected: 'rgba(255, 255, 255, 0.2)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)'
        }
    }
})
