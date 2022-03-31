import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const schema = mongoose.Schema({
    title: {type: String},
    imgID: {type: String},
    category: {type: String},
    email:{type:String}
})

const Post = mongoose.model("Post", schema);
export default Post;