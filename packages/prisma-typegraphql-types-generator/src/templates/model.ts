export const MODEL_TEMPLATE = (
  CLASSNAME: string,
  FIELDS: string,
  CUSTOMFIELDS: string = '  // skip overwrite 👇'
) => {
  return `@ObjectType()
export class ${CLASSNAME} {
${FIELDS}
${CUSTOMFIELDS}
}`
}
