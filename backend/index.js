import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Post from "./Database/uploadDB.js";
import jwt from "jsonwebtoken";
import User from "./Database/UserDB.js";
import auth from "./middleware/auth.js";

const app= express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    credentials: true,
    origin:true
}));
app.use(express.static('./public'));

mongoose.connect("mongodb://localhost:27017/petscl",
() => {
    console.log("DB connected successfully");
});


const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, Date.now() + "-image.png");
    }
});

const upload = multer({
    storage: storage
})

app.post("/upload", upload.single("image") ,(req,res) => {
    const {title, category,email} = req.body
    console.log(req.file);
    const post = new Post({
        title,
        imgID: "http://localhost:9002/"+ req.file.path.slice(7),
        category,
        email
    })
    console.log(post);
    post.save(err => {
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send({message: "Successfully Posted"})
        }
    })
})

app.get("/newpst", async(req,res) => {
    const skipping = Number(req.query.skip) || 0;
    const limiting = Number(req.query.limit) || 2;
    const posts = await Post.find().skip(skipping).limit(limiting);
    const count = await Post.find().count();
    res.send({posts:posts,count:count});
}) 

app.post("/timeline", auth, async(req,res) => {
    const post = await Post.find({email: req.body.email});
    console.log(post);
    res.send(post);
})
kjfd
app.get("/category/:id", async(req,res) => {
    const posts = await Post.find({category: req.params['id']});
    console.log(posts);
    res.send(posts);
})

app.post("/login",(req,res)=> {
    const {email, password} = req.body
    User.findOne({email: email, password: password}, (err,user) => {
        if(user)
        {
            const tokens = jwt.sign({_id: user._id}, "iamhardikworkingasasoftwareengineer");
            res.cookie("jwt", tokens);
            res.send(user);
        }
    })
})

app.post("/register",(req,res)=> {
    const {username, password, email, fname, lname} = req.body
    User.findOne({email:email}, (err, user) => {
        if(user)
        {
            res.send({message: "User already exists"})
        }
        else
        {
            const user = new User({
                username,
                password,
                email,
                fname,
                lname
            })
            const newUser = jwt.sign({_id: user._id}, "iamhardikworkingasasoftwareengineer");
            res.cookie("jwt", newUser, {
                maxAge: 2 * 60 * 60 * 1000,
                httpOnly: false,
                secure: true
            });
            //console.log(cookie);
            user.save( err => {
                if(err)
                {
                    res.send(err)
                }
                else
                {
                    res.send({message: "Successfully Registered"})
                }
            })
        }
    })
})

app.listen(9002,() => {
    console.log("Backend listening on port 9002");
})