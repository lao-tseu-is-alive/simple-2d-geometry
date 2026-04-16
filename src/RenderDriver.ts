import type Point from "./Point.ts";
import type Line from "./Line.ts";
import type Circle from "./Circle.ts";
import type Triangle from "./Triangle.ts";
import type { Extent } from "./Driver.ts";

/**
 * Visual styling options passed through to the render driver.
 */
export interface RenderOptions {
  /** CSS color string for stroke */
  stroke: string;
  /** Stroke width in world units */
  strokeWidth: number;
  /** CSS color string or "none" for fill */
  fill: string;
  /** Opacity value from 0.0 (transparent) to 1.0 (opaque) */
  opacity: number;
  /** Visual marker radius for Point geometries (in world units) */
  pointRadius: number;
}

/**
 * Options for composing individual renders into a final output frame.
 */
export interface ComposeOptions {
  /** If true, Y-coordinates are inverted for screen rendering */
  invertY: boolean;
  /** Padding around the content in world units */
  padding: number;
  /** Optional explicit width for the output frame */
  width?: number;
  /** Optional explicit height for the output frame */
  height?: number;
}

/**
 * A pluggable render driver targeting a specific output.
 *
 * TOutput is `string` for SVG, `void` for Canvas2D, etc.
 * Each geometry type has a dedicated render method to preserve
 * full type information without instanceof checks or switches.
 */
export interface RenderDriver<TOutput = string> {
  renderPoint(point: Point, options: RenderOptions, invertY: boolean): TOutput;
  renderLine(line: Line, options: RenderOptions, invertY: boolean): TOutput;
  renderCircle(circle: Circle, options: RenderOptions, invertY: boolean): TOutput;
  renderTriangle(triangle: Triangle, options: RenderOptions, invertY: boolean): TOutput;

  /**
   * Compose individual rendered elements into a final output frame.
   * For SVG this wraps elements in an <svg> tag with a computed viewBox.
   */
  compose(elements: TOutput[], viewBox: Extent, options: ComposeOptions): TOutput;
}
