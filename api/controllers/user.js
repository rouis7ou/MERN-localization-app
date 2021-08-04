const User = require('../models/user')
const bcrypt = require('bcrypt')
const { findOne } = require('../models/user')

const userCtrl ={
    register: async(req,res)=>{
        try {
            const passwordHash = await bcrypt.hash(req.body.password, 12) 

            const newUser= new User ({name:req.body.name,
                email:req.body.email, 
                password:passwordHash})



            const user = await newUser.save()
           
                      
            res.status(200).json({msg:"User successful created"})
        } catch (err) {
            res.status(500).json({msg: err.message})

        }
    },
    login:async(req,res)=>{
        try {
            const user = await User.findOne({name: req.body.name})
            if( !user)
            return res.status(500).json({msg: "wrong user name or password"})
            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if(!isMatch) return res.status(400).json({msg: "wrong user name or password"})

            res.status(200).json({_id:user._id,name:user.name})
        } catch (err) {
            res.status(500).json({msg: err.message})
        }
    }

}

module.exports = userCtrl