import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default (req,res,next)=>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    
        try{
            const decoded = jwt.verify(token, 'secret123');
            //req.user = decoded._id;
            User.findOne({
                _id:decoded._id
            },(err,doc)=>{
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                      message: err,
                    });
                  };
                  if(doc.role===true){
                    req.user = doc;
                  req.token = token;
                  next();
                  }
                  
            }            );
            /*req.token =token;
            next();*/
        }
        catch (error){
            return res.status(403).json({
                message: error,
            })        }
    
    
}