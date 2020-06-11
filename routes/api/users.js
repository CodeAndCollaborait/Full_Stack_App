const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// @route POST api/users
// @desc  Register Route
// @access Pubic (No auth required)

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please provide valid email").isEmail(),
    check("password", "Please Enter Valid 6 char password").isLength({
      min: 6,
    }),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = request.body;
    try {
      //TODO See if the user is exists
      let user = await User.findOne({ email });
      if (user) {
        return response.status(400).json({ message: "User already exists" });
      }
      //TODO Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //TODO Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //TODO return jsonWebToken ...
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (error, token) => {
          if (error) {
            throw error;
          }
          response.json({ token }).status(201);
        }
      );
    } catch (error) {
      console.error(error.message);
      response.status(500).send("Server Error");
    }
  }
);

module.exports = router;
