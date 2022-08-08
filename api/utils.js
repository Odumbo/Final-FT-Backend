const requireUser = (req, res, next) => {
	const user = req.user;
	if (!user) {
		const error = new Error('User not found');
		return res.status(403).send(error);
	} else {
		return next();
	}
};

module.exports = { requireUser };
































// function requireUser(req, res, next) {
//     if (!req.user) {
//       res.status(401);
//       next({
//         name: "MissingUserError",
//         message: "You must be logged in to perform this action",
//       });
//     }
  
//     next();
//   }
  
//   module.exports = { requireUser };