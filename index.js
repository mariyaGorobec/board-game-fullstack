import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';


import {registerValidation, loginValidation, boardGameCreateValidation} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'
import * as BoardGameController from './controllers/BoardGameController.js'
import checkAuthAdmin from './utils/checkAuthAdmin.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.wrjrh3n.mongodb.net/boardGame?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK!"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_,__,cb)=>{
    cb(null, "uploads");
  },
  filename:(_,file,cb)=>{
    cb(null, file.originalname);
  }
});

const upload = multer({storage});

app.use(express.json());
app.uses('/uploads',express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.post('/auth/login',loginValidation, handleValidationErrors,UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors,UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads',checkAuthAdmin,upload.single('image'), (req,res)=>
{
  res.json({
    url: `uploads/${req.file.originalname},`
  });
});

app.get('/games',BoardGameController.getAll);
app.get('/games/:id',BoardGameController.getOne);
app.post('/games', checkAuthAdmin,boardGameCreateValidation,handleValidationErrors,BoardGameController.create);
app.delete('/games/:id', checkAuthAdmin,BoardGameController.remove);
app.patch('/games/:id', checkAuthAdmin,boardGameCreateValidation,handleValidationErrors,BoardGameController.update);


app.listen(4444, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK!')
});