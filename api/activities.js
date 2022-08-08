const express = require('express');
const activitiesRouter = express.Router();
// const { requireUser } = require("./utils");
const { getAllActivities, getActivityByName, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');

// GET /api/activities/:activityId/routines

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    try {
      const routines = await getPublicRoutinesByActivity({id: req.params.activityId});
      if(routines) {
        res.send(routines);
      } else {
        next({
          name: 'Unable To Locate',
          message: `Not Found ${req.params.activityId}`
        })
      }
    } catch (error) {
      next(error);
    }
  });

// GET /api/activities

activitiesRouter.get('/', async (req, res, next) => {
    try {
      const activities = await getAllActivities();
      res.send(activities);
    } catch (error) {
      next(error)
    }
  })
  

// POST /api/activities

activitiesRouter.post('/', async (req, res, next) => {
    try {
      const {name, description} = req.body;
      const existingActivity = await getActivityByName(name);
      if(existingActivity) {
        next({
          name: 'Unable to Locate',
          message: `This is a duplicate, ${name} already exists`
        });
      } else {
        const createdActivity = await createActivity({name, description});
        if(createdActivity) {
          res.send(createdActivity);
        } else {
          next({
            name: 'Please Create',
            message: 'Error! Please Try Creating Again'
          })
        }
      }
    } catch (error) {
      next(error);
    }
  });

// PATCH /api/activities/:activityId



activitiesRouter.patch('/:activityId', async (req, res, next) => {
	const { name, description } = req.body;
	const { activityId } = req.params;

	try {
		if (activityId || name || description) {
			const updatedActivity = await updateActivity({
				id: activityId,
				name,
				description,
			});
			res.send(updatedActivity);
		} else {
			res.send({ message: 'Missing fields' });
		}
	} catch ({ name, message }) {
		next({ name, message });
	}
});

// activitiesRouter.patch('/:activityId', requireUser,  async (req, res, next) => {
//     try {
//       const {activityId} = req.params;
//       const existingActivity = await getActivityById(activityId);
//       console.log('existingActivity: ', existingActivity);
//       if(!existingActivity) {
//         next({
//           name: 'Unable to Locate',
//           message: `Activity Missing with This ID ${activityId}`
//         });
//       } else {
//         const {name, description} = req.body;
//         const updatedActivity = await updateActivity({id: activityId, name, description})
//         if(updatedActivity) {
//           res.send(updatedActivity);
//         } else {
//           next({
//             name: 'Update Error',
//             message: 'Error, activity not updated'
//           })
//         }
//       }
//     } catch (error) {
//       next(error);
//     }
//   });

module.exports = activitiesRouter;
