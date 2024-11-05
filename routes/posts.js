var express = require("express");
var router = express.Router();
var dbPosts = require("../db/db-posts");
const multer = require("multer");
var fs = require("fs");
var authenticateJWT = require("../lib/jwt");
let _dbo = null;

function getDbo() {
  if (!_dbo) {
    _dbo = new dbPosts(global.db);
  }
  return _dbo;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public/posts";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    let filename = req.body.name + file.originalname;
    filename = filename.replaceAll(":", "-");
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.post("/addPost", async function (req, res, next) {
  try {
    let result = await getDbo().addPost(req.body);
    res.status(200).json({
      status: "success",
      message: "post added successfully!!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
});

router.post(
  "/uploadImage",
  //upload.fields([{ name: "image-file", maxCount: 1 }]),
  async function (req, res) {
    try {
      res.status(200).json({
        status: "success",
        message: "File created successfully!!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

router.post("/", authenticateJWT, async function (req, res) {
  try {
    const posts = await getDbo().getPosts(req.body.email);
    res.status(200).json({
      posts: posts,
      status: "success",
      message: "File created successfully!!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post("/updateLikes", async function (req, res, next) {
  try {
    let result = await getDbo().updateLikes(req.body);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post("/stories", authenticateJWT, async function (req, res) {
  try {
    const posts = await getDbo().getStories(req.body.email);
    res.status(200).json({
      posts: posts,
      status: "success",
      message: "stories fetched successfully!!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
