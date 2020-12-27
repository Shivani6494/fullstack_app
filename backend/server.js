const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const Student = require('./student');
// const person = require('./person');
// const Person = require('./person');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
//'mongodb://127.0.0.1:27017/test?compressors=snappy&gssapiServiceName=mongodb';
'mongodb+srv://root:root@cluster0.cgv2o.mongodb.net/test?retryWrites=true&w=majority'
// 'mongodb://127.0.0.1:27017/testdb?retryWrites=true&w=majority'
// 'mongodb://brad:1234@/127.0.0.1:27017/test';
// 'mongodb+srv://root:root@cluster0.kw5tv.gcp.mongodb.net/fullstack_app?retryWrites=true&w=majority';
// db.createUser({
// 	user: "brad",
// 	pwd : "1234",
// 	roles : ["readWrite","dbAdmin"]
// })
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/students-list', (req, res) => {
  Student.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    // console.log(res.json(data));
    return res.json(data);
  });
});


// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/update-student/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  const update = req.body;
  Student.findByIdAndUpdate(id , update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.delete('/delete-student', (req, res) => {
  const { id } = req.body;
  Student.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post('/save-student', (req, res) => {
  console.log(req.body);
  let student = new Student();

  const { student_branch, student_name,student_email } = req.body;

  if ((!student_name && student_name !== 0) || !student_email || !student_branch) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  student.student_branch = student_branch;
  student.student_name = student_name;
  student.student_email = student_email;
  student.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));