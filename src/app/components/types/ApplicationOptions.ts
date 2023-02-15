import { AppOptions, RecognizedString } from "uWebSockets.js";

/**
 * Representa las opciones de configuración de una appicación segura (SSL)
 * @author Lottie <enzodiazdev@gmail.com>
 */
type ApplicationOptions = AppOptions & {
  key_file_name:RecognizedString,
  cert_file_name:RecognizedString,
};

export default ApplicationOptions;
