export const filterSelections = (select: any) => {
  delete select.accessToken
  delete select.mutation
  delete select.deletedCommentId
  delete select.unFollowId
  delete select.deletedHeartId
  delete select.deletedPostId
  delete select.posts
  delete select.comments
  delete select.followers
  delete select.following

  return select
}
