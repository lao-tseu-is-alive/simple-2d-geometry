import Point, { coordinate2dArray, iPoint } from "./Point.ts";
import Converters from "./Converters.ts";
import { EPSILON } from "./Geometry.ts";

/**
 * TriangleInterface is an interface for a Triangle object
 * @interface TriangleInterface
 * @property {iPoint} pA first Point of the triangle
 * @property {iPoint} pB second Point of the triangle
 * @property {iPoint} pC third Point of the triangle
 * @property {string} name optional name of this triangle
 */
export interface TriangleInterface {
  pA: iPoint;
  pB: iPoint;
  pC: iPoint;
  name?: string;
}

/**
 * coordinatesTriangleArray is an array of 3 points with 2d coordinates
 */
export type coordinatesTriangleArray = [
  coordinate2dArray,
  coordinate2dArray,
  coordinate2dArray,
];

/**
 * Class representing  a triangle in 2 dimension cartesian space
 * @class Triangle
 * @implements {TriangleInterface}
 * @property {Point} pA first Point of the triangle
 * @property {Point} pB second Point of the triangle
 * @property {Point} pC third Point of the triangle
 * @property {string} optional name of this triangle
 * @property {a} returns the length of side a opposite the angle A and pA of the triangle
 * @property {b} returns the length of side b opposite the angle B and pB of the triangle
 * @property {c} returns the length of side c opposite the angle C and pC of the triangle
 * @example const T0 = new Triangle(new Point(0,0,'P0'), new Point(1,1,'P1'), new Point(1,0,'P2'), "T0");
 */
export default class Triangle {
  private _pA: Point = Point.fromArray([1, 0]); // default pA point
  private _pB: Point = Point.fromArray([0, 1]); // default pB point
  private _pC: Point = Point.fromArray([-1, 0]); // default pC point
  private _name: string | undefined = undefined;

  get pA(): Point {
    return this._pA;
  }

