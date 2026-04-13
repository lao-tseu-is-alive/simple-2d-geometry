import type { RenderDriver, RenderOptions } from "./RenderDriver.ts";

/**
 * Axis-aligned bounding box: [minX, minY, maxX, maxY]
 */
export type Extent = [number, number, number, number];

/**
 * Contract every geometry class must satisfy.
 * Enforces pure mathematical logic — zero rendering knowledge.
 */
export interface GeometryDriver {
  /** Compute the area enclosed by this geometry (0 for points and lines) */
  getArea(): number;

  /** Compute the perimeter / boundary length (0 for points) */
  getPerimeter(): number;

  /** Axis-aligned bounding box as [minX, minY, maxX, maxY] */
  getExtent(): Extent;

  /**
   * Visitor double-dispatch: calls the correct renderXxx method on the driver.
   * Each geometry implementation calls renderer.renderXxx(this, ...) so the
   * renderer receives the concrete type without instanceof checks.
   */
  accept<T>(renderer: RenderDriver<T>, options: RenderOptions, invertY: boolean): T;
}
