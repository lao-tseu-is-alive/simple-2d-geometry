import Point, { coordinate2dArray, iPoint } from "./Point.ts";
import Converters from "./Converters.ts";

export interface TriangleInterface {
  p1: iPoint;
  p2: iPoint;
  p3: iPoint;
  name?: string;
  isValid?: boolean;
}

export type coordinatesTriangleArray = [
  coordinate2dArray,
  coordinate2dArray,
  coordinate2dArray,
];

/**
 * Class representing  a triangle in 2 dimension cartesian space
 */
export default class Triangle {
  private _p1: Point = Point.fromArray([1, 0]); // default p1 point
  private _p2: Point = Point.fromArray([0, 1]); // default p2 point
  private _p3: Point = Point.fromArray([-1, 0]); // default p3 point
  private _name: string | undefined = undefined;

  get p1(): Point {
    return this._p1;
  }

  set p1(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.sameLocation(this._p2)) {
        throw new RangeError(
          `p1:'${value.dump()}' should be at different location from p2:'${this._p2.dump()}'`,
        );
      }
      if (value.sameLocation(this._p3)) {
        throw new RangeError(
          `p1:'${value.dump()}' should be at different location from p3:'${this._p3.dump()}'`,
        );
      }
      this._p1 = value;
    } else {
      throw new TypeError("start should be a Point object");
    }
  }

  get p2(): Point {
    return this._p2;
  }

  set p2(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.sameLocation(this._p1)) {
        throw new RangeError(
          `p2:'${value.dump()}' should be at different location from p1:'${this._p1.dump()}'`,
        );
      }
      if (value.sameLocation(this._p3)) {
        throw new RangeError(
          `p2:'${value.dump()}' should be at different location from p3:'${this._p3.dump()}'`,
        );
      }
      this._p2 = value;
    } else {
      throw new TypeError("p2 should be a Point object");
    }
  }

  get p3(): Point {
    return this._p3;
  }

  set p3(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.sameLocation(this._p2)) {
        throw new RangeError(
          `p3:'${value.dump()}' should be at different location from p2:'${this._p2.dump()}'`,
        );
      }
      if (value.sameLocation(this._p1)) {
        throw new RangeError(
          `p3:'${value.dump()}' should be at different location from p1:'${this._p1.dump()}'`,
        );
      }
      this._p3 = value;
    } else {
      throw new TypeError("start should be a Point object");
    }
  }

  get name(): string {
    if (this._name === undefined) {
      return "";
    }
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  /**
   * Creates a triangle
   * @param {Point} p1 first Point of the triangle
   * @param {Point} p2 second Point of the triangle
   * @param {Point} p3 third Point of the triangle
   * @param {string | undefined} name optional name of this triangle
   */
  constructor(p1: Point, p2: Point, p3: Point, name?: string) {
    if (p1 instanceof Point && p2 instanceof Point && p3 instanceof Point) {
      if (p1.sameLocation(p2)) {
        throw new RangeError(
          `p1:'${p1.dump()}' should be at different location from p2:'${p2.dump()}'`,
        );
      }
      if (p1.sameLocation(p3)) {
        throw new RangeError(
          `p1:'${p1.dump()}' should be at different location from p3:'${p3.dump()}'`,
        );
      }
      this.p1 = p1.clone();
      this.p2 = p2.clone(); // make a copy of the Point object
      this.p3 = p3.clone(); // make a copy of the Point object
      if (name !== undefined) this.name = name;
    } else {
      throw new TypeError(
        "Triangle constructor needs 3 Point objects as parameters",
      );
    }
  }

  /**
   * fromTriangle returns a new Triangle that is a copy (clone) of the otherTriangle passed has parameter
   * @param {Triangle} otherTriangle is the Triangle you want to copy
   * @returns {Triangle} a new Triangle located at the same cartesian coordinates as otherTriangle
   */
  static fromTriangle(otherTriangle: Triangle): Triangle {
    if (otherTriangle instanceof Triangle) {
      return new Triangle(
        otherTriangle.p1,
        otherTriangle.p2,
        otherTriangle.p3,
        otherTriangle.name,
      );
    } else {
      throw new TypeError(
        "fromTriangle needs parameter otherTriangle of type Triangle",
      );
    }
  }

  /**
   * fromArray returns a new Triangle constructed with
   * @param {[number, number]} coordinatesTriangle is an array of 2 points with 2d coordinates : [[number, number], [number, number]]
   * @returns {Triangle} a new Triangle at given coordinates p1:[x0,y0] and p2:[x1,y1]
   */
  static fromArray(coordinatesTriangle: coordinatesTriangleArray): Triangle {
    if (
      typeof coordinatesTriangle !== "undefined" &&
      coordinatesTriangle instanceof Array &&
      coordinatesTriangle.length === 3 &&
      typeof coordinatesTriangle[0][0] === "number"
    ) {
      return new Triangle(
        Point.fromArray(coordinatesTriangle[0]),
        Point.fromArray(coordinatesTriangle[1]),
        Point.fromArray(coordinatesTriangle[2]),
      );
    } else {
      throw new TypeError(
        "fromArray needs parameter coordinates to be an array of 2 points with 2d coordinates : [[number, number], [number, number]]",
      );
    }
  }

  private static fromObject(data: any) {
    const tempTriangle: TriangleInterface = Converters.convertToTriangle(data);
    return new Triangle(
      Point.fromObject(tempTriangle.p1),
      Point.fromObject(tempTriangle.p2),
      Point.fromObject(tempTriangle.p3),
      tempTriangle.name,
    );
  }

  static fromJSON(json: string): Triangle {
    try {
      const tmpObject = JSON.parse(json);
      return Triangle.fromObject(tmpObject);
    } catch (e) {
      throw new TypeError(
        `Triangle:fromJSON got ${e}, needs a valid JSON string as parameter :${json}`,
      );
    }
  }

  /**
   * clone  returns a new Triangle that is a copy of itself
   * @returns {Triangle} a new Triangle located at the same cartesian coordinates as this Triangle
   */
  clone(): Triangle {
    return Triangle.fromTriangle(this);
  }

  toString(
    separator: string = ",",
    surroundingParenthesis: boolean = true,
    precision: number = 2,
    withName: boolean = true,
  ): string {
    const tmpRes = `${this.p1.toString(separator, surroundingParenthesis, precision)}${separator}${this.p2.toString(separator, surroundingParenthesis, precision)}`;
    if (surroundingParenthesis) {
      return withName ? `${this.name}:(${tmpRes})` : `(${tmpRes})`;
    } else {
      return withName ? `${this.name}:${tmpRes}` : `${tmpRes}`;
    }
  }

  toJSON(): string {
    return `{"p1":${this.p1.toJSON()}, "p2":${this.p2.toJSON()}, "name":"${this.name}"}`;
  }

  /**
   * sameLocation allows to compare if this Triangle is at the same location as otherTriangle
   * @param {Triangle} otherTriangle
   * @returns {boolean}
   */
  sameLocation(otherTriangle: Triangle): boolean {
    if (otherTriangle instanceof Triangle) {
      return (
        this.p1.sameLocation(otherTriangle.p1) &&
        this.p2.sameLocation(otherTriangle.p2) &&
        this.p3.sameLocation(otherTriangle.p3)
      );
    } else {
      throw new TypeError(
        "A Triangle can only be compared to another Triangle",
      );
    }
  }

  /**
   * equal allows to compare equality with otherTriangle, they should have the same values for p1,p2 and p3
   * @param {Triangle} otherTriangle
   * @returns {boolean}
   */
  equal(otherTriangle: Triangle): boolean {
    if (otherTriangle instanceof Triangle) {
      return (
        this.sameLocation(otherTriangle) && this.name === otherTriangle.name
      );
    } else {
      throw new TypeError(
        "A Triangle can only be compared to another Triangle",
      );
    }
  }

  /**
   * rename allows to change the name attribute of the triangle
   * @param {string} newName is the new name of the triangle
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  rename(newName: string): this {
    this.name = newName;
    return this;
  }

  /**
   * area returns the area of the triangle
   * @returns {number} the area of the triangle
   */
  area(): number {
    return Math.abs(
      (this.p1.x * (this.p2.y - this.p3.y) +
        this.p2.x * (this.p3.y - this.p1.y) +
        this.p3.x * (this.p1.y - this.p2.y)) /
        2,
    );
  }
}