  set pA(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.sameLocation(this._pB)) {
        throw new RangeError(
          `pA:'${value.dump()}' should be at different location from pB:'${this._pB.dump()}'`,
        );
      }
      if (value.sameLocation(this._pC)) {
        throw new RangeError(
          `pA:'${value.dump()}' should be at different location from pC:'${this._pC.dump()}'`,
        );
      }
      this._pA = value;
    } else {
      throw new TypeError("start should be a Point object");
    }
  }

  get pB(): Point {
    return this._pB;
  }

  set pB(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.sameLocation(this._pA)) {
        throw new RangeError(
          `pB:'${value.dump()}' should be at different location from pA:'${this._pA.dump()}'`,
        );
      }
      if (value.sameLocation(this._pC)) {
        throw new RangeError(
          `pB:'${value.dump()}' should be at different location from pC:'${this._pC.dump()}'`,
        );
      }
      this._pB = value;
    } else {
      throw new TypeError("pB should be a Point object");
    }
  }

  get pC(): Point {
    return this._pC;
  }

  set pC(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.sameLocation(this._pB)) {
        throw new RangeError(
          `pC:'${value.dump()}' should be at different location from pB:'${this._pB.dump()}'`,
        );
      }
      if (value.sameLocation(this._pA)) {
        throw new RangeError(
          `pC:'${value.dump()}' should be at different location from pA:'${this._pA.dump()}'`,
        );
      }
      this._pC = value;
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
   * a returns the length of side a opposite the angle A and pA of the triangle
   */
  get a(): number {
    return this.pB.distanceTo(this.pC);
  }

  /**
   * b returns the length of side b opposite the angle B and pB of the triangle
   */
  get b(): number {
    return this.pA.distanceTo(this.pC);
  }

  /**
   * c returns the length of side c opposite the angle C and pC of the triangle
   */
  get c(): number {
    return this.pA.distanceTo(this.pB);
  }

  /**
   * Creates a triangle
   * @param {Point} pA first Point of the triangle
   * @param {Point} pB second Point of the triangle
   * @param {Point} pC third Point of the triangle
   * @param {string | undefined} name optional name of this triangle
   */
  constructor(pA: Point, pB: Point, pC: Point, name?: string) {
    if (pA instanceof Point && pB instanceof Point && pC instanceof Point) {
      if (pA.sameLocation(pB)) {
        throw new RangeError(
          `pA:'${pA.dump()}' should be at different location from pB:'${pB.dump()}'`,
        );
      }
      if (pA.sameLocation(pC)) {
        throw new RangeError(
          `pA:'${pA.dump()}' should be at different location from pC:'${pC.dump()}'`,
        );
      }
      this.pA = pA.clone();
      this.pB = pB.clone(); // make a copy of the Point object
      this.pC = pC.clone(); // make a copy of the Point object
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
        otherTriangle.pA,
        otherTriangle.pB,
        otherTriangle.pC,
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
   * @returns {Triangle} a new Triangle at given coordinates pA:[x0,y0] and pB:[x1,y1]
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

  static fromObject(data: any) {
    const tempTriangle: TriangleInterface = Converters.convertToTriangle(data);
    return new Triangle(
      Point.fromObject(tempTriangle.pA),
      Point.fromObject(tempTriangle.pB),
      Point.fromObject(tempTriangle.pC),
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
   * isValidTriangleSides returns true if the given sides of the triangle are valid
   * @param {number} a length of side a opposite the angle A and pA of the triangle
   * @param {number} b length of side b opposite the angle B and pB of the triangle
   * @param {number} c length of side c opposite the angle C and pC of the triangle
   * @returns {boolean} true if the sides of the triangle are valid
   */
  static isValidTriangleSides(a: number, b: number, c: number): boolean {
    return a + b > c && a + c > b && b + c > a;
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
    const tmpRes = `${this.pA.toString(separator, surroundingParenthesis, precision)}${separator}${this.pB.toString(separator, surroundingParenthesis, precision)}`;
    if (surroundingParenthesis) {
      return withName ? `${this.name}:(${tmpRes})` : `(${tmpRes})`;
    } else {
      return withName ? `${this.name}:${tmpRes}` : `${tmpRes}`;
    }
  }

  toJSON(): string {
    return `{"pA":${this.pA.toJSON()}, "pB":${this.pB.toJSON()}, "name":"${this.name}"}`;
  }

  /**
   * sameLocation allows to compare if this Triangle is at the same location as otherTriangle
   * @param {Triangle} otherTriangle
   * @returns {boolean}
   */
  sameLocation(otherTriangle: Triangle): boolean {
    if (otherTriangle instanceof Triangle) {
      return (
        this.pA.sameLocation(otherTriangle.pA) &&
        this.pB.sameLocation(otherTriangle.pB) &&
        this.pC.sameLocation(otherTriangle.pC)
      );
    } else {
      throw new TypeError(
        "A Triangle can only be compared to another Triangle",
      );
    }
  }

  /**
   * equal allows to compare equality with otherTriangle, they should have the same values for pA,pB and pC
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
   * derived from the shoelace formula : https://en.wikipedia.org/wiki/Shoelace_formula
   * @returns {number} the area of the triangle
   */
  area(): number {
    return Math.abs(
      (this.pA.x * (this.pB.y - this.pC.y) +
        this.pB.x * (this.pC.y - this.pA.y) +
        this.pC.x * (this.pA.y - this.pB.y)) /
        2,
    );
  }

  /**
   * perimeter returns the perimeter of the triangle
   * @returns {number} the perimeter of the triangle
   */
  perimeter(): number {
    return this.a + this.b + this.c;
  }

  /**
   * isEquilateral returns true if the triangle is equilateral
   */
  isEquilateral(): boolean {
    return (
      Math.abs(this.a - this.b) <= EPSILON &&
      Math.abs(this.b - this.c) <= EPSILON
    );
  }
}
