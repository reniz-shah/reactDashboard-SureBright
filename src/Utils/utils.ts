export const convertObjToFieldValues = (obj: any) => {
    return Object.keys(obj).map((key) => {
        return {
            field: key,
            value: obj[key],
        }
    })
}