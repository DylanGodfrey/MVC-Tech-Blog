const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


//gets all comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({})
    res.json(commentData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// view a specific comment
router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: {
        id: req.params.id
      }
    })
    res.json(commentData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// requires users to be logged in before being able to post a comment
router.post('/', withAuth, async (req, res) => {
  if (req.session) {
    try {
      const commentData = await Comment.create({
        comment: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id
      })
      res.json(commentData)
    } catch (err) {
      res.status(500).json(err)
    }
  }
});

module.exports = router