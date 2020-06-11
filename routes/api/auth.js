const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route GET api/auth
// @desc   Route
// @access Pubic (No auth required)

//Just add middleware
// if we try without passing token to this route
// it will fail with stating No token found ...401
router.get("/", auth, async (request, response) => {
  try {
    const user = await User.findById(request.user.id).select("-password");
    response.json(user);
  } catch (error) {
    console.error(error.message);
    response.status(500).send("Server Error");
  }
});

// @route POST api/auth
// @desc   Auth Route and get Auth
// @access Pubic (No auth required)
router.post(
  "/",
  [
    // Only Email and Password require for auth..
    // Make sure password is exist to verify
    check("email", "Please provide valid email").isEmail(),
    check("password", "Please is required").exists(),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;
    try {
      //TODO See if the user is exists
      let user = await User.findOne({ email });
      if (!user) {
        return response
          .status(400)
          .json({ message: "Invalid User Credential" });
      }

      //let's verify user email and password.
      // password that enter by user and password.user from db
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response
          .status(400)
          .json({ message: "Invalid User Credential" });
      }

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
