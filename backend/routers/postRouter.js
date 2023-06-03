const express = require("express");
const { postModel } = require("../models/postModel")

const postRouter = express.Router();

// Get all Posts
postRouter.get("/", async (req, res) => {
    try {
        const posts = await postModel.find();
        res.status(200).send({ msg: "All Posts", posts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: "Something went wrong" });
    }
});

// Register Post
postRouter.post("/", async (req, res) => {
    try {
        const payload = req.body;
        const post = new postModel(payload);
        await post.save();
        res.status(201).send({ msg: "Post Registered Successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: "Something went wrong" });
    }
});

// Get Posts by post id
postRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const post = await postModel.findOne({ _id: id });
        res.status(200).send({ msg: "Post Details by ID", post });
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: "Something went wrong" });
    }
});

// Delete Post
postRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const post = await postModel.findByIdAndDelete({ _id: id });
        res.status(202).send({ msg: "Post Deleted", post });
    } catch (error) {
        console.error(error);
        res.status(500).send({ err: "Something went wrong" });
    }
});

module.exports = { postRouter };