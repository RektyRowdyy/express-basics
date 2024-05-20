export const resolveIndexUserById = (req,res,next) => {

    const { params: {id} } = req;
    const parsedId = parseInt(id)
    if(isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = MockUsers.findIndex((user) => user.id == parsedId)
    if(findUserIndex == -1) return res.sendStatus(404);

    req.findUserIndex = findUserIndex;
    next();
}