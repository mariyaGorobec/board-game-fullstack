import BoardGame from "../models/BoardGame.js";

export const getAll = async (req, res) => {
  try {
    const games = await BoardGame.find();

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
    const gameId = req.params.id;

    BoardGame.findOne(
      {
        _id: gameId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось получить игру",
          });
        }
        if (!doc){
            return res.status(404).json({
                message: 'Игра не найдена'
            })
        }
        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить игру",
    });
  }
};

export const remove = async (req, res) => {
    try {
      const gameId = req.params.id;
  
      BoardGame.findOneAndDelete({
            _id: gameId,
      }, (err, doc)=>{
        if (err){
            console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить игру",
          });
        }
        if (!doc){
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }
        res.json({
            success: true,
        })
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
    const doc = new BoardGame({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      gameImgUrl: req.body.gameImgUrl,
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
    const gameId = req.params.id;

    await BoardGame.updateOne({
      _id: gameId,
    }, {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      gameImgUrl: req.body.gameImgUrl,
    });
    res.json({
      success: true,
  })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить данные о товаре",
    });
  }
};
