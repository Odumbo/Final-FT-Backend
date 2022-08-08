const express = require('express');
const routinesRouter = express.Router();
const  { requireUser } = require("./utils");
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine,  } = require('../db/routines');
const {addActivityToRoutine, getRoutineActivitiesByRoutine }= require('../db/routine_activities');


// GET /api/routines

routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//POST /api/routines

// routinesRouter.post("/", requireUser, async (req, res, next) => {
// 	const { isPublic, name, goal } = req.body;
// 	const creatorId = req.user.id;

// 	try {
// 		if (creatorId && isPublic && name && goal) {
// 			const newRoutine = await createRoutine({
// 				creatorId: 
// 			});
// 			res.send(newRoutine);
// 		} else {
// 			res.send({ message: 'Error' });
// 		}
// 	} catch ({ name, message }) {
// 		next({ name, message });
// 	}
// });



routinesRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const { goal, isPublic, name } = req.body;
    const creatorId = req.user.id;
    const newRoutine = await createRoutine({creatorId, goal, isPublic, name});
    res.send(newRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId




routinesRouter.patch("/:routineId", async (req, res, next) => {
  const routineId = req.params.routineId;
  const { name, goal, isPublic } = req.body;
  let _routine = await getRoutineById(routineId);
  try {
    if (!_routine) {
      next({
        name: "routineDoesNotExist",
        message: `routine ${routineId} not found`,
      });
    }
    if (_routine.creatorId !== req.user.id) {
      next({
        name: "Forbidden",
        message: `User ${req.user.username} is not allowed to update ${_routine.name}`,
      });
    }
    const updatedRoutine = await updateRoutine({
      id: routineId,
      name,
      goal,
      isPublic,
    });
    res.send(updatedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// DELETE /api/routines/:routineId

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const routineId = req.params.routineId;
    let _routine = await getRoutineById(routineId);
    if (_routine.creatorId !== req.user.id) {
      next({
        name: "Forbidden",
        message: `User ${req.user.username} is not allowed to delete ${_routine.name}`,
      });
    }
    if (_routine.creatorId === req.user.id) {
      await destroyRoutine(routineId);
      let deletedRoutine = await getRoutineById(routineId);
      if (!deletedRoutine) {
        res.send({ success: true, ..._routine });
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/routines/:routineId/activities

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
	const { routineId } = req.params;
	const { activityId, count, duration } = req.body;

	if (!routineId) {
		const error = new Error('Missing routine id');
		return res.status(400).send(error);
	}

	let activity = await getRoutineActivitiesByRoutine({ id: routineId });

	if (activity) {
		activity = activity.filter(
			routineActivities => routineActivities.activityId === req.body.activityId
		);

		if (activity.length > 0) {
			const error = new Error('Activity already exists');
			return res.status(400).send(error);
		}
	}

	try {
		const newRoutineActivity = await addActivityToRoutine({
			routineId,
			activityId,
			count,
			duration,
		});
		res.send(newRoutineActivity);
	} catch ({ name, message }) {
		next({ name, message });
	}
});




// routinesRouter.post("/:routineId/activities", async (req, res, next) => {
//   const { routineId } = req.params;
//   const { activityId, count, duration } = req.body;
//   const activity = await getActivityById(activityId);
//   const routine = await getRoutineById(routineId);

//   try {
//     if (await activityIsInRoutine(activity.id, routine.id)) {
//       next({
//         name: "ActivityIsInRoutine",
//         message: `Activity ID ${activity.id} already exists in Routine ID ${routine.id}`,
//       });
//     }

//     const addedActivity = await addActivityToRoutine({
//       routineId,
//       activityId,
//       count,
//       duration,
//     });
//     res.send(addedActivity);
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

module.exports = routinesRouter;




