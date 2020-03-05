export interface IControlErrorHandler {
    // snackbar show
    success: boolean
    info: boolean
    warning: boolean
    error: boolean
    // snackbar messages
    successMessage: string
    infoMessage: string
    warningMessage: string
    errorMessage: string
    // methods
    EH_openSnackbar: (type: string) => void
    EH_closeSnackbar: (type: string, reason?: string) => void
    EH_setValue: (key: string, value: any) => void
}