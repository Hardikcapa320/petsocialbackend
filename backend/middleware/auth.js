import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    // console.log(req``);
    // console.log(req.rawHeaders['coo']);
    const token = req.headers.cookie.slice(4);
    console.log(token);
    const verifyUser = jwt.verify(token, "iamhardikworkingasasoftwareengineer");
    console.log(verifyUser);
    next();
}

export default auth;