const router = require("express").Router();
const Comment = require("../../models/comment");
const auth = require("../../middlewares/auth");

router.post("/comments", auth, async (req, res) => {
    try {
        const { postId, userImage, username, comment, time } = req.body;
        if (!postId || !userImage || !username || !comment || !time) {
            return res.status(400).json({
                message: "Incomplete data",
            });
        }

        const newComment = new Comment(req.body);
        await newComment.save();

        res.status(200).json({
            message: "Your comment is saved successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

router.get("/comments/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const comments = await Comment.find({ postId: id });

        res.status(200).json({
            comments: comments,
        });
    } catch (e) {
        res.status(500).json({
            message: "Some problem occurred",
        });
    }
});

module.exports = router;
