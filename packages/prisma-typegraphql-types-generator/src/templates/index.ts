export const INDEX_TEMPLATE = (
  CLASSES: string,
  IMPORTS?: string
) => `import { Field, ID, ObjectType } from 'type-graphql'
${IMPORTS ? IMPORTS : ''}

${CLASSES}`
