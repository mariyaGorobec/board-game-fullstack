import {body} from 'express-validator';
export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять из минимум 5 символов').isLength({min:5}),
    body('fullName', 'Укажите имя').isLength({min:3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять из минимум 5 символов').isLength({min:5}),
];

export const boardGameCreateValidation = [
    body('title', "Введите название игры").isLength({min: 3}).isString(),
    body('description', "Введите описание игры").isLength({min: 5}).isString(),
    body('price', "Введите стоимость товара").isInt(),
    body('imageUrl', "Неверная ссылка на изображение").isURL()
];