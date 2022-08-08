const express = require('express');
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { verify } = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");
const usersRouter = require("./users");
const activitiesRouter = require('./activities');
const routinesRouter = require('./routines');
const routineActivitiesRouter = require('./routineActivities');

// apiRouter.use('/', async (req, res, next) => {
// 	const auth = req.header('Authorization');

// 	if (!auth) {
// 		return next();
// 	}

// 	if (auth.startsWith('Bearer ')) {
// 		const token = auth.slice('Bearer '.length);

// 		try {
// 			const { username } = verify(token, JWT_SECRET);

// 			if (username) {
// 				req.user = await await getUserById(id);
// 				return next();
// 			}
// 		} catch ({ name, message }) {
// 			next({ name, message });
// 		}
// 	} else {
// 		next({ name: 'AuthError', message: 'Error in authorization format' });
// 	}
// });




apiRouter.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
  
    if (!auth) {
   
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
      next({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`,
      });
    }
  });
  

// GET /api/health
apiRouter.get("/health", async (req, res, next) => {
    res.status(200);
    res.send({ message: "The server is up" });
  });

// ROUTER: /api/users

apiRouter.use("/users", usersRouter);

// ROUTER: /api/activities

apiRouter.use('/activities', activitiesRouter);

// ROUTER: /api/routines

apiRouter.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities

apiRouter.use('/routine_activities', routineActivitiesRouter);

module.exports = apiRouter;
