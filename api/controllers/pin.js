const Pin = require ('../models/pin')

const pinCtrl= {

    createPin:async(req,res)=>{
        const newPin =new Pin(req.body)
        try {
            const savedPin =await newPin.save();
            res.status(200).json(savedPin);

        } catch (err) {
            res.status(500).json({msg: err.message})
        }
    },
    getPin:async(req,res) =>{
        try {
            const pins=await Pin.find();
            res.status(200).json(pins)
            
        } catch (err) {
            res.status(500).json({msg: err.message})

        }
    }

}

module.exports= pinCtrl