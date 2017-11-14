export function hasValue(variable: any) {

    return variable != undefined &&
        variable != null &&
        variable != ""
}

export interface IDictionary<T> {
    [key: string]: T;
}

export function uuid() {
    return `OP_${Math.random()}_${Math.random()}`
}