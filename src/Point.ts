import Angle from "./Angle.ts";
import {
  EPSILON,
  getNumberOrFail,
  isNumeric,
  PRECISION,
  roundNumber,
} from "./Geometry.ts";
import Converters from "./Converters.ts";

export interface iPoint {
  x: number;
  y: number;
  name?: string;
}

export type coordinate2dArray = [number, number];

/**
 * Class representing  a point in 2 dimension cartesian space
 */
export default class Point implements iPoint {
  private p: iPoint = { x: 0, y: 0, name: "" };

  get x(): number {
    return this.p.x;
  }

  set x(input: number | string) {
    let value = typeof input === "number" ? input : getNumberOrFail(input);
    if (value !== undefined) {
      this.p.x = value;
    }
  }

  get y(): number {
    return this.p.y;
  }

  set y(input: number | string) {
    let value = typeof input === "number" ? input : getNumberOrFail(input);
    if (value !== undefined) {
      this.p.y = value;
    }
  }

  get name(): string {
    if (this.p.name === undefined) {
      return "";
    }
    return this.p.name;
  }

  set name(value: string) {
    this.p.name = value;
  }

  /**
   * Creates a Point instance
   * @param { number} x coordinates in cartesian space
   * @param { number } y coordinates in cartesian space
   * @param { string | undefined} name optional name of this point
   */
  constructor(x: number = 0, y: number = 0, name?: string) {
    if (typeof x !== "number" || typeof y !== "number") {
      throw new TypeError("Expected coordinates to be a number");
    }
    if (!isFinite(x) || !isFinite(y)) {
      throw new RangeError("Expected coordinates to be finite numbers");
    }
    this.p = { x: 0, y: 0 };
    this.x = x;
    this.y = y;
    if (name !== undefined) this.name = name;
  }

  /**
   * fromPolar creates a new Point in cartesian space from polar coordinates
   * @param {number} radius is the distance from origin to the point
   * @param {Angle} theta is the angle from x axes origin to point in mathematical order Counter-Clockwise
   * @param {string} name optional name of this point
   * @returns {Point} a new Point(x,y) located at the given polar coordinates
   */
  static fromPolar(
    radius: number,
    theta: Angle,
    name: string | undefined,
  ): Point {
    if (!isNumeric(radius)) {
      throw new TypeError("fromPolar needs radius to be valid numbers !");
    }
    let tmpPoint: Point = new Point(0, 0, name);
    let angle: number = theta.toRadians();
    const tmpX = radius * Math.cos(angle);
    tmpPoint.x = Math.abs(tmpX) <= EPSILON ? 0 : roundNumber(tmpX, PRECISION);
    const tmpY = radius * Math.sin(angle);
    tmpPoint.y = Math.abs(tmpY) <= EPSILON ? 0 : roundNumber(tmpY, PRECISION);
    return tmpPoint;
  }

  /**
   * fromPoint returns a new Point that is a copy (clone) of the otherPoint passed has parameter
   * @param {Point} otherPoint is the Point you want to copy
   * @returns {Point} a new Point located at the same cartesian coordinates as otherPoint
   */
  static fromPoint(otherPoint: Point): Point {
    if (otherPoint instanceof Point) {
      return new Point(otherPoint.x, otherPoint.y, otherPoint.name);
    } else {
      throw new TypeError("fromPoint needs parameter otherPoint of type Point");
    }
  }

  /**
   * fromArray returns a new Point constructed with
   * @param {[number, number]} coordinates is array containing number x as first element and y as second
   * @returns {Point} a new Point located at the same cartesian coordinates as coordinates[x,y]
   */
  static fromArray(coordinates: coordinate2dArray): Point {
    if (
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      return new Point(coordinates[0], coordinates[1]);
    } else {
      throw new TypeError(
        "fromArray needs parameter coordinates to be an array of 2 numbers [number, number]",
      );
    }
  }

