import "dotenv/config";

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

/**
 * Current public path of the application.
 */
export const BASE_PATH = `http://${hostname}:${port}`;

/**
 * Relative path to where the CSS Styles exist.
 */
export const STYLES_PATH = "styles";

/**
 * Relative path to where the images exist.
 */
export const IMAGES_PATH = "images";

/**
 * Generates a full url to the desired path.
 * Can pass optional parameters to map to tokens in url path.
 *
 * @param string path
 * @param array parameters
 * @example /pokemon/:id + { id: 1 } = https://localhost:3000/pokemon/1
 */
export const getPath = (path = "", parameters?: Record<string, string>) => {
	let url = `${BASE_PATH}/${path}`;

	if (!parameters) {
		return url;
	}

	/**
	 * Replace tokens in the url with the parameters.
	 */
	for (let [key, value] of Object.entries(parameters)) {
		url = url.replace(`:${key}`, value);
	}

	return url;
};

/**
 * Generates a full url to the desired styles path.
 */
export const getStylesPath = (path: string) => {
	return getPath(`${STYLES_PATH}/${path}`);
};

/**
 * Generates a full url to the desired images path.
 */
export const getImagesPath = (path: string) => {
	return getPath(`${IMAGES_PATH}/${path}`);
};
