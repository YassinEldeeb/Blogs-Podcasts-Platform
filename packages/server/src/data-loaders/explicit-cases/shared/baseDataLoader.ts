import { prisma } from '@prismaInstance'
import { models } from '@Types/enums/models'
import DataLoader from 'dataloader'

interface DataLoaderArgs {
  uniqueId: string
  additionalWhere?: any
  model: models
}

interface data {
  id: string
  select: any
  args: any
}

const baseBatch = <T = any>({
  uniqueId,
  model,
  additionalWhere,
}: DataLoaderArgs) => {
  const batchData: any = async (data: data[]) => {
    const select = data[0].select
    const args = data[0].args

    const ids = data.map((e) => e.id)
    select[uniqueId] = true

    const where: any = { ...(additionalWhere || {}) }
    where[uniqueId] = { in: ids }

    const records = await (prisma[model] as any).findMany({
      where,
      cursor: args.cursorId ? { id: args.cursorId } : undefined,
      take: args.take,
      skip: args.skip,
      orderBy: args.orderBy,
      select,
    })

    const dataMap: any = []

    records.forEach((post: any) => {
      if (dataMap[post[uniqueId]]) {
        dataMap[post[uniqueId]].push(post)
      } else {
        dataMap[post[uniqueId]] = [post]
      }
    })

    return ids.map((e: any) => dataMap[e] || [])
  }

  const dataLoader = () => new DataLoader<data, T[]>(batchData)

  return dataLoader()
}

export { baseBatch }
