var express = require("express");
var router = express.Router();
var dbEvents = require("../db/db-events");

let _dbo = null;

function getDbo() {
  if (!_dbo) {
    _dbo = new dbEvents(global.db);
  }
  return _dbo;
}

router.get("/", async function (req, res, next) {
  var events = await getDbo().getEvents();
  res.status(200).send(events);
});

router.post("/addEvent", async function (req, res, next) {
  console.log(req.body);
  try {
    let events = await getDbo().addEvent(req.body);
    res.status(200).send(`event added to db`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/updateEvent", async function (req, res, next) {
  console.log(req.body);
  try {
    let events = await getDbo().updateEvent(req.body);
    res.status(200).send(`event updated in db`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/discussion/addDiscussions", async function (req, res, next) {
  console.log(req.body);
  try {
    let disc = await getDbo().addDiscussion(req.body);
    res.status(200).send(disc[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/discussion", async (req, res, next) => {
  try {
    var disc = await getDbo().getDiscussions();
    console.log(disc);
    res.status(200).send(disc);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/comments/addComments", async function (req, res, next) {
  try {
    let comm = await getDbo().addComments(req.body);
    res.status(200).send(comm[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/getComments/:id/:type", async (req, res, next) => {
  try {
    const discId = req.params.id;
    const type = req.params.type;
    var comms = await getDbo().getComments(discId, type);
    res.status(200).send(comms);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/getEventComments/:id/:type", async (req, res, next) => {
  try {
    const discId = req.params.id;
    const type = req.params.type;
    var comms = await getDbo().getComments(discId, type);
    res.status(200).send(comms);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/discussion/updateLikes", async function (req, res, next) {
  try {
    let result = await getDbo().updateLikes(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/updateLikes", async function (req, res, next) {
  try {
    let result = await getDbo().updateEventLikes(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/updateViews", async function (req, res, next) {
  try {
    let result = await getDbo().updateEventViews(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/discussion/addDiscussionsComm", async function (req, res, next) {
  try {
    let disc = await getDbo().addDiscussionComm(req.body);
    res.status(200).send({ msg: "Comment saved" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get(
  "/discussion/getDiscussionsComm/:id",
  async function (req, res, next) {
    try {
      let data = await getDbo().getDiscussionComm(req.params.id);
      res.status(200).send({ data: data });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
