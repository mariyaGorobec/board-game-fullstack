import Product from "../models/Product.js";

export const getAll = async (req, res) => {
  try {
    const games = await Product.find();

    res.json(games);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить игры",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const game = await Product.findById({
      _id: req.query.id,
    });
    if (!game) {
      return res.status(404).json({
        message: "Игра не найдена",
      });
    }
    console.log(game);
    res.json({
      _id: game._id,
      title: game.title,
      description: game.description,
      imgURL: game.imgURL,
      price: game.price,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить игру",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const gameId = req.query.productId;

    Product.findOneAndDelete(
      {
        _id: gameId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить игру",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Игра не найдена",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить игру",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imgURL: req.body.imgURL,
    });
    const boardGame = await doc.save();
    res.json(boardGame);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать товар",
    });
  }
};

export const update = async (req, res) => {
  try {
    const gameId = req.body.gameId;

    await Product.updateOne(
      {
        _id: gameId,
      },
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        gameImgUrl: req.body.gameImgUrl,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить данные о товаре",
    });
  }
};
