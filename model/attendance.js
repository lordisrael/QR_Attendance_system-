// models/attendance.js

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  course_title: { type: String, required: true },
  course_duration: { type: String, required: true },
  start_time: { type: Date, default: Date.now },
  course_topic: { type: String, required: true },
  course_code: { type: String, required: true },
  topic_description: { type: String, required: true },
  qr: { type: String, required: true }, // URL of the QR code image
  attended_students: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  ], // Array of student IDs who attended
});


const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
