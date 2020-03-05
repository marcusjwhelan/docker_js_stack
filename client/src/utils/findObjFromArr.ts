import getObjValue from './getObjValue'
export default <T extends any>(objs: T[], path: string, value: any): T => {
    return objs.reduce((acc: T, cur: T) => {
        if (getObjValue(cur, path) === value) {
            return cur
        } else {
            return acc
        }
    }, {} as T)
}