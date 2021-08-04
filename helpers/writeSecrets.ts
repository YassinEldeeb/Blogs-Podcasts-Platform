import fs from 'fs'
import path from 'path'
import colors from 'colors'
import { getSecretFileData } from './lib/secretFileData'
import { getBaseDeplConfig } from './lib/baseDeplConfig'

let secretFileData = getSecretFileData()
let baseDeplConfig = getBaseDeplConfig()

let deplFileEnv = ``

fs.readFile(path.join(__dirname, '../config/prod.env'), 'utf8', (err, data) => {
  if (err) {
    console.log(colors.bgRed.inverse("Couldn't read prod.env!"))
    return
  }

  data.split('\n').forEach((line) => {
    const key = line.split('=')[0]
    const ignore = ['PG_USER', 'PG_PASSWORD', 'DB_NAME', 'DATABASE_URL']

    if (ignore.some((e) => e === key)) {
      return
    }

    const value = line.split('=')[1].replace(/"|'/g, '')

    const base64 = Buffer.from(value).toString('base64')

    // Appending yaml shebang
    secretFileData += `\n  ${key}: ${base64}`
    deplFileEnv += `\n            - name: ${key}\n              valueFrom:\n                secretKeyRef:\n                  name: graphql-secret\n                  key: ${key}`
  })

  fs.writeFileSync(
    path.join(__dirname, '../kubernetes/secrets/graphql-secret.yml'),
    secretFileData
  )

  const deploymentFile = baseDeplConfig.replace(
    '$((((INJECT_SECRETS))))',
    deplFileEnv
  )

  fs.writeFileSync(
    path.join(__dirname, '../kubernetes/deployments/graphql-depl.yml'),
    deploymentFile
  )

  console.log(colors.inverse.green('Secrets saved for Production!'))
})
