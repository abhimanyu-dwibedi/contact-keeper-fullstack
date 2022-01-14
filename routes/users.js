const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { findOne } = require("mongoose");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// calling schema/constructor from models/user folder as mongose scehema
var User = require("../models/Users");
const Users = require("../models/Users");

const config = require("config");
// console.log(User.find());

// route post api/users
// desc  regiseter a user
// acesss public
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check(
      "password",
      "please enter password of char more then 6 char"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await Users.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "user already exists" });
      }
      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSercet"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
