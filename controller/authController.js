const User = require('../models/User')
const cryptoJS = require('crypto-js');
module.exports = {
    createUser: async (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            age: req.body.age,
            password: cryptoJS.AES.encrypt( req.body.password, process.env.SECRET_KEY).toString(),
        });

        try {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).json(error)
        } 
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            !user && res.status(401).json({ messase: "Email không tồn tại"})

            const de_pass = cryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
            const depassword = de_pass.toString(cryptoJS.enc.Utf8);

            depassword != req.body.password && res.status(401).json({ messase: "Sai mật khẩu"})

            res.status(200).json({ user: user})
        } catch(error) {
            res.status(500)
        }
    }
}