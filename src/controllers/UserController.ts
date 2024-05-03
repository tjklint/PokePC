import postgres from "postgres";
import Request from "../router/Request";
import Response from "../router/Response";
import Router from "../router/Router";
import { equal } from "assert";
import { StatusCode } from "../router/Response";
import User, { UserProps } from "../models/User"
import Cookie from "../auth/Cookie";
import { get } from "http";
/**
 * Controller for handling User CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
export default class UserController {
	private sql: postgres.Sql<any>;
	constructor(sql: postgres.Sql<any>) {
		this.sql = sql;
	}

	registerRoutes(router: Router) {
		router.post("/users", this.createUser);
		router.get("/users/:id/edit",this.showUser);
		router.put("/users/:id",this.updateUser);
		// Any routes that include an `:id` parameter should be registered last.
	}

	updateUser = async (req:Request, res:Response) =>{
		
		delete req.body.method
		const id=req.getId()		
		const currentUser = await User.read(this.sql,id)
		if(req.body.darkmode == "on"){
			res.setCookie(new Cookie("theme", "dark"));
		}
		else{
			res.setCookie(new Cookie("theme", "light"));
		}
		//Get rid of darkmode as to not create errors when updating.
		delete req.body.darkmode
		//If the email and password are left empty simply use the current
		//email and password.
		if(req.body.email == ''){
			req.body.email=currentUser.props.email
		}
		if(req.body.password == ''){
			req.body.password = currentUser.props.password
		}
	
		try{
			await User.update(this.sql,req.body as UserProps,id)
			await res.send({
				statusCode:StatusCode.Redirect,
				message: "User updated successfully!",
				redirect:`/users/${id}/edit?message=User updated successfully!`
			});
		}
		catch{
			await res.send({
				statusCode:StatusCode.Redirect,
				message: "Email already exists",
				redirect: `/users/${id}/edit?message=User with this email already exists`,
			});
		}
		
	}
	showUser = async (req:Request, res:Response) =>{
			const params=req.getSearchParams();
			const foundUser = await User.read(this.sql,req.getId())
			const themeCookie=req.findCookie("theme")?.value
			const session=req.getSession()
			const userId=session.get("userId")
			let darkMode=false
			if(themeCookie=="dark"){
				darkMode=true
			}
			if(foundUser){
				await res.send({
					statusCode:StatusCode.OK,
					message: `${params.get("message")}`,
					payload:{user:foundUser.props,success:params.get("message"),picture:foundUser.props.profile,darkMode:darkMode,loggedIn:session.get("isLoggedIn"),id:userId},
					template:"UserView",
				});
			}
			
	}
	/**
	 * TODO: Upon form submission, this controller method should
	 * validate that no fields are blank/missing, that the passwords
	 * match, and that there isn't already a user with the given email.
	 * If there are any errors, redirect back to the registration form
	 * with an error message.
	 * @param req
	 * @param res
	 */
	createUser = async (req: Request, res: Response) => {

		if(!req.body.email){
			await res.send({
				statusCode:StatusCode.Redirect,
				message: "Parameters were null.",
				redirect: `/register?error=Email is required`,
			});
		}
		else if(req.body.password!=req.body.confirmPassword){
			await res.send({
				statusCode:StatusCode.Redirect,
				message: "Parameters were null.",
				redirect: `/register?error=Passwords do not match`,
			});
		}
		else{
			try{
				//Get rid of confirm password as you only need it
				//for validation.
				delete req.body.confirmPassword
				User.create(this.sql,req.body as UserProps)
				await res.send({
				  statusCode:StatusCode.Created,
				  message: "User created!",
				  redirect: `/login`,
			  });
			  }
			  catch{
				  await res.send({
					  statusCode:StatusCode.Redirect,
					  message: "Email already exists",
					  redirect: `/register?error=Email already exists`,
				  });
			  }
		}
		
	};
}