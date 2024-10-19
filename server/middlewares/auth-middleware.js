import jwt from 'jsonwebtoken';
import userModel from '../models/User.model.js'
let checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    console.log(authorization);
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];
            // verify token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // get user from token..
            req.user = await userModel.findById(userID).select("-password");
            next();
        } catch (error) {
            res.status(401).send({message: "Unauthorized user"});
        }
    }
    if (!token) {
        res.status(401).send({message: "No token, unauthorized user"});
    }
}


export default checkUserAuth;