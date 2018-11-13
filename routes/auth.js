const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const authenticate = require("../middleware/auth");
const bcrypt = require("bcryptjs");

module.exports = (app) =>{
    // Register Route    
    app.post('/api/register', (req, res) => {
        if (req.body.password !== req.body.passwordConf) {
            res.status(403).send({
                errorMessage: "Password and Password Confirmation Do Not Match"
            });
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password
        })

        user.save()
            .then((result) => {
                return user.generateAuthToken()
            })
            .then((token) => {
                res.header('x-auth', token).send(user)
            })
            .catch(err => {
                res.status(400).send(err);
            });
    })

    app.post('/api/login', (req, res) => {
        const email = req.body.email
        const password = req.body.password

        User.findByCredentials(email, password)
            .then(user => {
                return user.generateAuthToken()
                    .then(token => {
                        res.header('x-auth', token).send(user)
                    })
            }).catch(err => {
                res.status(403).send({
                    errorMessage: 'Invalid Login'
                })
            })
    })
};
