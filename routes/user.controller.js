// imports
var bcrypt = require('bcrypt');
var jwtUtils= require('../utils/jwt.utils');
var models = require('../models');

// Routes
module.exports = {
    register: function(req, res){
        // params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if(email == null || password == null || username == null){
            res.status(400).json({'error':'missing parameters'});
        }

        // verify users, passwords
        models.User.findOne({
            attributes: ['email'],
            where:{email:email}
        })
        .then(function(userFound){
            if(!userFound){
                bcrypt.hash(password,5,function(err, bcryptedPassword){
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then(function(newUser){
                        res.status(201).json({
                            'userID': newUser.id
                        });
                    })
                    .catch(function(err){
                        res.status(500).json({'error': 'cannot add user'})
                    });
                })
            }else{
                res.status(500).json({'error': 'user already exists'})
            }
        })
        .catch(function(err){
            res.status(500).json({'error': 'unable to verify users'});
        })
    },

    login: function(req, res){

        var email = req.body.email;
        var password = req.body.password;

        if(email == null || password == null ){
            res.status(400).json({'error':'missing parameters'});
        }

        // verify users, passwords
        models.User.findOne({
            where:{email:email}
        }).then(function(userFound){
            if(userFound){
                bcrypt.compare(password, userFound.password, function(errBcrypt, resBcrypt){
                    if(resBcrypt){
                        res.status(200).json({
                            'userID': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    }else{
                        res.status(403).json({'error': 'invalid password'})
                    }
                })

            }else{
                res.status(400).json({'error':'user not found in DB'});
            }
        }).catch(function(err){
            res.status(500).json({'error':'enable to veerify user'})
        })

    }
}