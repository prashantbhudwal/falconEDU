export const isEmptyObject = (obj: any) => Object.keys(obj).length === 0;
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
