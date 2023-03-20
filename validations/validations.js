import {body} from 'express-validator';
export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять из минимум 5 символов').isLength({min:5}),
    body('name', 'Укажите имя').isLength({min:2}),
    body('lastName', 'Укажите фамилию').isLength({min:3}),
   
    body('addressShipping', 'Укажите адрес доставки').isLength({min:5}).isString(),
    body('localityShipping', 'Укажите населённый пункт доставки').isLength({min:5}).isString(),
    body('addressShipping', 'Укажите почтовый индекс').isLength({min:6}).isString()
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять минимум из 5 символов').isLength({min:5}),
];

export const boardGameCreateValidation = [
    body('title', "Введите название игры").isLength({min: 3}).isString(),
    body('description', "Введите описание игры").isLength({min: 5}).isString(),
    body('price', "Введите стоимость товара").isInt(),
    body('imgURL', "Неверная ссылка на изображение").isURL()
];