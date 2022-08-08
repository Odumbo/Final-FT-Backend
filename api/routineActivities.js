const express = require('express');
const client = require('../db/client');
const routineActivitiesRouter = express.Router();
const { requireUser } = require('./utils');
const { updateRoutineActivity, canEditRoutineActivity, destroyRoutineActivity, getRoutineActivityById } = require('../db');

// PATCH /api/routine_activities/:routineActivityId

routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      const {count, duration} = req.body;
      const {routineActivityId: id} = req.params;
      const routineActivityToUpdate = await getRoutineActivityById(routineActivityId(id));
      if(!routineActivityToUpdate) {
        next({
          name: 'Unable to Locate',
          message: 'Unfound'
        })
      } else {
        if(!await canEditRoutineActivity(req.user.id===routine.creatorId)) {
          res.status(403);
          next({name: "Error", message: "You can't edit"});
        } else {
          const updatedRoutineActivity = await updateRoutineActivity({count, id, duration})
          res.send(updatedRoutineActivity);
          
        } 
    
      }
    } catch ({name, message}) {
      next({name, message});
    }
  });

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      if(!await canEditRoutineActivity(req.params.routineActivityId, req.user.id)) {
        res.status(403);
        next({name: "Not Permitted", message: "You Do Not Have Editing Rights!"});
      } else {
        const deletedRoutineActivity = await destroyRoutineActivity(req.params.routineActivityId)
        res.send({success: true, ...deletedRoutineActivity});
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = routineActivitiesRouter;
