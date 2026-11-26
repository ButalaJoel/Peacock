/* eslint-disable react-refresh/only-export-components */
// Build-time only: renders a page to HTML. Used by scripts/prerender.mjs, never shipped to visitors.
import { renderToString } from "react-dom/server";
import PeacockPaintsWebsite from "./PeacockPaintsWebsite.jsx";
export { getRouteMeta, headHtml, publicPaths, SITE } from "./seo/routes.js";
export const render = path => renderToString(<PeacockPaintsWebsite initialPath={path} />);
