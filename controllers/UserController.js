import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import Product from "../models/Product.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      name: req.body.name,
      patronymic: req.body.patronymic,
      lastName: req.body.lastName,
      localityShipping: req.body.localityShipping,
      addressShipping: req.body.addressShipping,
      postcode: req.body.postcode,
      role: req.body.role,
      passwordHash: hash,
      cart: req.body.cart,
      favorites: req.body.favorites,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Не удалось зарегистрироваться, пользователь с таким email уже существует",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
     UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, doc) => {
        if (err) {
          return res.status(404).json({
            message: "Пользователь не найден",
          });
        }
        return res.json(doc);
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, userInfo) => {
        if (err) {
          return res.status(500).json({
            message: "Не удалось получить данные о пользователе",
          });
        }

        if (!userInfo) {
          return res.status(404).json({
            message: "Не удалось найти пользователя",
          });
        }

        let duplicate = false;

        userInfo.cart.forEach((item) => {
          item.id === req.query.productId ? (duplicate = true) : "";
        });
        if (duplicate)
          return res.json({
            message: "Этот товар уже был добавлен в корзину",
          });
        !duplicate
          ? UserModel.findOneAndUpdate(
              {
                _id: req.user._id,
              },
              {
                $push: {
                  cart: {
                    id: req.query.productId,
                    date: Date.now(),
                  },
                },
              },
              {
                new: true,
              },
              (err, doc) => {
                if (err) {
                  return res.status(404).json({
                    message: "Не удалось добавить товар в корзину",
                  });
                } else {
                  Product.findOne(
                    { _id: req.query.productId },
                    (error, info) => {
                      if (error) {
                        return res.status(404).json({
                          message: "Не удалось найти продукт",
                        });
                      } else {
                        return res.status(200).json(info);
                      }
                    }
                  );
                }
              }
            )
          : "";
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка корзины",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $pull: {
          cart: {
            id: req.query.productId,
          },
        },
      },
      {
        new: true,
      },
      (err, doc) => {
        if (err) {
          return res.status(404).json({
            message: "Не удалось убрать продукт из корзины",
          });
        }
        return res.status(200).json({
          doc,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка корзины",
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, doc) => {
        if (err)
          return res.json({
            message: "Пользователь не найден",
          });
        let cart = doc.cart;
        let array = cart.map((item) => item.id);
        doc.updateOne(
          {
            $pull: {
              cart: {
                id: { $in: array },
              },
            },
          },
          { new: true },
          (error, info) => {
            if (error)
              return res.json({
                message: "Ошибка при удалении корзины",
              });
            return res.json({
              sueccess: true,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка корзины",
    });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, doc) => {
        if (err)
          return res.json({
            message: "Пользователь не найден",
          });
        let favorites = doc.favorites;
        let array = favorites.map((item) => item.id);
        doc.updateOne(
          {
            $pull: {
              favorites: {
                id: { $in: array },
              },
            },
          },
          { new: true },
          (error, info) => {
            if (error)
              return res.json({
                message: "Ошибка при удалении корзины",
              });
            return res.json({
              sueccess: true,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка в "Избранном"',
    });
  }
};

export const userCartInfo = async (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, userInfo) => {
        if (err) {
          return res.json({
            message: "Пользователь не найден",
          });
        }
        let cart = userInfo.cart;
        let array = cart.map((item) => {
          return item.id;
        });
        Product.find({ _id: { $in: array } }, (error, info) => {
          if (error) {
            return res.json({
              message: "Ошибка при получении информации о товарах в корзине",
            });
          }
          return res.status(200).json(info);
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка корзины",
    });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, userInfo) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось получить данные о пользователе",
          });
        }

        if (!userInfo) {
          return res.status(404).json({
            message: "Не удалось найти пользователя",
          });
        }

        let duplicate = false;

        userInfo.favorites.forEach((item) => {
          item.id === req.query.productId ? (duplicate = true) : "";
        });
        if (duplicate)
          return res.json({
            message: "Этот товар уже был добавлен в закладки",
          });
        !duplicate
          ? UserModel.findOneAndUpdate(
              {
                _id: req.user._id,
              },
              {
                $push: {
                  favorites: {
                    id: req.query.productId,
                    date: Date.now(),
                  },
                },
              },
              {
                new: true,
              },
              (err, doc) => {
                if (err) {
                  return res.json({
                    message: "Ошибка при добавлении продукта в закладки",
                  });
                } else {
                  Product.findOne(
                    { _id: req.query.productId },
                    (error, info) => {
                      if (error) {
                        return res.json({
                          message:
                            "Ошибка при получении информации о продуктах в закладках",
                        });
                      }
                      return res.status(200).json(info);
                    }
                  );
                }
              }
            )
          : "";
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка закладок",
    });
  }
};

export const userFavoritesInfo = async (req, res) => {
  try {
    UserModel.findOne(
      {
        _id: req.user._id,
      },
      (err, userInfo) => {
        if (err) {
          return res.json({
            message: "Пользователь не найден",
          });
        }
        let favorites = userInfo.favorites;
        let array = favorites.map((item) => {
          return item.id;
        });

        Product.find({ _id: { $in: array } }, (error, info) => {
          if (error) {
            return res.json({
              message:
                "Ошибка при получении информации о продуктах в закладках",
            });
          }
          return res.status(200).json(info);
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка закладок",
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    UserModel.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $pull: {
          favorites: {
            id: req.query.productId,
          },
        },
      },
      {
        new: true,
      },
      (err, doc) => {
        if (err) {
          return res.json({
            message: "Ошибка при удалении продукта из закладок",
          });
        }

        return res.status(200).json({
          doc,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка закладок",
    });
  }
};
