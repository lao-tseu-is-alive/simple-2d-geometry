import type { GeometryDriver, Extent } from "../../geom-2d-core";
import type { RenderDriver, ComposeOptions } from "../../geom-2d-core";
import type Feature from "./Feature.ts";

/**
 * Configuration options for the DrawingBoard.
 */
export interface DrawingBoardOptions {
  /** Padding around the content in world units (default: 10) */
  padding: number;
  /** If true, Y-coordinates are inverted for screen rendering (default: true) */
  invertY: boolean;
  /** Optional explicit width for the output frame */
  width?: number;
  /** Optional explicit height for the output frame */
  height?: number;
}

const DEFAULT_BOARD_OPTIONS: DrawingBoardOptions = {
  padding: 10,
  invertY: true,
};

/**
 * DrawingBoard aggregates Feature instances and delegates to a RenderDriver
 * to produce the final composed output (e.g. a complete SVG document).
 *
 * Generic over TOutput: `string` for SVG, `void` for Canvas2D, etc.
 */
export default class DrawingBoard<TOutput = string> {
  private readonly _renderer: RenderDriver<TOutput>;
  private readonly _options: DrawingBoardOptions;
  private readonly _features: Feature<GeometryDriver>[] = [];

  constructor(renderer: RenderDriver<TOutput>, options?: Partial<DrawingBoardOptions>) {
    this._renderer = renderer;
    this._options = { ...DEFAULT_BOARD_OPTIONS, ...options };
  }

  /** Read-only snapshot of the feature list */
  get features(): readonly Feature<GeometryDriver>[] {
    return this._features;
  }

  /**
   * Add a feature to the board.
   * @returns this (for chaining)
   */
  add(feature: Feature<GeometryDriver>): this {
    this._features.push(feature);
    return this;
  }

  /**
   * Remove a feature from the board by reference equality.
   * @returns this (for chaining)
   */
  remove(feature: Feature<GeometryDriver>): this {
    const index = this._features.indexOf(feature);
    if (index !== -1) {
      this._features.splice(index, 1);
    }
    return this;
  }

  /**
   * Remove all features from the board.
   * @returns this (for chaining)
   */
  clear(): this {
    this._features.length = 0;
    return this;
  }

  /**
   * Compute the union bounding box of all visible features.
   * Returns [0, 0, 0, 0] if no visible features exist.
   */
  getGlobalExtent(): Extent {
    const visible = this._features.filter(f => f.isVisible);
    if (visible.length === 0) {
      return [0, 0, 0, 0];
    }

    let [minX, minY, maxX, maxY] = visible[0]!.getExtent();
    for (let i = 1; i < visible.length; i++) {
      const [eMinX, eMinY, eMaxX, eMaxY] = visible[i]!.getExtent();
      minX = Math.min(minX, eMinX);
      minY = Math.min(minY, eMinY);
      maxX = Math.max(maxX, eMaxX);
      maxY = Math.max(maxY, eMaxY);
    }

    return [minX, minY, maxX, maxY];
  }

  /**
   * Render all visible features through the render driver.
   *
   * 1. Filters to visible features
   * 2. Sorts by zIndex (ascending — lower zIndex renders first / behind)
   * 3. Renders each feature via double dispatch
   * 4. Composes them into a final output via the driver's compose()
   */
  render(): TOutput {
    const { invertY, padding, width, height } = this._options;

    const visible = this._features
      .filter(f => f.isVisible)
      .sort((a, b) => a.zIndex - b.zIndex);

    const elements = visible.map(f => f.render(this._renderer, invertY));
    const globalExtent = this.getGlobalExtent();

    const composeOptions: ComposeOptions = {
      invertY,
      padding,
      width,
      height,
    };

    return this._renderer.compose(elements, globalExtent, composeOptions);
  }
}
