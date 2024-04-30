const express = require("express");
const router = express.Router();
const {createUser, login} = require('../controllers/studentCtrl')
const { scanQR } = require("../controllers/attendanceCtrl");
const auth = require('../middleware/authMiddlewareStudent')

router.post("/register", createUser);
router.post("/login", login);
router.put("/scan-qr", auth, scanQR);

module.exports = router;
