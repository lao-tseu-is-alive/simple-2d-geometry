import * as utils from './index';

// We attach the full namespace to the window/global scope
// for the "tsSimple2dGeometry.umd.js" (IIFE) bundle.
(globalThis as Record<string, unknown>).tsSimple2dGeometry = utils;

// Optional: export it too, though for IIFE the global side-effect is what matters.
export default utils;