  /**
   * fromObject returns a new Point constructed with an object that contains x and y properties
   * @param data
   */
  static fromObject(data: any): Point {
    if (data === undefined || data === null) {
      throw new TypeError("Point data is undefined or null");
    }
    const tempPoint: iPoint = Converters.convertToPoint(data);
    return new Point(tempPoint.x, tempPoint.y, tempPoint.name);
  }

  /**
   * fromJSON returns a new Point constructed with a JSON string
   * @param {string} json is a string representing a Point object in JSON format
   * @returns {Point} a new Point located at the same cartesian coordinates as the JSON string
   */
  static fromJSON(json: string): Point {
    if (json.trim() === "") {
      throw new TypeError("fromJSON needs a valid JSON string as parameter");
    }
    try {
      const tmpObject = JSON.parse(json);
      return Point.fromObject(tmpObject);
    } catch (e) {
      throw new TypeError("fromJSON needs a valid JSON string as parameter");
    }
  }
  /** determinant returns the determinant of the triangle p1,p2 and p3
   * @returns {number} the determinant of the triangle
   */
  static determinant(p1: Point, p2: Point, p3: Point): number {
    return p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y);
  }

  /** isCollinear returns true if the three points are collinear
   * @returns {boolean} true if the three points are collinear
   */
  static isCollinear(p1: Point, p2: Point, p3: Point): boolean {
    return Math.abs(Point.determinant(p1, p2, p3)) <= EPSILON;
  }

  /**
   * clone  returns a new Point that is a copy of itself
   * @returns {Point} a new Point located at the same cartesian coordinates as otherPoint
   */
  clone(): Point {
    return Point.fromPoint(this);
  }

  /**
   * dump returns a string with all Point attributes values
   * @returns {string}
   */
  dump(): string {
    return `Point[${this.name}](${this.p.x}, ${this.p.y})`;
  }

  /**
   * toString returns a string representation of this class instance with options for presentations
   * @param {string} separator placed between x and y values ', ' by default
   * @param {boolean} surroundingParenthesis allow to tell if result string should be surrounded with parenthesis (True by default)
   * @param {number} precision defines the number of decimals for the coordinates (2 by default)
   * @returns {string}
   */
  toString(
    separator: string = ",",
    surroundingParenthesis: boolean = true,
    precision: number = 2,
  ): string {
    if (surroundingParenthesis) {
      return `(${roundNumber(this.x, precision)}${separator}${roundNumber(this.y, 2)})`;
    } else {
      return `${roundNumber(this.x, precision)}${separator}${roundNumber(this.y, 2)}`;
    }
  }

  /**
   * toArray returns an array representation of this Point class instance [x, y]
   * @returns {[number, number]} [x, y]
   */
  toArray(): coordinate2dArray {
    return [this.x, this.y];
  }

  /**
   * toWKT returns an OGC Well-known text (WKT) representation of this class instance
   * https://en.wikipedia.org/wiki/Well-known_text
   * @returns {string}
   */
  toWKT(): string {
    return `POINT(${this.x} ${this.y})`;
  }

  /**
   * toEWKT returns an Postgis Extended Well-known text (EWKT) representation of this class instance
   * https://postgis.net/docs/using_postgis_dbmanagement.html#EWKB_EWKT
   * @param {number} srid is the Spatial reference systems identifier EPSG code default is 2056 for Switzerland MN03
   * @returns {string}
   */
  toEWKT(srid: number = 2056): string {
    return `SRID=${srid};POINT(${this.x} ${this.y})`;
  }

  // Note : to implement toEWKB I can maybe use this lib : https://github.com/cschwarz/wkx

  /**
   * toGeoJSON returns a GeoJSON (http://geojson.org/) representation of this class instance geometry
   * @returns {string}
   */
  toGeoJSON(): string {
    return `{"type":"Point","coordinates":[${this.x},${this.y}]}`;
  }

  /**
   * toJSON returns a JSON  representation of this class instance geometry
   * @returns {string}
   */
  toJSON(): string {
    return `{"x":${this.x},"y":${this.y},"name":"${this.name}"}`;
  }

  /**
   * getDistanceFromOrigin returns the length of the vector from origin to this point
   */
  getDistanceFromOrigin(): number {
    return Math.sqrt(this.p.x * this.p.x + this.p.y * this.p.y);
  }

  /**
   * norm returns the Euclidean norm (magnitude or length from origin) of the point
   */
  norm(): number {
    return this.getDistanceFromOrigin();
  }

  /**
   * normalize converts this point to a unit vector
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  normalize(): Point {
    const norm = this.norm();
    if (Math.abs(norm) <= EPSILON) {
      return new Point(0, 0);
    }
    return this.clone().divide(norm);
  }

  /**
   * add will add the coordinates of the otherPoint to a copy of this Point
   * @param {Point} otherPoint
   * @returns {Point} return a new Point object with the sum of this Point and otherPoint
   * @throws {TypeError} if otherPoint is not a Point
   */
  add(otherPoint: Point): Point {
    if (otherPoint instanceof Point) {
      return this.clone().moveRel(otherPoint.x, otherPoint.y);
    } else {
      throw new TypeError("Point.add(otherPoint) expects a Point as parameter");
    }
  }

  /**
   * subtract will subtract the coordinates of the otherPoint to a copy of this Point
   * @param {Point} otherPoint
   * @returns {Point} return a new Point object with the difference of this Point and otherPoint
   * @throws {TypeError} if otherPoint is not a Point
   */
  subtract(otherPoint: Point): Point {
    if (otherPoint instanceof Point) {
      return this.clone().moveRel(-otherPoint.x, -otherPoint.y);
    } else {
      throw new TypeError(
        "Point.subtract(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * multiply will scale the coordinates of a copy of this Point by the factor c
   * @param {number} c is the factor to multiply the coordinates of this Point
   * @returns {Point} return a new Point object with the coordinates of this Point multiplied by c
   * @throws {TypeError} if c is not a number
   */
  multiply(c: number): Point {
    if (isNumeric(c)) {
      const tmpPoint = this.clone();
      tmpPoint.x *= c;
      tmpPoint.y *= c;
      return tmpPoint;
    } else {
      throw new TypeError("Point.multiply(c) expects a number as parameter");
    }
  }

  /**
   * divide will scale the coordinates of a copy of this Point by the factor 1/c
   * @param {number} c is the factor to divide the coordinates of this Point
   * @returns {Point} return a new Point object with the coordinates of this Point divided by c
   * @throws {TypeError} if c is not a number
   */
  divide(c: number): Point {
    if (isNumeric(c)) {
      const tmpPoint = this.clone();
      tmpPoint.x /= c;
      tmpPoint.y /= c;
      return tmpPoint;
    } else {
      throw new TypeError("Point.divide(c) expects a number as parameter");
    }
  }

  /**
   * dot will calculate the dot product of this Point with otherPoint
   * @param {Point} otherPoint
   * @returns {number} the dot product of this Point and otherPoint
   * @throws {TypeError} if otherPoint is not a Point
   */
  dot(otherPoint: Point): number {
    if (otherPoint instanceof Point) {
      return this.x * otherPoint.x + this.y * otherPoint.y;
    } else {
      throw new TypeError("Point.dot(otherPoint) expects a Point as parameter");
    }
  }

  /**
   * cross will calculate the cross product of this Point with otherPoint
   * @param {Point} otherPoint
   * @returns {number} the cross product of this Point and otherPoint
   * @throws {TypeError} if otherPoint is not a Point
   */
  cross(otherPoint: Point): number {
    if (otherPoint instanceof Point) {
      return this.x * otherPoint.y - this.y * otherPoint.x;
    } else {
      throw new TypeError(
        "Point.cross(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * getAngleRad gives the angle in Radian from horizontal axis x with the vector from origin to this point
   */
  getAngleRad(): number {
    return Math.atan2(this.p.y, this.p.x);
  }

  /**
   * getAngleDeg gives the angle in degree from horizontal axis x with the vector from origin to this point
   */
  getAngleDeg(): number {
    return (Math.atan2(this.p.y, this.p.x) * 360) / (2 * Math.PI);
  }

  /**
   * moveToArray will move this Point to the new position in cartesian space given by the arrCoordinates
   * @param {Array} arrCoordinates is an array with the 2 cartesian coordinates [x, y]
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  moveToArray(arrCoordinates: coordinate2dArray): Point {
    this.x = arrCoordinates[0];
    this.y = arrCoordinates[1];
    return this;
  }

  /**
   * moveTo will move this Point to the new position in cartesian space given by the newX and newY values
   * @param {number} newX is the new x coordinates in cartesian space of this Point
   * @param {number} newY is the new y coordinates in cartesian space of this Point
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  moveTo(newX: number, newY: number): Point {
    this.x = newX;
    this.y = newY;
    return this;
  }

  /**
   * moveRel move this Point relative to its position by the deltaX, deltaY displacement in cartesian space
   * @param {number} deltaX is the new x coordinates in cartesian space of this Point
   * @param {number} deltaY is the new y coordinates in cartesian space of this Point
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  moveRel(deltaX: number, deltaY: number): Point {
    this.x += deltaX;
    this.y += deltaY;
    return this;
  }

  /**
   * move this Point relative to its position by the arrVector displacement in cartesian space
   * @param {Array} arrVector is an array representing the vector displacement to apply to actual coordinates [deltaX, deltaY]
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  moveRelArray(arrVector: coordinate2dArray): Point {
    if (isNumeric(arrVector[0]) && isNumeric(arrVector[1])) {
      this.x = this.x + arrVector[0];
      this.y = this.y + arrVector[1];
      return this;
    } else {
      throw new TypeError(
        "moveRelArray needs an array of 2 numbers like this [1.0, 2.0]",
      );
    }
  }

  /**
   * moveRelPolar this Point relative to its position by the polar displacement in cartesian space
   * @param {number} radius is the distance from origin to the point
   * @param {Angle} theta is the angle from x axes origin to point in mathematical order Counter-Clockwise
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  moveRelPolar(radius: number, theta: Angle): Point {
    let tmpPoint = Point.fromPolar(radius, theta, this.name);
    this.x = this.x + tmpPoint.x;
    this.y = this.y + tmpPoint.y;
    return this;
  }

  /**
   * copyRelArray copy this Point relative to its position by the arrVector displacement in cartesian space
   * @param {coordinate2dArray} arrVector is an array representing the vector displacement to apply to actual coordinates [deltaX, deltaY]
   * @returns {Point} a new Point object at the relative displacement arrVector from original Point
   */
  copyRelArray(arrVector: coordinate2dArray): Point {
    if (isNumeric(arrVector[0]) && isNumeric(arrVector[1])) {
      let tmpPoint = Point.fromPoint(this);
      tmpPoint.x = tmpPoint.x + arrVector[0];
      tmpPoint.y = tmpPoint.y + arrVector[1];
      return tmpPoint;
    } else {
      throw new TypeError(
        "copyRelArray needs an array of 2 numbers like this [1.0, 2.0]",
      );
    }
  }

  /**
   * copyRel copy this Point relative to its position by the deltaX, deltaY displacement in cartesian space
   * @param {number} deltaX is the increment to x coordinates to this Point
   * @param {number} deltaY is the increment to y coordinates to this Point
   * @returns {Point} a new Point object at the relative deltaX, deltaY displacement from original Point
   */
  copyRel(deltaX: number, deltaY: number): Point {
    if (isNumeric(deltaX) && isNumeric(deltaY)) {
      let tmpPoint = Point.fromPoint(this);
      tmpPoint.x = tmpPoint.x + deltaX;
      tmpPoint.y = tmpPoint.y + deltaY;
      return tmpPoint;
    } else {
      throw new TypeError(
        "copyRel needs deltaX and deltaY to be valid numbers !",
      );
    }
  }

  /**
   * copyRelPolar copy this Point relative to its position by the polar displacement in cartesian space
   * @param {number} radius is the distance from origin to the point
   * @param {Angle} theta is the angle from x axes origin to point in mathematical order Counter-Clockwise
   * @returns {Point} a new Point at the polar displacement from original Point
   */
  copyRelPolar(radius: number, theta: Angle): Point {
    let tmpPoint = Point.fromPolar(radius, theta, this.name);
    let tmpPoint2 = Point.fromPoint(this);
    tmpPoint2.x = tmpPoint2.x + tmpPoint.x;
    tmpPoint2.y = tmpPoint2.y + tmpPoint.y;
    return tmpPoint2;
  }

  /**
   * distanceTo calculates the distance from this point to otherPoint
   * @param {Point} otherPoint
   * @return {Number} te distance calculated between this Point and otherPoint
   */
  distanceTo(otherPoint: Point): number {
    if (otherPoint instanceof Point) {
      let distance = this.subtract(otherPoint).norm();
      if (distance <= EPSILON) {
        return 0;
      } else {
        return Math.abs(distance);
      }
    } else {
      throw new TypeError(
        "Point.distanceTo(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * distanceToSegment calculates the distance from this point to the line defined by points p and q
   * @param {Point} p
   * @param {Point} q
   * @return {Number} the distance calculated between this Point and the line defined by p and q
   * @throws {TypeError} if p or q are not Points
   */
  distanceToSegment(p: Point, q: Point): number {
    if (p instanceof Point && q instanceof Point) {
      return Math.abs(
        p.subtract(q).cross(this.subtract(q)) / p.subtract(q).norm(),
      );
    } else {
      throw new TypeError(
        "Point.distanceToLine(p, q) expects p and q to be Points",
      );
    }
  }

  /**
   * rotate will rotate a copy of this Point by theta around the origin
   * @param {Angle} theta is the angle to rotate this Point
   * @returns {Point} return a new Point object rotated by theta
   * @throws {TypeError} if theta is not an Angle
   */
  rotate(theta: Angle): Point {
    if (theta instanceof Angle) {
      const cosTheta = Math.cos(theta.toRadians());
      const sinTheta = Math.sin(theta.toRadians());
      return new Point(
        this.x * cosTheta - this.y * sinTheta,
        this.x * sinTheta + this.y * cosTheta,
      );
    } else {
      throw new TypeError("Point.rotate(theta) expects an Angle as parameter");
    }
  }

  /**
   * rotateAround will rotate a copy of this Point by theta around another center Point
   * @param {Angle} theta is the angle to rotate this Point
   * @param {Point} center is the Point to use as center of rotation
   * @throws {TypeError} if theta is not an Angle
   */
  rotateAround(theta: Angle, center: Point): Point {
    if (theta instanceof Angle) {
      const cosTheta = Math.cos(theta.toRadians());
      const sinTheta = Math.sin(theta.toRadians());
      const translated = this.subtract(center);
      const rotated = translated.rotate(theta);
      return rotated.add(center);
    } else {
      throw new TypeError("Point.rotate(theta) expects an Angle as parameter");
    }
  }

  /**
   * project will project this Point onto the line defined by points p and q
   * @param {Point} p
   * @param {Point} q
   * @returns {Point} return a new Point object projected onto the line defined by p and q
   * @throws {TypeError} if p or q are not Points
   */
  project(p: Point, q: Point): Point {
    if (p instanceof Point && q instanceof Point) {
      const pq = q.subtract(p);
      const t = this.subtract(p).dot(pq) / pq.dot(pq);
      return p.add(pq.multiply(t));
    } else {
      throw new TypeError("Point.project(p, q) expects p and q to be Points");
    }
  }

  /**
   * reflect will reflect this Point across the line defined by points p and q
   * @param {Point} p
   * @param {Point} q
   * @returns {Point} return a new Point object reflected across the line defined by p and q
   * @throws {TypeError} if p or q are not Points
   */
  reflect(p: Point, q: Point): Point {
    if (p instanceof Point && q instanceof Point) {
      const projection = this.project(p, q);
      return this.add(projection.subtract(this).multiply(2));
    } else {
      throw new TypeError("Point.reflect(p, q) expects p and q to be Points");
    }
  }

  /**
   * midPoint will calculate the midpoint between this Point and otherPoint
   * @param {Point} otherPoint
   * @returns {Point} return a new Point object located at the midpoint between this Point and otherPoint
   * @throws {TypeError} if otherPoint is not a Point
   */
  midPoint(otherPoint: Point): Point {
    if (otherPoint instanceof Point) {
      return this.clone().add(otherPoint).divide(2);
    } else {
      throw new TypeError(
        "Point.midPoint(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * angleTo calculates the angle in radian from this point to otherPoint
   * @param {Point} otherPoint
   * @return {Angle} the angle in radian calculated between this Point and otherPoint
   */
  angleTo(otherPoint: Point): Angle {
    if (otherPoint instanceof Point) {
      if (this.sameLocation(otherPoint)) {
        throw new RangeError("angleTo: points are at the same location");
      }
      return new Angle(
        Math.atan2(otherPoint.y - this.y, otherPoint.x - this.x),
        "radians",
      );
    } else {
      throw new TypeError(
        "Point.angleTo(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * slopeTo calculates the slope between this point and otherPoint
   * if the line between this Point and otherPoint is vertical the result is Infinity
   * if the line is horizontal the result is 0
   * @param {Point} otherPoint
   * @return {Number} the slope calculated between this Point and otherPoint
   */
  slopeTo(otherPoint: Point): number {
    if (otherPoint instanceof Point) {
      if (this.sameLocation(otherPoint)) {
        throw new RangeError("slopeTo: points are at the same location");
      }
      if (Math.abs(otherPoint.x - this.x) <= EPSILON) {
        return Infinity;
      }
      return (otherPoint.y - this.y) / (otherPoint.x - this.x);
    } else {
      throw new TypeError(
        "Point.slopeTo(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * sameLocation allows to compare if this Point is at the same location as otherPoint
   * @param {Point} otherPoint
   * @param {number} tolerance The maximum allowed difference for coordinates (default: Geometry.EPSILON)
   * @returns {boolean}
   */
  sameLocation(otherPoint: Point, tolerance: number = EPSILON): boolean {
    if (otherPoint instanceof Point) {
      return (
        Math.abs(this.x - otherPoint.x) <= tolerance &&
        Math.abs(this.y - otherPoint.y) <= tolerance
      );
    } else {
      throw new TypeError("A Point can only be compared to another Point");
    }
  }

  /**
   * equal allows to compare equality with otherPoint, they should have the same values for x and y
   * Math.sqrt(2) * Math.sqrt(2) should give 2 but gives instead 2.0000000000000004
   * Math.sqrt(3) * Math.sqrt(3) should give 2 but gives instead 2.9999999999999996
   * So the Point Class equality should take this fact account to test near equality with EPSILON=0.0000000001
   *  feel free to adapt EPSILON value to your needs in utils.js
   * @param {Point} otherPoint
   * @param {number} tolerance The maximum allowed difference for coordinates (default: Geometry.EPSILON)
   * @returns {boolean}
   */
  equal(otherPoint: Point, tolerance: number = EPSILON): boolean {
    if (otherPoint instanceof Point) {
      return (
        this.sameLocation(otherPoint, tolerance) &&
        this.name === otherPoint.name
      );
    } else {
      throw new TypeError("A Point can only be compared to another Point");
    }
  }

  /**
   * lessThan allows to compare if this Point is less than otherPoint
   * if x is different then the comparison is made on x else on y
   * @param {Point} otherPoint
   * @returns {boolean}
   * @throws {TypeError} if otherPoint is not a Point
   */
  lessThan(otherPoint: Point): boolean {
    if (otherPoint instanceof Point) {
      return this.x !== otherPoint.x
        ? this.x < otherPoint.x
        : this.y < otherPoint.y;
    } else {
      throw new TypeError(
        "Point.lessThan(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * lessThanOrEqual allows to compare if this Point is less than or equal to otherPoint
   * if x is different then the comparison is made on x else on y
   * @param {Point} otherPoint
   * @returns {boolean}
   * @throws {TypeError} if otherPoint is not a Point
   */
  lessThanOrEqual(otherPoint: Point): boolean {
    if (otherPoint instanceof Point) {
      return this.x !== otherPoint.x
        ? this.x < otherPoint.x
        : this.y <= otherPoint.y;
    } else {
      throw new TypeError(
        "Point.lessThanOrEqual(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * greaterThan allows to compare if this Point is greater than otherPoint
   * if x is different then the comparison is made on x else on y
   * @param {Point} otherPoint
   * @returns {boolean}
   * @throws {TypeError} if otherPoint is not a Point
   */
  greaterThan(otherPoint: Point): boolean {
    if (otherPoint instanceof Point) {
      return this.x !== otherPoint.x
        ? this.x > otherPoint.x
        : this.y > otherPoint.y;
    } else {
      throw new TypeError(
        "Point.greaterThan(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * greaterThanOrEqual allows to compare if this Point is greater than or equal to otherPoint
   * if x is different then the comparison is made on x else on y
   * @param {Point} otherPoint
   * @returns {boolean}
   * @throws {TypeError} if otherPoint is not a Point
   */
  greaterThanOrEqual(otherPoint: Point): boolean {
    if (otherPoint instanceof Point) {
      return this.x !== otherPoint.x
        ? this.x > otherPoint.x
        : this.y >= otherPoint.y;
    } else {
      throw new TypeError(
        "Point.greaterThanOrEqual(otherPoint) expects a Point as parameter",
      );
    }
  }

  /**
   * isInsideCircle allows to check if this Point is inside the circle defined by the center and radius
   * @param {Point} center is the center of the circle
   * @param {number} radius is the radius of the circle
   * @returns {boolean}
   * @throws {TypeError} if center is not a Point or radius is not a number
   * @throws {RangeError} if radius is negative
   */
  isInsideCircle(center: Point, radius: number): boolean {
    if (center instanceof Point) {
      if (isNumeric(radius)) {
        if (radius < 0) {
          throw new RangeError("isInsideCircle: radius should be positive");
        }
        return this.distanceTo(center) <= radius;
      } else {
        throw new TypeError(
          "Point.isInsideCircle(center, radius) expects radius to be a number",
        );
      }
    } else {
      throw new TypeError(
        "Point.isInsideCircle(center, radius) expects center to be a Point",
      );
    }
  }

  /**
   * isInsideRectangle allows to check if this Point is inside the rectangle defined by the two corners p1 and p2
   * @param {Point} p1 is the first corner of the rectangle
   * @param {Point} p2 is the second corner of the rectangle
   * @returns {boolean}
   */
  isInsideRectangle(p1: Point, p2: Point): boolean {
    if (p1 instanceof Point && p2 instanceof Point) {
      return (
        this.x >= Math.min(p1.x, p2.x) &&
        this.x <= Math.max(p1.x, p2.x) &&
        this.y >= Math.min(p1.y, p2.y) &&
        this.y <= Math.max(p1.y, p2.y)
      );
    } else {
      throw new TypeError(
        "Point.isInsideRectangle(p1, p2) expects p1 and p2 to be Points",
      );
    }
  }

  /**
   * rename allows to change the name attribute of the point
   * @param {string} newName is the new name of the point
   * @returns {Point} return this instance of the object (to allow function chaining)
   */
  rename(newName: string): this {
    this.name = newName;
    return this;
  }
}
