import { PrismaSelect } from '@paljs/plugins'
import { createParamDecorator } from 'type-graphql'
import { emailField } from './Fields/email'

function Select(required: any = {}) {
  return createParamDecorator(({ info }: any) => {
    let { select } = new PrismaSelect(info, { defaultFields: { ...required } })
      .value

    select = emailField(select, info)

    if (select?.user?.select) {
      return select.user.select
    }

    if (select?.data?.select) {
      return select.data.select
    }

    return select
  })
}

export { Select }
