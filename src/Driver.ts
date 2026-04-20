import type { RenderDriver, RenderOptions } from "./RenderDriver.ts";

/**
 * Represents an Axis-Aligned Bounding Box.
 * Extremely useful for broad-phase collision detection.
 */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

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
  accept<T = string>(renderer: RenderDriver<T>, options: RenderOptions, invertY: boolean): T;
}
