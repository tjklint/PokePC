import postgres from "postgres";
import Router from "../router/Router";
import Request from "../router/Request";
import Response from "../router/Response";
import { StatusCode } from "../router/Response";
import User, { UserProps } from "../models/User";
import Cookie from "../auth/Cookie";
import { rmSync } from "fs";
export default class AuthController {
	private sql: postgres.Sql<any>;

	constructor(sql: postgres.Sql<any>) {
		this.sql = sql;
	}

	registerRoutes(router: Router) {
		router.get("/register", this.getRegistrationForm);
		router.get("/login", this.getLoginForm);
		router.post("/login", this.login);
		router.get("/logout", this.logout);
	}

	/**
	 * TODO: Render the registration form.
	 */
	getRegistrationForm = async (req: Request, res: Response) => {
		const params=req.getSearchParams();
		if(params.get("error")){
			await res.send({
				statusCode: StatusCode.OK,
				message:"New form",
				payload:{error: params.get("error")},
				template:"RegistrationView"
			});
		} 
		else{
			await res.send({
				statusCode: StatusCode.OK,
				message:"New form",
				template:"RegistrationView"
			});
		}
	
	};

	/**
	 * TODO: Render the login form.
	 */
	getLoginForm = async (req: Request, res: Response) => {
		const params=req.getSearchParams();
		const session=req.getSession()
		res.setCookie(new Cookie("session_id", `${session.id}`));
		let rememberEmail=false;
		const foundEmail = req.findCookie("email")?.value
		if(foundEmail){
			rememberEmail=true;
		}
		
		if(params.get("error")){		
			await res.send({
				statusCode: StatusCode.OK,
				message:"Login form error",
				payload:{error: `${params.get("error")}.`},
				template:"RegistrationView"
			});
		}
		else{
			
			await res.send({
				statusCode: StatusCode.OK,
				message:"Login Form",
				payload:{email:`${foundEmail}`,hasEmail:rememberEmail},
				template:"LoginView"
			});
		}
	
	};

	/**
	 * TODO: Handle login form submission.
	 */
	login = async (req: Request, res: Response) => {
	
		if(!req.body.email){
			await res.send({
				statusCode: StatusCode.OK,
				message:"Redirect",		
				redirect:"/login?error=Email is required"
			});
		}
		else if(!req.body.password){
			await res.send({
				statusCode: StatusCode.OK,
				message:"Redirect",		
				redirect:"/login?error=Password is required"
			});
		}
		else{
			try{
				const user=await User.login(this.sql,req.body.email,req.body.password);
					const session=req.getSession()
					session.set("isLoggedIn",true);
					session.set("userId",user.props.id);
					res.setCookie(new Cookie("session_id", `${session.id}`));
					if(req.body.remember){
						res.setCookie(new Cookie("email",`${req.body.email}`))
					}
					await res.send({
						statusCode: StatusCode.OK,
						message:"Redirect",			
						redirect:"/box/addpokemon"
					});
				}
				catch{
					await res.send({
						statusCode: StatusCode.BadRequest,
						message:"Redirect",
						redirect:"/login?error=Invalid credentials"
					});
				}		
		}
		
	};

	/**
	 * TODO: Handle logout.
	 */
	logout = async (req: Request, res: Response) => {
		const session=req.getSession()
		session.destroy();
		await res.send({
			statusCode: StatusCode.OK,
			message:"Logout",
			redirect:"/"
		});
	};
}