const router =require('express').Router()
const pinCtrl = require('../controllers/pin')


// crete pin 

router.post('/',pinCtrl.createPin)
router.get('/',pinCtrl.getPin)


module.exports = router

