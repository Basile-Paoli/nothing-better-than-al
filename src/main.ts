import {createExpressServer, getMetadataArgsStorage, type RoutingControllersOptions} from "routing-controllers";
import "zod-openapi/extend"
import "reflect-metadata"
import {authMiddleware, getCurrentUser} from "./middlewares/auth";

import {ErrorHandler} from "./middlewares/error-handling";
import {routingControllersToSpec} from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";
import {UserController} from "./controllers/user";
import {AuthController} from "./controllers/auth";
import {MovieController} from "./controllers/movies";
import {ScreenController} from "./controllers/screen";

const port = 3000


const routingControllerOptions: RoutingControllersOptions = {
	authorizationChecker: authMiddleware,
	currentUserChecker: getCurrentUser,
	middlewares: [ErrorHandler],
	controllers: [UserController, AuthController, MovieController, ScreenController],
	defaultErrorHandler: false
}
const app = createExpressServer(routingControllerOptions);

const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllerOptions)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
