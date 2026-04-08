import * as utils from './index';

// We attach the full namespace to the window/global scope
// for the "cgilHtmlUtils.umd.js" (IIFE) bundle.
(globalThis as any).cgilHtmlUtils = utils;

// Optional: export it too, though for IIFE the global side-effect is what matters.
export default utils;
