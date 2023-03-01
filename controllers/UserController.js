import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';
import UserModel from '../models/User.js';
import Product from '../models/Product.js';
import { getNextKeyDef } from '@testing-library/user-event/dist/keyboard/getNextKeyDef.js';
import User from '../models/User.js';



export const register = async (req,res)=>{
    try{
     
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
   
    const doc = new UserModel({
       email: req.body.email,
       name: req.body.name,
       patronymic: req.body.patronymic,
       lastName: req.body.lastName,
       role:req.body.role,
       passwordHash: hash,
       cart: req.body.cart,
       favorites: req.body.favorites
    });
   
    const user = await doc.save();
   
    const token = jwt.sign({
       _id: user._id,
       role: user.role
    }, 'secret123',{
       expiresIn: '30d',
    });
   
   const {passwordHash, ...userData} = user._doc
   
    res.json({
       ...userData,
       token,
    }
    )
    }
    catch(err){
       console.log(err);
       res.status(500).json({
           message: 'Не удалось зарегистрироваться',
       });
    }
   }; 


export const auth = async (req,res)=>{
    try{
        res.status(200).json({
            _id: req.user._id,
            isAdmin: req.user.role === true ? false : true,
            isAuth: true,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            image: req.user.image,
            cart: req.user.cart,
            favorites: req.user.favorites
        });
    }
    catch{}
}
export const login = async (req,res)=>{
    try{
        const user = await UserModel.findOne({
            email:req.body.email
        })
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
    
        const isValidPass = await bcrypt.compare(
            req.body.password, user._doc.passwordHash
        );
    
        if(!isValidPass){
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign({
            _id: user._id,
            role: user.role
         }, 'secret123',{
            expiresIn: '30d',
         });
         const {passwordHash, ...userData} = user._doc
    
     res.json({
        ...userData,
        token
     }
     );
    
    }catch (err){console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });}
    };

export const getMe =  async(req,res)=>{
    try{
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: "Пользователь не найден",
            })
        }
        const {passwordHash, ...userData} = user._doc

        res.json(userData);
    }
    catch (error){
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};

export const addToCart = async(req,res,next)=>{

    try{
        UserModel.findOne({
            _id:req.user._id
        },(err,userInfo)=>{

            if (err) {
                console.log(err);
                return res.status(500).json({
                  message: "Не удалось получить данные о пользователе",
                });
              };

              if (!userInfo){
                return res.status(404).json({
                    message: 'Не удалось найти пользователя'
                })
            };

            let duplicate = false;

            userInfo.cart.forEach(item => {
                item.id===req.query.productId ? duplicate = true : ''
            });
            if (duplicate)return res.json({
               message: 'Этот товар уже был добавлен в корзину'
            });
            !duplicate ? (
                UserModel.findOneAndUpdate({
                    _id:req.user._id
                },{
                    $push:{
                        cart:{
                            id:req.query.productId,
                            date:Date.now()
                        }
                    }
                },
                {
                    new: true
                },
                (err,userInfo)=>{
                    if (err) return res.json({
                        sueccess: false, 
                        err
                    });
                    res.status(200).json(userInfo.cart)
                })
            ):''

        })
    }
    catch (error){
        res.status(500).json({
            message: 'Ошибка корзины',
        });
    }
};

export const removeFromCart = async(req,res)=>{
    UserModel.findOneAndUpdate(
        {
            _id: req.user._id
        },
        {
            $pull:{
                "cart":{
                    "id": req.query.productId
                }
            }
        },
        {
            new: true
        },
        (err, doc)=>{
            if(err){
                if (err) return res.json({
                    sueccess: false, 
                    err
                });
            }
            return res.status(200).json({
                doc
            });
        }
    )
}

export const deleteCart = async(req,res)=>{
    UserModel.findOne({
        _id: req.user._id
    },
    (err,doc)=>{
        if (err) return res.json({
            message: "Пользователь не найден",
        })
        let cart = doc.cart;
        let array = cart.map(item=> item.id);
        doc.updateOne({
            $pull:{
                cart:{
                    'id': { $in: array }
                }
            }
        },
        {new: true},
        (error,info)=>{
            if(error) return res.json({
                message: "Ошибка при удалении корзины"
            })
            return res.json({
                sueccess:true
            })
        })
    })
}

export const userCartInfo = async(req,res)=>{
    UserModel.findOne(
        {
            _id: req.user._id
        },
        (err, userInfo)=>{
            let cart = userInfo.cart;
            let array = cart.map(
                item=>{
                    return item.id
                }
            )

            Product.find({
                '_id': {
                    $in: array
                }
            });
            return res.status(200).json({
                sueccess:true,cart
            })
        }
    )
}

export const addToFavorites = async (req,res)=>{
    try{
        UserModel.findOne({
            _id:req.user._id
        },(err,userInfo)=>{

            if (err) {
                console.log(err);
                return res.status(500).json({
                  message: "Не удалось получить данные о пользователе",
                });
              };

              if (!userInfo){
                return res.status(404).json({
                    message: 'Не удалось найти пользователя'
                })
            };

            let duplicate = false;

            userInfo.favorites.forEach(item => {
                item.id===req.query.productId ? duplicate = true : ''
            });
            if (duplicate)return res.json({
               message: 'Этот товар уже был добавлен в закладки'
            });
            !duplicate ? (
                UserModel.findOneAndUpdate({
                    _id:req.user._id
                },{
                    $push:{
                        favorites:{
                            id:req.query.productId,
                            date:Date.now()
                        }
                    }
                },
                {
                    new: true
                },
                (err,userInfo)=>{
                    if (err) return res.json({
                        sueccess: false, 
                        err
                    });
                    res.status(200).json(userInfo.favorites)
                })
            ):''

        })
    }
    catch (error){
        res.status(500).json({
            message: 'Ошибка закладок',
        });
    }
}

export const userFavoritesInfo = async(req,res)=>{
    UserModel.findOne(
        {
            _id: req.user._id
        },
        (err, userInfo)=>{
            let favorites = userInfo.favorites;
            let array = favorites.map(
                item=>{
                    return item.id
                }
            )

            Product.find({
                '_id': {
                    $in: array
                }
            });
            return res.status(200).json({
                sueccess:true,favorites
            })
        }
    )
}

export const removeFromFavorites = async(req,res)=>{
    UserModel.findOneAndUpdate(
        {
            _id: req.user._id
        },
        {
            $pull:{
                "favorites":{
                    "id": req.query.productId
                }
            }
        },
        {
            new: true
        },
        (err, doc)=>{
            if(err){
                if (err) return res.json({
                    sueccess: false, 
                    err
                });
            }
            return res.status(200).json({
                doc
            });
        }
    )
}

export const addToOrders = async(req,res)=>{
    UserModel.findOne(
        {
            _id: req.user._id
        },
        (err, userInfo)=>{
            if (err) return res.json({
                message: "Пользователь не найден"
            })
            let cart = userInfo.cart;
            let array = cart.map(
                item=>{
                    return item.id
                }
            )
            userInfo.updateOne({
                $push:{
                    orders:array
                }
            },
            {
                new: true
            }, (error, doc)=> {
                if(error) return res.json({
                    message: "Ошибка при оформлении заказа"
                })
                return res.status(200).json({
                    sueccess:true
                })
            })
           
        }
    )
}

export const getOrders = async(req,res)=>{
    UserModel.findOne(
        {
            _id: req.user._id
        },
        (err, userInfo)=>{
            let orders = userInfo.orders;
            return res.status(200).json({
                sueccess:true,orders
            })
        }
    )
}