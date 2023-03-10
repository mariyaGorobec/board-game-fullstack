import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';


import {registerValidation, loginValidation, boardGameCreateValidation} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'

import * as ProductController from './controllers/ProductController.js'
import checkAuthAdmin from './utils/checkAuthAdmin.js';
import handleValidationErrors from './utils/handleValidationErrors.js';



mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.wrjrh3n.mongodb.net/boardGame?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK!"))
  .catch((err) => console.log("DB error", err));

const app = express();
app.use(cors());






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
app.use('/uploads',express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.post('/auth/login',loginValidation, handleValidationErrors,UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors,UserController.register);
app.post('/auth/me',UserController.getMe);

app.post('/uploads',checkAuthAdmin,upload.single('image'), (req,res)=>
{
  res.json({
    url: `uploads/${req.file.originalname},`
  });
});

app.get('/games',ProductController.getAll);
app.get('/games/:id',ProductController.getOne);
app.post('/games', checkAuthAdmin,boardGameCreateValidation,handleValidationErrors,ProductController.create);
app.delete('/games/:id', checkAuthAdmin,ProductController.remove);
app.patch('/games/:id', checkAuthAdmin,boardGameCreateValidation,handleValidationErrors,ProductController.update);



app.get('/addToCart',checkAuth,UserController.addToCart);
app.get('/removeFromCart',checkAuth,UserController.removeFromCart);
app.get('/cart',checkAuth,UserController.userCartInfo);
app.get('/deleteCart',checkAuth,UserController.deleteCart);
//app.post('/cart',CartGameController.addToCart);

app.get('/addToFavorites',checkAuth,UserController.addToFavorites);
app.get('/removeFromFavorites',checkAuth,UserController.removeFromFavorites);
app.get('/favorites',checkAuth,UserController.userFavoritesInfo );
app.get('/deleteFavorite',checkAuth,UserController.deleteFavorite);

app.get('/addToOrders',checkAuth,UserController.addToOrders);
app.get('/orders',checkAuth,UserController.getOrders);

app.listen(5555, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK!')
});