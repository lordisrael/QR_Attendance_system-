const Attendance = require('../model/attendance')
var QRCode = require("qrcode");
const asyncHandler = require("express-async-handler");

const createAttendance = asyncHandler(async (req, res) => {
  try {
    // Generate QR code based on attendance details
    const qrCodeData = JSON.stringify(req.body);
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Create new attendance entry
    const newAttendance = new Attendance({
      course_title: req.body.course_title,
      course_duration: req.body.course_duration,
      course_topic: req.body.course_topic,
      course_code: req.body.course_code,
      topic_description: req.body.topic_description,
      qr: qrCodeImage,
    });

    // Save attendance entry to the database
    const savedAttendance = await newAttendance.save();

    res.json(savedAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const scanQR = asyncHandler (async (req, res) => {
  try {
    const { qrCodeData } = req.body;
    const studentId = req.user.id

    // Find attendance entry corresponding to the scanned QR code
    const attendance = await Attendance.findOne({ qr: qrCodeData });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    // Add the student ID to the array of attended students
    if (!attendance.attended_students.includes(studentId)) {
      attendance.attended_students.push(studentId);
      await attendance.save();
    } else {
      return res.status(404).json({ message: "Student already scanned the qr" });
    }

    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const listAttended = asyncHandler(async(req, res) => {
     try {
       // Find the attendance record by ID
       const attendance = await Attendance.findById(
         req.params.attendanceId
       ).populate("attended_students", "full_name matric_no"); // Populate the attended_students field with student details

       if (!attendance) {
         return res
           .status(404)
           .json({ message: "Attendance record not found" });
       }

       // Prepare the response
       const response = {
         course_title: attendance.course_title,
         course_code: attendance.course_code,
         course_topic: attendance.course_topic,
         topic_description: attendance.topic_description,
         attended_students: attendance.attended_students.map((student) => ({
           full_name: student.full_name,
           matric_no: student.matric_no,
         })),
       };

       res.json({ status: "Success", data: response });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Server Error" });
     }
})

module.exports ={
  createAttendance,
  scanQR,
  listAttended
}