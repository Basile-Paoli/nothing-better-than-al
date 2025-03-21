import {createExpressServer} from "routing-controllers";
import "reflect-metadata"
import {authMiddleware, getCurrentUser} from "./middlewares/auth";

import {AuthController} from "./controllers/auth";
import {ErrorHandler} from "./middlewares/error-handling";

const port = 3000


const app = createExpressServer({
	authorizationChecker: authMiddleware,
	currentUserChecker: getCurrentUser,
	middlewares: [ErrorHandler],
	controllers: [AuthController],
	defaultErrorHandler: false
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
