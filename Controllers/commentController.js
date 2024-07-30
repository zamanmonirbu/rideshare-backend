const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(3);
    res.json(comments);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    // console.log(comment);

    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
