import handlebars from "handlebars";
import { getImagesPath, getPath, getStylesPath } from "../url";
import fs from "fs/promises";
import { glob } from "glob";
import { formatDateToISO } from "../utils";

interface TemplateData {
	[key: string]: any;
}

/**
 * A class that represents a view. The view is used to render templates with
 * the given data. It is a singleton class that loads all templates once and
 * then renders them with different data multiple times without having to
 * load all templates upon every request. The view uses Handlebars as the
 * templating engine. It also provides a few helper functions for getting the
 * path to a route, the path to styles, and the path to images. The view is
 * used by the controllers to render the templates with the given data.
 */
export default class View {
	private static instance: View;
	private directory: string;
	private data: Record<string, any> = {};
	private template: handlebars.TemplateDelegate<any> | undefined;
	private templates: Record<string, handlebars.TemplateDelegate<any>> = {};

	private constructor(directory = "src/views") {
		this.directory = directory;

		// Register a Handlebars helper for getting the path to a route.
		handlebars.registerHelper(
			"path",
			(relativePath: string, parameters: any) =>
				getPath(relativePath, parameters),
		);

		// Register a Handlebars helper for getting the path to styles.
		handlebars.registerHelper("styles", (relativePath: string) =>
			getStylesPath(relativePath),
		);

		// Register a Handlebars helper for getting the path to images.
		handlebars.registerHelper("images", (relativePath: string) =>
			getImagesPath(relativePath),
		);

		// Register a Handlebars helper for formatting the date
		handlebars.registerHelper("formatDate", function (date) {
			return formatDateToISO(date); // Format as 'YYYY-MM-DD'
		});
	}

	/**
	 * This is the only public method of the View class. It is used to render
	 * a template with the given data. It is a static method that returns a
	 * promise that resolves to the rendered template as a string. The only
	 * thing you need to do is to call `View.render` with the name of the
	 * template and the data to merge with the template placeholders.
	 *
	 * @param name Name of the template to render without the file extension.
	 * @param data Data to merge with the template placeholders.
	 * @returns The rendered template as a string.
	 * @example <h1>{{ title }}</h1> + { title: "My Title" } = <h1>My Title</h1>
	 */
	public static render = async (
		name: string,
		data: TemplateData = {},
	): Promise<string> => {
		const view = await View.getInstance(name, data);
		return view.template ? view.template(view.data) : "";
	};

	/**
	 * This is an example of the Singleton pattern. It is used to ensure that
	 * only one instance of the View class is created and that it is shared
	 * across the entire application. This is useful because it allows us to
	 * load all templates once and then render them with different data
	 * multiple times without having to load the templates upon every request.
	 * @param name Name of the template to render without the file extension.
	 * @param data Data to merge with the template placeholders.
	 * @param directory The directory where the templates are located.
	 * @returns The (singular) instance of the View class.
	 */
	private static getInstance = async (
		name: string,
		data: TemplateData = {},
		directory = "src/views",
	): Promise<View> => {
		if (!View.instance) {
			View.instance = new View(directory);
			await View.instance.loadTemplates();
		}

		await View.instance.setTemplate(name);
		View.instance.setTemplateData(data);

		return View.instance;
	};

	/**
	 * @returns A function that can be used to render the template with the given data.
	 */
	private compileTemplate = async (
		fileName: string,
		directory = ".",
	): Promise<handlebars.TemplateDelegate<any>> => {
		const filename = `${directory}/${fileName}`;
		const template = (await fs.readFile(filename)).toString();

		return handlebars.compile(template);
	};

	/**
	 * Registers all templates as partials so that we can nest any template
	 * inside of any other template.
	 */
	private loadTemplates = async () => {
		const templateFiles = await glob(`${this.directory}/**/*.hbs`);

		for (let file of templateFiles) {
			const filePath = file.split("/").slice(0, -1).join("/");
			const fileName = file.split("/").slice(-1)[0];
			const templateName = file
				.split(this.directory)[1]
				.split(".")[0]
				.slice(1);
			const compiledTemplate = await this.compileTemplate(
				fileName,
				filePath,
			);

			handlebars.registerPartial(templateName, compiledTemplate);
			this.templates[templateName] = compiledTemplate;
		}
	};

	/**
	 * Sets the template to be rendered. If the template is not already
	 * registered, it will be compiled and then set as the current template.
	 */
	private setTemplate = async (name: string) => {
		if (this.templates[name]) {
			this.template = this.templates[name];
		} else {
			this.template = await this.compileTemplate(
				`${this.directory}/${name}.hbs`,
			);
		}
	};

	private setTemplateData = (data: Record<string, any>) => {
		this.data = data;
	};
}
