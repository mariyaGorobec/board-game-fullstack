import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import {registerValidation, loginValidation, boardGameCreateValidation} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'
import * as OrdersController from './controllers/OrdersController.js'
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



app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.post('/auth/login',loginValidation, handleValidationErrors,UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors,UserController.register);
app.get('/auth/me',checkAuth,UserController.getMe);


app.get('/games',ProductController.getAll);
app.get('/gameOne',ProductController.getOne);
app.post('/games', checkAuthAdmin,boardGameCreateValidation,handleValidationErrors,ProductController.create);
app.get('/game', checkAuthAdmin,ProductController.remove);
app.post('/gameEdit', checkAuthAdmin,boardGameCreateValidation,handleValidationErrors,ProductController.update);

app.get('/addToCart',checkAuth,UserController.addToCart);
app.get('/removeFromCart',checkAuth,UserController.removeFromCart);
app.get('/cart',checkAuth,UserController.userCartInfo);
app.get('/deleteCart',checkAuth,UserController.deleteCart);

app.get('/addToFavorites',checkAuth,UserController.addToFavorites);
app.get('/removeFromFavorites',checkAuth,UserController.removeFromFavorites);
app.get('/favorites',checkAuth,UserController.userFavoritesInfo );
app.get('/deleteFavorite',checkAuth,UserController.deleteFavorite);

app.get('/makeAnOrder',checkAuth,OrdersController.makeAnOrder);
app.get('/getOrders',checkAuth,OrdersController.getOrdersUser);
app.get('/allOrders',checkAuthAdmin,OrdersController.getAllOrders);

app.listen(5555, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK!')
});