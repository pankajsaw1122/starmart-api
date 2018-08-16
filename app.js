const express = require('express');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cors = require('cors')
const app = express();

app.use(cors());
//Load routes
// const imageUpload = require('./routes/api/uploads/imageUpload');
// const admin = require('./routes/api/admin/admin');
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
// app.use('/update', update);
// app.post('/imageUpload', imageUpload);
// app.post('/registerAdmin', admin);
// app.post('/adminLogin', admin);
// app.post('/studentAdmission', student);
// app.post('/updateStudentDetails', student);
// app.post('/deleteStudent', student);
// app.post('/searchStudent', student);
// app.post('/insertFees', fees);
// app.get('/studentList', studentList);

const port = 5000;
app.listen(port, () => {
    console.log('server started on port: ' + port);
});