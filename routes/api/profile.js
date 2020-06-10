const express = require("express");
const router = express.Router();

// @route GET api/profile
// @desc Test Route
// @access Pubic (No auth required)

router.get("/", (request, response) => {
  response.send("Profile Route..").status(200);
});

module.exports = router;