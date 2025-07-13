import jwt from "jsonwebtoken";

const auth = (requiredRole=null) => async (req, res, next) => {

    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({
            success : false,
            message : "Token missing, login again."
        });
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(requiredRole && decodedToken.role !== requiredRole){
            if(decodedToken.role !== "ADMIN"){
                return res.status(403).json({
                    success : false,
                    message : "Access denied."
                });
            } else {
                req.body.userId = decodedToken.id;
                next();
            }
        }
        req.body.userId = decodedToken.id;
        next();

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }

};

export default auth;