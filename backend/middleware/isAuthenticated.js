import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuthenticated = (req, res,next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(200).json({ message: "User not authenticated", success: false });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token", success: false });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Error in user authentication", success: false });
    }
};

export { isAuthenticated };
