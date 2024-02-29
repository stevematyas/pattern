const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: 'https://smee.io/HHrCPr4m2SbzfJJ',
  target: 'http://server:5001/services/webhook',
  logger: console
})

const events = smee.start()
