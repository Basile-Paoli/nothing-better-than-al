import {createExpressServer} from "routing-controllers";
import "reflect-metadata"
import "./db/database"


const app = createExpressServer({
	authorizationChecker: (action, roles) => {
		action.request.headers.authorization
		return true
	},
	currentUserChecker: action => {
	}
})
