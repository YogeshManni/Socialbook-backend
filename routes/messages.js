var express = require("express");
var router = express.Router();
var dbMessage = require("../db/db-messages");
var authenticateJWT = require("../lib/jwt");
let _dbo = null;

function getDbo() {
  if (!_dbo) {
    _dbo = new dbMessage(global.db);
  }
  return _dbo;
}

router.post("/addMessage", authenticateJWT, async function (req, res, next) {
  try {
    let result = await getDbo().addMessage(req.body);
    res.status(200).json({
      status: "success",
      message: "message added successfully!!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
});

router.post("/getMessages", authenticateJWT, async function (req, res, next) {
  try {
    let result = await getDbo().getMessages(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
});

module.exports = router;
