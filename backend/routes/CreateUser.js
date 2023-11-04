const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = "Thistokenisforauthorizingpeople#123";

router.post('/createuser',
    body('email', 'Incorrect Email Format').isEmail(),
    body('password', 'Incorrect Password Format').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const salt = await bcrypt.genSalt(10);
            let secPassword = await bcrypt.hash(req.body.password, salt);

            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
                location: req.body.location,
            }).then(res.json({ success: true }))

        } catch (error) {
            console.log(error);
            res.json({ success: false })
        }
    })

router.post('/loginuser',
    body('email', 'Incorrect Email Format').isEmail(),
    body('password', 'Incorrect Password Format').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        let email = req.body.email;
        try {
            const userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: 'Enter valid credentials for logging' })
            }
            const pwdCompare = bcrypt.compare(req.body.password, userData.password);
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);

            if (!pwdCompare) {
                return res.status(400).json({ errors: 'Enter valid credentials for logging' })
            }
            return res.json({ success: true, authToken: authToken });
        } catch (error) {
            console.log(error);
            return res.json({ success: false });
        }

    }
)

module.exports = router;