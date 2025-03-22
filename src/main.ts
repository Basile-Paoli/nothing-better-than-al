import {createExpressServer} from "routing-controllers";
import "reflect-metadata"
import {authMiddleware, getCurrentUser} from "./middlewares/auth";

import {ErrorHandler} from "./middlewares/error-handling";
import * as path from "node:path";

const port = 3000


const app = createExpressServer({
	authorizationChecker: authMiddleware,
	currentUserChecker: getCurrentUser,
	middlewares: [ErrorHandler],
	controllers: [path.join(__dirname + "/controllers/*.ts"), path.join(__dirname + "/controllers/*.js")],
	defaultErrorHandler: false
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
