import Point, { coordinate2dArray, iPoint } from "./Point.ts";
import Converters from "./Converters.ts";
import Angle from "./Angle.ts";

export interface LineInterface {
  start: iPoint;
  end: iPoint;
  name?: string;
  isValid?: boolean;
}

export type coordinatesLineArray = [coordinate2dArray, coordinate2dArray];

/**
 * Class representing  a line in 2 dimension cartesian space
 * @class Line
 * @property {Point} start Point of the line
 * @property {Point} end Point of the Line
 * @property {string} name optional name of this line
 * @property {number} length of the line
 * @property {number} angle of the line
 * @property {number} slope of the line
 */
export default class Line {
  private _start: Point = Point.fromArray([0, 0]); // default start point
  private _end: Point = Point.fromArray([1, 1]); // default end point
  private _name: string | undefined = undefined;

  get start(): Point {
    return this._start;
  }

  set start(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.isSameLocation(this._end)) {
        throw new RangeError(
          `start:'${value.dump()}' should be at different location from end:'${this._end.dump()}'`,
        );
      }
      this._start = value;
    } else {
      throw new TypeError("start should be a Point object");
    }
  }

  get end(): Point {
    return this._end;
  }

  set end(input: Point) {
    let value = input instanceof Point ? input : undefined;
    if (value !== undefined) {
      if (value.isSameLocation(this._start)) {
        throw new RangeError("end should be at different location from start");
      }
      this._end = value;
    } else {
      throw new TypeError("end should be a Point object");
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

  get length(): number {
    return this.start.distanceTo(this.end);
  }

  get angle(): Angle {
    return this.start.angleTo(this.end);
  }

  get slope(): number {
    return this.start.slopeTo(this.end);
  }

  /**
   * Creates a line
   * @param {Point} start Point of the line
   * @param {Point} end Point of the Line
   * @param {string | undefined} name optional name of this line
   */
  constructor(start: Point, end: Point, name?: string) {
    // console.log(`Line.ts:65 constructor with start:'${start.dump()}' and end:'${end.dump()}' and name:'${name}'`)
    if (start instanceof Point && end instanceof Point) {
      if (start.isSameLocation(end)) {
        throw new RangeError(
          `start:'${start.dump()}' should be at different location from end:'${end.dump()}'`,
        );
      }
      this.start = start.clone();
      this.end = end.clone(); // make a copy of the Point object
      if (name !== undefined) this.name = name;
    } else {
      throw new TypeError(
        "Line constructor needs 2 Point objects as parameters",
      );
    }
  }

  /**
   * fromLine returns a new Line that is a copy (clone) of the otherLine passed has parameter
   * @param {Line} otherLine is the Line you want to copy
   * @returns {Line} a new Line located at the same cartesian coordinates as otherLine
   */
  static fromLine(otherLine: Line): Line {
    if (otherLine instanceof Line) {
      return new Line(otherLine.start, otherLine.end, otherLine.name);
    } else {
      throw new TypeError("fromLine needs parameter otherLine of type Line");
    }
  }

  /**
   * fromArray returns a new Line constructed with
   * @param {[number, number]} coordinatesLine is an array of 2 points with 2d coordinates : [[number, number], [number, number]]
   * @returns {Line} a new Line at given coordinates start:[x0,y0] and end:[x1,y1]
   */
  static fromArray(coordinatesLine: coordinatesLineArray): Line {
    if (
      typeof coordinatesLine !== "undefined" &&
      coordinatesLine instanceof Array &&
      coordinatesLine.length === 2 &&
      typeof coordinatesLine[0][0] === "number"
    ) {
      return new Line(
        Point.fromArray(coordinatesLine[0]),
        Point.fromArray(coordinatesLine[1]),
      );
    } else {
      throw new TypeError(
        "fromArray needs parameter coordinates to be an array of 2 points with 2d coordinates : [[number, number], [number, number]]",
      );
    }
  }

  static fromObject(data: Object) {
    if (data === undefined || data === null) {
      throw new TypeError("cannot create a Line from nothing");
    }
    const tempLine: LineInterface = Converters.convertToLine(data);
    return new Line(
      Point.fromObject(tempLine.start),
      Point.fromObject(tempLine.end),
      tempLine.name,
    );
  }

  static fromJSON(json: string): Line {
    try {
      const tmpObject = JSON.parse(json);
      return Line.fromObject(tmpObject);
    } catch (e) {
      throw new TypeError(
        `Line:fromJSON got ${e}, needs a valid JSON string as parameter :${json}`,
      );
    }
  }

  /**
   * clone  returns a new Line that is a copy of itself
   * @returns {Line} a new Line located at the same cartesian coordinates as this Line
   */
  clone(): Line {
    return Line.fromLine(this);
  }

  toString(
    separator: string = ",",
    surroundingParenthesis: boolean = true,
    precision: number = 2,
    withName: boolean = true,
  ): string {
    const tmpRes = `${this.start.toString(separator, surroundingParenthesis, precision)}${separator}${this.end.toString(separator, surroundingParenthesis, precision)}`;
    if (surroundingParenthesis) {
      return withName ? `${this.name}:(${tmpRes})` : `(${tmpRes})`;
    } else {
      return withName ? `${this.name}:${tmpRes}` : `${tmpRes}`;
    }
  }

  toJSON(): string {
    return `{"start":${this.start.toJSON()}, "end":${this.end.toJSON()}, "name":"${this.name}"}`;
  }

  /**
   * sameLocation allows to compare if this Line is at the same location as otherLine
   * @param {Line} otherLine
   * @returns {boolean}
   */
  sameLocation(otherLine: Line): boolean {
    if (otherLine instanceof Line) {
      return (
        this.start.isSameLocation(otherLine.start) &&
        this.end.isSameLocation(otherLine.end)
      );
    } else {
      throw new TypeError("A Line can only be compared to another Line");
    }
  }

  /**
   * equal allows to compare equality with otherLine, they should have the same values for start and end
   * @param {Line} otherLine
   * @returns {boolean}
   */
  equal(otherLine: Line): boolean {
    if (otherLine instanceof Line) {
      return this.sameLocation(otherLine) && this.name === otherLine.name;
    } else {
      throw new TypeError("A Line can only be compared to another Line");
    }
  }

  /**
   * rename allows to change the name attribute of the line
   * @param {string} newName is the new name of the line
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  rename(newName: string): this {
    this.name = newName;
    return this;
  }
}
