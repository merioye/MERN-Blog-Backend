const router = require("express").Router();
const Post = require("../../models/post");
const User = require("../../models/user");
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

// get user
router.get("/authenticate", auth, async (req, res) => {
    try {
        if (req.id) {
            const user = await User.findOne({ _id: req.id });
            if (!user) {
                return res.status(500).json({
                    message: "Some problem occurred",
                });
            }

            res.status(200).json({
                message: "Authenticated",
                pic: user.image,
                username: user.username,
            });
        }
    } catch (e) {
        res.status(401).json({
            message: "Not authenticated",
        });
    }
});

router.post("/posts", auth, upload.single("blogImage"), async (req, res) => {
    try {
        const { title, category, desc } = req.body;
        if (!title || !category || !desc || !req.file) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ _id: req.id });

        const post = new Post({
            title,
            category,
            desc,
            postImage: req.file.filename,
            author: user.username,
            authorImage: user.image,
        });

        const isSaved = await post.save();
        if (!isSaved) {
            return res.status(500).json({
                message: "Some problem occurred",
            });
        }

        res.status(201).json({
            message: "Post saved successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        if (posts.length === 0) {
            return res.status(204).json({
                message: "No posts available",
            });
        }

        if (!posts) {
            throw new Error("Some problem occurred");
        }

        res.status(200).json({
            postList: posts,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.get("/posts/filter", async (req, res) => {
    try {
        const author = req.query.author;
        const category = req.query.category;
        const search = req.query.search;

        let posts;
        if (author) {
            posts = await Post.find({ author: author });
        } else if (category) {
            posts = await Post.find({ category: category });
        } else if (search) {
            posts = await Post.find({
                $or: [
                    {
                        desc: {
                            $regex: ".*\\b" + search + "\\b.*",
                            $options: "i",
                        },
                    },
                    {
                        title: {
                            $regex: ".*\\b" + search + "\\b.*",
                            $options: "i",
                        },
                    },
                ],
            });
        }

        res.status(200).json({
            posts: posts,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.get("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findOne({ _id: id });
        if (!post) {
            throw new Error("Some problem occurred");
        }

        res.status(200).json({
            post: post,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.get("/posts/:related/:without", async (req, res) => {
    try {
        const related = req.params.related;
        // it is title of the currently opened post(which should not be included in related posts)
        const without = req.params.without;

        const posts = await Post.find({
            $and: [{ category: related }, { title: { $ne: without } }],
        });

        res.status(200).json({
            relatedPosts: posts,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.put("/posts/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { title, desc } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            { _id: id },
            { title, desc },
            { new: true }
        );

        res.status(200).json({
            updatedPost: updatedPost,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.delete("/posts/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        await Post.findByIdAndDelete({ _id: id });

        res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

module.exports = router;
