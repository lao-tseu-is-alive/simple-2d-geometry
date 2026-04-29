import type { GeometryDriver, Extent } from "../../geom-2d-core";
import type { RenderDriver, RenderOptions } from "../../geom-2d-core";

/**
 * Configuration options for a Feature's visual state.
 */
export interface FeatureOptions {
  /** CSS color string for stroke (default: "#000000") */
  stroke: string;
  /** Stroke width in world units (default: 1) */
  strokeWidth: number;
  /** CSS color string or "none" for fill (default: "none") */
  fill: string;
  /** Opacity from 0.0 to 1.0 (default: 1.0) */
  opacity: number;
  /** Visual marker radius for Point geometries (default: 3) */
  pointRadius: number;
  /** Whether this feature is rendered (default: true) */
  isVisible: boolean;
  /** Z-ordering index — higher values render on top (default: 0) */
  zIndex: number;
}

const DEFAULT_FEATURE_OPTIONS: FeatureOptions = {
  stroke: "#000000",
  strokeWidth: 1,
  fill: "none",
  opacity: 1.0,
  pointRadius: 3,
  isVisible: true,
  zIndex: 0,
};

/**
 * Feature wraps a GeometryDriver with visual state and delegates
 * all math and rendering to its internal driver.
 *
 * Contains zero trigonometry or rendering logic.
 */
export default class Feature<G extends GeometryDriver> {
  private readonly _geometry: G;
  private _options: FeatureOptions;

  constructor(geometry: G, options?: Partial<FeatureOptions>) {
    this._geometry = geometry;
    this._options = { ...DEFAULT_FEATURE_OPTIONS, ...options };
  }

  // ── Read-only geometry accessor ──────────────────────────────

  /** The underlying geometry driver */
  get geometry(): G {
    return this._geometry;
  }

  // ── Visual state accessors ───────────────────────────────────

  get stroke(): string {
    return this._options.stroke;
  }
  set stroke(value: string) {
    this._options.stroke = value;
  }

  get strokeWidth(): number {
    return this._options.strokeWidth;
  }
  set strokeWidth(value: number) {
    this._options.strokeWidth = value;
  }

  get fill(): string {
    return this._options.fill;
  }
  set fill(value: string) {
    this._options.fill = value;
  }

  get opacity(): number {
    return this._options.opacity;
  }
  set opacity(value: number) {
    this._options.opacity = value;
  }

  get pointRadius(): number {
    return this._options.pointRadius;
  }
  set pointRadius(value: number) {
    this._options.pointRadius = value;
  }

  get isVisible(): boolean {
    return this._options.isVisible;
  }
  set isVisible(value: boolean) {
    this._options.isVisible = value;
  }

  get zIndex(): number {
    return this._options.zIndex;
  }
  set zIndex(value: number) {
    this._options.zIndex = value;
  }

  // ── Delegated math methods ───────────────────────────────────

  /** Delegates to geometry.getArea() */
  getArea(): number {
    return this._geometry.getArea();
  }

  /** Delegates to geometry.getPerimeter() */
  getPerimeter(): number {
    return this._geometry.getPerimeter();
  }

  /** Delegates to geometry.getExtent() */
  getExtent(): Extent {
    return this._geometry.getExtent();
  }

  // ── Rendering ────────────────────────────────────────────────

  /**
   * Builds RenderOptions from this feature's visual state and
   * delegates rendering to the geometry via double dispatch.
   */
  render<T = string>(renderer: RenderDriver<T>, invertY: boolean): T {
    const options: RenderOptions = {
      stroke: this._options.stroke,
      strokeWidth: this._options.strokeWidth,
      fill: this._options.fill,
      opacity: this._options.opacity,
      pointRadius: this._options.pointRadius,
    };
    return this._geometry.accept(renderer, options, invertY);
  }
}
