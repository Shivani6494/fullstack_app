const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const StudentSchema = new Schema(
  {
    student_branch:String,
    student_name: String,
    student_email:String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Student", StudentSchema,"student_collection");