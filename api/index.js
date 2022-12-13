var router = require('express').Router()
var bodyParser = require('body-parser')

router.use(bodyParser.json())

router.get('/ping', function (req, res, next) {
  var obj = {};
  obj.status = 'ok';
  obj.envname = process.env.ENVIRONMENT_NAME;
  obj.region = process.env.REGION_NAME;
  res.json(obj);
});

module.exports = router
