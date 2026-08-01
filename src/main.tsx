import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./styles/global.css";

/** One entry for both halves of the build: `vite-react-ssg build` renders each route to its own
 *  HTML file, and the same call hydrates that HTML in the browser. */
export const createRoot = ViteReactSSG({ routes });
