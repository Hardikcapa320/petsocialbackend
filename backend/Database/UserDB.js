import express from "express";
import cors from "cors"
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const schema = mongoose.Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    fname: {type: String},
    lname: {type: String},
})

const User = new mongoose.model("User", schema)
export default User;