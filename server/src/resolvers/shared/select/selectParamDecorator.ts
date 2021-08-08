import { PrismaSelect } from '@paljs/plugins'
import { createParamDecorator } from 'type-graphql'
import { filterSelections } from './utils/filterSelections'

function Select(required: any = {}, getNestedSelect: boolean = true) {
  return createParamDecorator(({ info }: any) => {
    let { select } = new PrismaSelect(info, {
      defaultFields: { ...required, User: { id: true } },
    }).value

    select = filterSelections(select)

    if (!Object.keys(select).length) {
      select = { id: true }
    }

    if (select?.user?.select && getNestedSelect) {
      return select.user.select
    }

    if (select?.data?.select && getNestedSelect) {
      return select.data.select
    }

    return select
  })
}

export { Select }
