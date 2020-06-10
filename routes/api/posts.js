const express = require("express");
const router = express.Router();

// @route GET api/posts
// @desc Test Route
// @access Pubic (No auth required)

router.get("/", (request, response) => {
  response.send("Posts Route..").status(200);
});

module.exports = router;
