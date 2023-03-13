import UserModel from '../models/User.js';
import Product from '../models/Product.js';
import Orders from '../models/Orders.js';



export const makeAnOrder = async(req,res,next)=>{
    const totalPrice = req.query.totalPrice;
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
            Product.find({ '_id': { $in: array } },(error,info)=>{
                if(error) return res.json({
                    message: "Ошибка при выводе товаров"
                })
                
                const doc = new Orders({
                   
                    user:{
                        _id:userInfo._id,

                        email: userInfo.email,
                        name: userInfo.name,
                        patronymic: userInfo.patronymic,
                        lastName: userInfo.lastName,
                        localityShipping:userInfo.localityShipping,
                        addressShipping:userInfo.addressShipping,
                        postcode:userInfo.postcode
                    },
                    products:info,
                    totalPrice:totalPrice
                   
                 });
                doc.save();
                const userId = doc.user._id
                const orderId = doc._id;
                UserModel.findOneAndUpdate(
                    {
                        _id: userId
                    },
                    {
                        $push:{
                            "orders":{
                                "id": orderId
                            }
                        }
                    },
                    {
                        new: true
                    },(error,userOrders)=>{
                        return res.json(orderId)
                    }
                )
            })
    
           
        }
    )
    
};

export const getOrdersUser = async(req,res)=>{
    UserModel.findOne(
        {
            _id: req.user._id
        },
        (err, userInfo)=>{
            let orders = userInfo.orders;
            let array = orders.map(
               item=> {
                return item.id
               }
            )
            Orders.find({
                _id: {$in: array}
            }, (err, doc)=>{
                return res.json(doc)
            })
        }
    )
}
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Orders.find();
  
      res.json(orders);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось получить заказы",
      });
    }
  };