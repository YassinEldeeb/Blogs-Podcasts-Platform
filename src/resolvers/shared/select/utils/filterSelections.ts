export const filterSelections = (select: any) => {
  delete select.accessToken
  return select
}
