const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Goluisgoodbo&y';


//Route:-1 Create a user using: POST "api/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = false;

    // if there are errors, return bad request and the errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(404).json({success, error: error.array() });
    }

    // Check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(404).json({success, error: "Sorry a user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken  = jwt.sign(data, JWT_SECRET);
    

        //res.json(user)
        success = true;
        res.json({success, authtoken})

    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Internal server Error");
    }

})

// Route:-2 Authentication a user using: POST "api/auth/login". Doesn't require Auth
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(404).json({ error: error.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(404).json({error: "please try to login with connect credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(404).json({success, error: "please try to login with connect credentials"})
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken  = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken})


    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Internal server Error");
    }

})   


//Route:-3 Get Loggeding  user details using: POST "api/auth/getuser". Login required

router.post('/getuser', fetchuser, async (req, res) => {

try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
} catch (error) {
    console.error(error.massage);
    res.status(500).send("Internal server Error");
}
})


module.exports = router  