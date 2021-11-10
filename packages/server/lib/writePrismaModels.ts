import path from 'path'
import fs from 'fs'
import colors from 'colors'
import { String } from 'lodash'

fs.readFile(
  path.join(__dirname, '../prisma/schema.prisma'),
  'utf8',
  (err, data) => {
    if (err) {
      console.log(colors.bgRed.inverse("Couldn't read prisma schema!"))
      return
    }

    let modelCodeBlock = false
    let enumCodeBlock = false
    let globalEnumName: string
    let privateField = false
    let generatedModels = `
        import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
    `

    const switchTypes = (type: string) => {
      const switchableTypes = ['String', 'Int', 'Float', 'Boolean', 'DateTime']
      if (switchableTypes.includes(type)) {
        switch (type) {
          case 'String':
            return 'string'
          case 'Boolean':
            return 'boolean'
          case 'Int':
            return 'number'
          case 'Float':
            return 'number'
          case 'DateTime':
            return 'Date'
        }
      } else {
        return type
      }
    }

    data.split('\n').forEach((line) => {
      if (line.includes('@private')) {
        privateField = true
      } else {
        if (line.includes('model') || modelCodeBlock) {
          if (!modelCodeBlock) {
            generatedModels += '\n@ObjectType()'
          }
          modelCodeBlock = true
          const model = line.split(' ')[1]

          if (line.includes('model')) {
            generatedModels += `\n export class ${model} {`
          } else {
            const fields = line
              .split(' ')
              .filter((e) => e !== '')
              .map((e) => e.replace('\r', ''))

            const type = fields[1]?.replace('[]', '').replace('?', '')

            if (type) {
              const isOptional = fields[1].includes('?')
              const isArray = fields[1].includes('[]')
              const isID = line.includes('@id')

              generatedModels += `\n 
            ${
              privateField
                ? ''
                : `@Field(${
                    isArray
                      ? `() => [${
                          //@ts-ignore
                          switchTypes(type)?.charAt(0)?.toUpperCase() +
                          //@ts-ignore
                          switchTypes(type)?.slice(1)
                        }]`
                      : isID
                      ? `() => ID`
                      : ''
                  } ${isOptional && isArray ? ', ' : ''} ${
                    isOptional ? '{ nullable:true }' : ''
                  })`
            }
            ${fields[0]}${isOptional ? '?' : ''}:${switchTypes(type)}${
                isArray ? '[]' : ''
              }`
            }
          }

          if (privateField) {
            privateField = false
          }
          if (line.includes('}')) {
            generatedModels += '}\n'
            modelCodeBlock = false
          }
        } else if (line.includes('enum') || enumCodeBlock) {
          if (line.includes('{')) {
            enumCodeBlock = true
          }
          const enumName = line.split(' ')[1]
          if (enumName) {
            globalEnumName = enumName
          }
          if (line.includes('enum')) {
            generatedModels += `\nenum ${enumName} {`
          } else {
            if (!line.includes('}')) {
              const enumValue = line.trim()
              generatedModels += `${enumValue} = '${enumValue}',`
            }
          }

          if (line.includes('}')) {
            generatedModels += `}\n
                registerEnumType(${globalEnumName}, {
                name: '${globalEnumName}',
            })\n`
            enumCodeBlock = false
          }
        }
      }
    })
    fs.writeFileSync(
      path.join(__dirname, '../src/models/generated.ts'),
      generatedModels,
    )
    console.log(
      colors.bold.magenta(
        'TypeGraphQL Models and enums were generated successfuly from Prisma Schema!',
      ),
    )
  },
)
