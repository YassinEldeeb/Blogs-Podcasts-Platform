//@ts-nocheck
import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import extract from 'extract-zip'
import path from 'path'

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
const TOKEN_PATH = path.join(__dirname, '../gmail/token.json')
const CREDENTIALS_PATH = path.join(__dirname, '../gmail/credentials.json')

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err)
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), findMessages)
})

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

function findMessages(auth) {
  var gmail = google.gmail('v1')
  gmail.users.messages.list(
    {
      auth: auth,
      userId: 'me',
      maxResults: 1,
      q: 'Backup',
    },
    function (err, response) {
      printMessage(response.data.messages[0].id, auth)
    }
  )
}

function printMessage(messageID, auth) {
  var gmail = google.gmail('v1')
  gmail.users.messages.get(
    {
      auth: auth,
      userId: 'me',
      id: messageID,
    },
    function (err, response) {
      printAttach(messageID, response.data.payload.body.attachmentId, auth)
    }
  )
}

function printAttach(messageID, attachID, auth) {
  var gmail = google.gmail('v1')
  gmail.users.messages.attachments.get(
    {
      auth: auth,
      userId: 'me',
      id: attachID,
      messageId: messageID,
    },
    async function (err, response) {
      fs.writeFile(
        'restore.zip',
        response?.data?.data,
        'base64',
        function (err) {
          if (err) console.log(err)
          restore()
        }
      )
    }
  )
}

const restore = async () => {
  await extract(path.join(__dirname, '../restore.zip'), {
    dir: path.join(__dirname, '../restore'),
  })

  // Remove zipped backup
  fs.unlinkSync(path.join(__dirname, '../restore.zip'))
  fs.rmSync(path.join(__dirname, '../restore'), { recursive: true })
}
