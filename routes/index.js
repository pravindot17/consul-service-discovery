let express = require('express')
let request = require('request')
let router = express.Router()
let ConsulService = require('consul-service-wrapper')

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    let response = await ConsulService().getService('nodeapp')
    console.log('response', response)
    if (!response) throw new Error('No service found')
    let nodeAppServiceAddress = ConsulService().formatUri(response)

    console.log('nodeAppServiceAddress', nodeAppServiceAddress)
    callApi(nodeAppServiceAddress, (err, result) => {
      if (err) throw err
      result = JSON.parse(result)
      console.log(result.title)
      res.render('index', { title: result.title, serviceId: response.ServiceID })
    })
  } catch (err) {
    console.log('Got the error here', err)
    res.render('index', { title: err.message })
  }
})

function callApi (url, callback) {
  request(`http://${url}/hello`, function (error, response, body) {
    console.log('error:', error) // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
    console.log('body:', body) // prints the reusult
    callback(error, body)
  })
}

module.exports = router
