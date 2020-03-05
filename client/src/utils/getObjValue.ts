export default (obj: any, path: string) => {
    return path.split('.').reduce((o, i) => {
        if (o !== undefined) {
            return o[i]
        }
    }, obj)
}