import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

import {registerValidation, loginValidation} from './validations/validations.js';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';
import User from './models/User.js';

import {register, login, getMe} from './controllers/UserController.js'

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.wrjrh3n.mongodb.net/boardGame?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK!"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/login',loginValidation, login);

app.post('/auth/register', registerValidation,register);
app.get('/auth/me', checkAuth, getMe);

app.listen(4444, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK!')
});