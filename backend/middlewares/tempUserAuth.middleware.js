import jwt from "jsonwebtoken";

export const tempUserAuth = async (req, res, next) => {

    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({
            success : false,
            message : "Not authorized. Register please !"
        });
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_TEMP_SECRET);

        if(decodedToken.email){
            req.body.email = decodedToken.email;
        } else {
            return res.status(401).json({
                success : false,
                message : "Token missing, register again."
            });
        }

        next();

    } catch(error) {
        return res.status(403).json({
            success : false,
            message : "Internal server error."
        });
    }

};
