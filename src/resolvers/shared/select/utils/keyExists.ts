import _ from 'lodash'

export const keyExists = (obj: any, key: any) => {
  const res: any = []
  return !!(
    _.cloneDeepWith(obj, (v: any, k: any) => {
      k == key && res.push(v)
    }) && res
  ).length
}
