const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const { JWT_SECRET } = process.env;  // make env file
const {getUser, getUserByUsername, createUser } = require('../db');
const { requireUser } = require("./utils");
const { getPublicRoutinesByUser,  getAllRoutinesByUser} = require('../db');

// POST /api/users/login

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  

    if (!username || !password) {
      next({
        name: 'Error',
        message: 'Must have username and password'
      });
    }
  
    try {
      const user = await getUser({username, password});
      if(!user) {
        next({
          name: 'Error',
          message: 'Try again. Username or password is incorrect',
        })
      } else {
        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET);
        res.send({ user, message: "Your in!", token });
      }
    } catch ({name,message}) {
      console.log(error);
      next(name, message);
    }
  });

  
    

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    try {
      const {username, password} = req.body;
      const queriedUser = await getUserByUsername(username);
      if (queriedUser) {
        res.status(401);
        next({
          name: 'Error',
          message: 'Must chose original Username'
        });
      } else if (password.length < 8) {
        res.status(401);
        next({
          name: 'Password Error',
          message: 'Password Not Long Enough!'
        });
      } else {
        const user = await createUser({
          username,
          password
        });
        if (!user) {
          next({
            name: 'Error',
            message: 'Please Try again.',
          });
        } else {
          const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET);
          res.send({ user, token });
        }
      }
    } catch ({name, message}) {
      next({name, message});
    }
});

// GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch ({ name, message }) {
    next({ name, message });
  }
});



// GET /api/users/:username/routines

usersRouter.get('/:username/routines', async (req, res, next) => {
    try {
      const {username} = req.params;
      const user = await getUserByUsername(username);
      if(!user) {
        next({
          name: 'User Not Found',
          message: `Unable to Find User ${username}`
        });
      } else if(req.user && user.id === req.user.id) {
        const routines = await getAllRoutinesByUser({username: username});
        res.send(routines);
      } else {
        const routines = await getPublicRoutinesByUser({username: username});
        res.send(routines);
      }
    } catch (error) {
      next(error)
    }
  })

module.exports =  usersRouter ;



























// usersRouter.post('/login', async (req, res, next) => {
    // 	try {
    // 		const { username, password } = req.body;
    
    // 		if (!username || !password) {
    // 			const error = new Error('Missing credentials');
    // 			return res.status(400).send({ data: error.message });
    // 		}
    
    // 		const user = await getUserByUsername(username);
    
    // 		if (!user) {
    // 			const error = new Error('Invalid credentials');
    // 			return res.status(400).send({ data: error.message });
    // 		} else {
    // 			const match = await bcrypt.compare(password, user.password);
    // 			if (match) {
    // 				delete user.password;
    // 				const token = jwt.sign(user, JWT_SECRET);
    // 				res.send({
    // 					user,
    // 					token,
    // 					message: `logged in as ${username} successfully`,
    // 				});
    // 			}
    // 		}
    // 	} catch ({ name, message }) {
    // 		next({ name, message });
    // 	}
    // });