import {isEmpty} from './empty'

export default <T extends any[]>(arr: T) => {
    if (isEmpty(arr)) {
        return []
    }
    return arr.reduce((acc: T[], cur: T) => acc.includes(cur) ? acc : acc.concat(cur), [])
}