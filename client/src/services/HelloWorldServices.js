/** Fichier de service axios
 * Creer une classe pour communiquer avec BackEnd via promises
 * Creer des requetes HTTP avec la route associée -> /server/routes/index.js
 */
import { http } from "./services.js";

class HelloWorldServices {
  getInfo() {
    return http.get('/');
  }

}
export default new HelloWorldServices();