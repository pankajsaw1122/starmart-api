const express = require('express');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cors = require('cors')
const app = express();

app.use(cors());  
//Load routes
const admin = require('./routes/api/admin/admin');
// const imageUpload = require('./routes/api/uploads/imageUpload');
// const student = require('./routes/api/student/student');
// const fees = require('./routes/api/fees/fees');
// const studentList = require('./routes/api/student/studentList');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('./public'));

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});
// test
app.get('/test', (req, res) => {
    res.render('test');
});

// use routes
app.post('/adminRegister', admin);
app.post('/adminLogin', admin);
app.post('/adminChangePassword', admin);
app.post('/adminForgetPassword', admin);
app.post('/adminResetPassword', admin);

// app.use('/update', update);
// app.post('/imageUpload', imageUpload);
// app.post('/registerAdmin', admin);

// app.post('/studentAdmission', student);
// app.post('/updateStudentDetails', student);
// app.post('/deleteStudent', student);
// app.post('/searchStudent', student);
// app.post('/insertFees', fees);
// app.get('/studentList', studentList);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        err: err
    });
  });



const port = 5000;
app.listen(port, () => {
    console.log('server started on port: ' + port);
});
