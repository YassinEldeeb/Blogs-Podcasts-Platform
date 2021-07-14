import { PrismaSelect } from '@paljs/plugins'
import { createParamDecorator } from 'type-graphql'

function Select() {
  return createParamDecorator(({ info }: any) => {
    const { select } = new PrismaSelect(info).value

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
