const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET All Posts
router.get('/', async (req, res) => {
  try {
    const allPost = await Post.findAll({
      attributes: ['id', 'title', 'content'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
    if (allPost) {
      res.json(allPost.reverse())
    }
  } catch (err) {
    res.status(500).json(err)
  }
});

//GET Single Post
router.get('/:id', async (req, res) => {
  try {
    const onePost = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'content', 'title'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
    if (!onePost) {
      res.status(400).json({ message: 'Sorry no post with this id' })
    }
    res.json(onePost)
  } catch (err) {
    res.status(500).json(err)
  }
});

// CREATE Post withAuth
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id
    })
    res.json(newPost)
  } catch (err) {
    res.status(500).json(err)
  }
});


// UPDATE Post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const editPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    if (!editPost) {
      res.status(400).json({ message: 'Cannot find post with this id' })
    }
    res.json(editPost)
  } catch (err) {
    res.status(500).json(err)
  }
});

//DELETE the users post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletePost = Post.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!deletePost) {
      res.status(400).json({ message: 'Cannot find id for this post' })
    }
    res.json(deletePost)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router