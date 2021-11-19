import fs from 'fs'
import path from 'path'

const capitalize = (s: string) => {
  return s && s[0].toUpperCase() + s.slice(1)
}

const format = (s: string) => {
  return s
    .replace('.yml', '')
    .split('-')
    .map((e) => capitalize(e))
    .join(' ')
}

const dirContent = fs.readdirSync(path.join(__dirname, '../kubernetes'))

const KUBECTL_COMMAND_TEMPLATE = (fileName: string) =>
  `kubectl apply -f ./kubernetes/${fileName}`

const scriptsArr: string[] = []

const files = dirContent.filter((e) => e.endsWith('.yml'))

files.forEach((e) => {
  scriptsArr.push(`# Apply ${format(e)}`)
  scriptsArr.push(KUBECTL_COMMAND_TEMPLATE(e))
})

const folders = dirContent.filter((e) => !e.endsWith('.yml'))

folders.forEach((folder) => {
  const dirContent = fs.readdirSync(
    path.join(__dirname, `../kubernetes/${folder}`)
  )

  scriptsArr.push(`# Apply ${capitalize(folder)}`)
  dirContent.forEach((e) => {
    scriptsArr.push(KUBECTL_COMMAND_TEMPLATE(`${folder}/${e}`))
  })
})

const content = `#!/bin/bash
${scriptsArr.join('\n')}
# Scale GraphQL Server horizontally
kubectl scale deployment graphql --replicas=0
kubectl scale deployment graphql --replicas=2`

fs.writeFileSync(path.join(__dirname, '../run.k8s.sh'), content)
