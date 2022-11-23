const router = require('express').Router()
const { User, Post, Comment } = require('../../models')

// GET All
router.get('/', async (req, res) => {
  try {
    const allUser = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    res.json(allUser)
  } catch (err) {
    res.status(500).json(err)
  }
})

//GET one
router.get('/:id', async (req, res) => {
  try {
    const oneUser = await User.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'content']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text'],
          include: {
            model: Post,
            attributes: ['title']
          }
        },
        {
          model: Post,
          attributes: ['title']
        }
      ]
    })
    if (!oneUser) {
      res.status(400).json({ message: 'Cannot find user' })
    }
    res.json(userOne)
  } catch (err) {
    res.status(500).json(err)
  }
})

// CREATE User
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password
    })
    if (newUser) {
      req.session.save(() => {
        req.session.user_id = newUser.id
        req.session.username = newUser.username
        req.session.loggedIn = true
        res.status(200).json(newUser)
      })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const findUser = await User.findOne({
      where: {
        username: req.body.username
      }
    })
    if (!findUser) {
      res.status(400).json({ message: 'No user with this name' })
    }
    const validPassword = findUser.checkPassword(req.body.password)

    if (!validPassword) {
      res.sendStatus(400).json({ message: 'invalid password!' })
    }
    req.session.save(() => {
      req.session.user_id = findUser.id
      req.session.username = findUser.username
      req.session.loggedIn = true
      res.json({ user: findUser, message: 'You are now logged in!' })
    })
  } catch (err) {
    res.status(500).json(err)
  }
})
// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end()
    })
  } else {
    res.status(404).end()
  }
})

module.exports = router