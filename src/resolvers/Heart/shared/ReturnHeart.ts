import { CREATED, DELETED } from '../../../@types/enums/mutationType'
import { prisma } from '../../../prisma'
import { HeartPublishedData } from '../subscription/heartPublished'
import { heartMutationType } from '../subscription/heartSubscriptionPayload'

export const ReturnHeart = async (data: HeartPublishedData, select: any) => {
  let post = null

  if (data.mutation !== DELETED) {
    post = (await prisma.heart.findUnique({
      where: { id: data.id },
      select: { ...select },
    })) as any
  }

  if (data.mutation === CREATED) {
    return {
      data: post,
      mutation: heartMutationType.LIKED,
    }
  } else {
    return {
      data: post,
      deletedHeartId: data.deletedHeartId,
      mutation: heartMutationType.DISLIKED,
    }
  }
}
