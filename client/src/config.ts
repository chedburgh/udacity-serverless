// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'n8doe8weg5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev--2g7pmmb.eu.auth0.com',            // Auth0 domain
  clientId: 'y2zxyEfdVM56hUxUZDN7ETT3W9IBgOXH',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
