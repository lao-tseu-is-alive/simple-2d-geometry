import Point, {type coordinate2dArray, type iPoint} from "./Point.ts";
import type { GeometryDriver, Extent } from "./Driver.ts";
import type { RenderDriver, RenderOptions } from "./RenderDriver.ts";

export interface CircleInterface {
  center: iPoint;
  radius: number;
  name?: string;
}

/**
 * Class representing  a circle in 2 dimension cartesian space
 */
export default class Circle implements GeometryDriver {
  private _center: Point = Point.fromArray([0, 0]); // default center point
  private _radius: number = 1.0; // default radius
  private _name: string | undefined = undefined;

  get center(): Point {
    return this._center;
  }

  set center(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      this._center = value;
    } else {
      throw new TypeError("center should be a Point object");
    }
  }

  get radius(): number {
    return this._radius;
  }

  set radius(input: number) {
    let value = input;
    if (value > 0) {
      this._radius = value;
    } else {
      throw new RangeError("radius should be a positive number");
    }
  }

  get name(): string {
    if (this._name === undefined) {
      return "";
    }
    return this._name;
  }
  set name(input: string) {
    let value = input;
    if (typeof value === "string") {
      this._name = value;
    } else {
      throw new TypeError("name should be a string");
    }
  }

  constructor(center: Point, radius: number, name?: string) {
    this.center = center;
    this.radius = radius;
    if (name !== undefined) {
      this.name = name;
    }
  }

  /**
   * Creates a circle from a center and a radius
   * @param {Point} center Point of the circle
   * @param {number} radius radius of the circle
   * @param {string | undefined} name optional name of this circle
   */
  static fromCenterRadius(
    center: Point,
    radius: number,
    name?: string,
  ): Circle {
    return new Circle(center, radius, name);
  }

  /**
   * Creates a circle from an array of 3 numbers
   * @param {number[]} inputArray array of 3 numbers [x,y,radius]
   * @param {string | undefined} name optional name of this circle
   */
  static fromArray(inputArray: [number,number,number], name?: string): Circle {
    if (inputArray === undefined) {
      throw new TypeError(
        "Circle should be created from an array of 3 numbers",
      );
    }
    if (inputArray.length === 3) {
      return new Circle(
        Point.fromArray(inputArray.slice(0, 2) as coordinate2dArray),
        inputArray[2],
        name,
      );
    } else {
      throw new RangeError(
        "Circle should be created from an array of 3 numbers",
      );
    }
  }

  /**
   * area of the circle
   */
  area(): number {
    return Math.PI * this.radius * this.radius;
  }

  // ── GeometryDriver implementation ──────────────────────────────

  /**
   * Returns the area of the circle (delegates to area()).
   */
  getArea(): number {
    return this.area();
  }

  /**
   * Returns the circumference of the circle.
   */
  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  /**
   * Returns the axis-aligned bounding box of the circle.
   */
  getExtent(): Extent {
    return [
      this.center.x - this.radius,
      this.center.y - this.radius,
      this.center.x + this.radius,
      this.center.y + this.radius,
    ];
  }

  /**
   * Visitor double-dispatch: delegates to renderer.renderCircle.
   */
  accept<T = string>(renderer: RenderDriver<T>, options: RenderOptions, invertY: boolean): T {
    return renderer.renderCircle(this, options, invertY);
  }
}
