import jwt from 'jsonwebtoken';

export default (req,res,next)=>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    if (token){
        try{
            const decoded = jwt.verify(token, 'secret123');
            if (decoded._id==="63f9b1ca3f099d7ef031c895"){
                req.userId = decoded._id;
            }
            else{
                return res.status(403).json({
                message: 'Нет доступа',
            });
            }
            next();
        }
        catch (error){
            return res.status(403).json({
                message: 'Нет доступа',
            })        }
    }
    else{
        return res.status(403).json({
            message: "Нет доступа",
        });
    }
}