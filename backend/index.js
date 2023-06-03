const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors=require('cors')

const connection=require('./configs/db');
const { postRouter } = require("./routers/postRouter");
const { userModel } = require("./models/userModel");
const { postModel } = require("./models/postModel");

const app = express();
app.use(cors())
app.use(express.json());

app.use("/classifieds", postRouter);

app.get("/", (req, res) => {
    res.send("OLX Classifieds - Welcome To The Home page");
});

// Register Users
app.post("/signup", async (req, res) => {
    const {  email, password } = req.body;
    try {
        bcrypt.hash(password, +process.env.salt, async function (err, hash) {
            if (err) {
                console.error(err);
                res.status(500).send({ err: "Something went wrong" });
            } else {
                const user = new userModel({  email, password: hash, });
                await user.save();
                res.status(201).send({ msg: "User Registered Successfully", user });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: "Something went wrong" });
    }
});

// Login Users
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async function (err, result) {
                if (result) {
                    const token = jwt.sign({ userID: user._id }, process.env.secret);
                    res.send({ msg: "Login Successfull", user, token });
                } else {
                    res.send({ err: "Wrong Credentials" });
                }
            });
        } else {
            res.send({ err: "User Not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: "Something went wrong" });
    }
});

// app.use(authenticator);

app.use("/test", (req, res) => {
    res.send(req.body);
});

app.listen(process.env.PORT, async () => {
    console.log(`Server runs at  ${process.env.PORT}`);
    try {
        await connection;
        console.log("Connected to the database");
    } catch (error) {
        console.log(error);
    }
});