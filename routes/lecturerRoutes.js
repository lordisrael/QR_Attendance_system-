const express = require("express");
const router = express.Router();
const { createUser, login } = require('../controllers/lecturerctrl')
const {createAttendance, listAttended} = require('../controllers/attendanceCtrl')
const auth = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", login);
router.post ('/create-attendance',auth, createAttendance)
router.get("/attendance/:attendanceId", auth, listAttended);


module.exports = router;