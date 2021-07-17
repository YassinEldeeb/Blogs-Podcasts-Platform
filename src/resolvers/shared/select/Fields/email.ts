import { PrismaSelect } from '@paljs/plugins'
import { keyExists } from '../utils/keyExists'

export const emailField = (select: any, info: any) => {
  if (keyExists(select, 'email')) {
    const defaultFields: any = { User: { id: true } }

    let { select: modifiedSelect } = new PrismaSelect(info, {
      defaultFields,
    }).value

    return modifiedSelect
  }

  return select
}
