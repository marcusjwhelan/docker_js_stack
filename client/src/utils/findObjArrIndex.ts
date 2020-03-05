import getObjValue from './getObjValue'
export default <T extends any>(objs: T[], path: string, value: any): number => {
    return objs.reduce((acc: number, cur: T, ind: number) => {
        if (getObjValue(cur, path) === value) {
            return ind
        } else {
            return acc
        }
    }, 0)
}