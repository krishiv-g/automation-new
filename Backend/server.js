const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const app = express();
const crypto = require('crypto');
const con = require('./helpers/mysql');
const scAuth = require('./helpers/steemconnect_call');
const selectExists = require('./helpers/select_exists');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access_key');
  next();
});

// Login endpoint
app.post('/api/v1/login', async (req, res) => {
  const accessToken = req.body.access_token;

  if (accessToken) {
    const result = await scAuth(accessToken);

    if (result && result.user) {
      const username = result.user;
      const accessKey = crypto.randomBytes(36).toString('hex');

      const exists = await con.query(
        'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=?)',
        [username]
      );

      if (selectExists(exists)) {
        await con.query(
          'UPDATE `users` SET `access_key`=? WHERE `user`=?',
          [accessKey, username]
        );
      } else {
        await con.query(
          'INSERT INTO `users`(`user`, `access_key`) VALUES (?, ?)',
          [username, accessKey]
        );
      }

      res.json({
        id: 1,
        result: 'success',
        access_key: accessKey,
        username
      });
    } else {
      res.json({
        id: 0,
        error: 'Wrong access_token provided'
      });
    }
  } else if (req.cookies.access_key && req.cookies.username) {
    const accessKey = req.cookies.access_key;
    const username = req.cookies.username;

    const result = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=? AND `access_key`=?)',
      [username, accessKey]
    );

    if (selectExists(result)) {
      res.json({
        id: 1,
        result: 'success'
      });
    } else {
      res.json({
        id: 0,
        error: 'Wrong access_key provided'
      });
    }
  } else {
    res.json({
      id: 0,
      error: 'required params missed'
    });
  }
});

// Logout endpoint
app.post('/api/v1/logout', (req, res) => {
  res.clearCookie('access_key');
  res.clearCookie('username');
  res.json({
    id: 1,
    result: 'success',
    message: 'Logged out successfully'
  });
});

const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

app.listen(port, host, () => {
  console.log(`Application started on ${host}:${port}`);
});
