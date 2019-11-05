const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
require('./config/passport');

const app = express();
const io = require('socket.io')();
app.io = io;

let playerArray = [];
app.io.on('connection', function(socket){
  let checkUser = false;
  socket.on('add-player', function(data){
    for(let i = 0; i < playerArray.length; i++){
      if(playerArray[i].username === data){
        checkUser = true;
        break;
      }
    }
    if(checkUser === false){
      playerArray.push({'socketID': socket.id, 'username': data});
      console.log(playerArray);
      io.sockets.emit('list-player', playerArray);
    }
  });

  socket.on('disconnect', function(){
    for(let i = 0; i < playerArray.length; i+=1){
      if(playerArray[i].socketID === socket.id){
        playerArray.pop(playerArray[i]);
        io.sockets.emit('list-player', playerArray);
      }
    }
    console.log(playerArray);
  });

});

//connect to mongodb
const connectString = 'mongodb+srv://BaoDang:baodang0305@cluster0-v4b2n.mongodb.net/my-database';
mongoose.Promise = Promise;
const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoReconnect: true,
  reconnectTries: 1000000,
  reconnectInterval: 3000
};
const run = async() =>{
  await mongoose.connect(connectString, option, function(err){
    if(err) console.log(err)
    console.log('connected');
  });
}
run().catch(error => console(error));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

