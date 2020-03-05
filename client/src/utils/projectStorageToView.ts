
export const projectStorageToView = (storage: number, precision: number): string => {
    return (storage / 1000000).toFixed(precision)
}

export const projectStorageNum = (storage: number): number => {
    return (storage / 1000000)
}