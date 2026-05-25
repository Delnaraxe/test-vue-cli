/** Instance Axios centralisée
 * base URL, gestion token et interceptors
 * Axios retourne des promesses
 */
import axios from "axios";
let baseURL = process.env.VUE_APP_GLOBAL_URL;

/** Configuration globale de axios */
const httpConfiguration = {
	baseURL: baseURL,
	headers: {
		'Content-type': 'application/json'
	}
};
const http = axios.create(httpConfiguration);

export {
  http,
};