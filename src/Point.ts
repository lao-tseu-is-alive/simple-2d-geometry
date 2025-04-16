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

  /**
   * The origin point (0, 0).
   */
  public static readonly ORIGIN: Point = new Point(0, 0);

  /**
   * The unit vector along the positive X-axis (1, 0).
   */
  public static readonly UNIT_X: Point = new Point(1, 0);

  /**
   * The unit vector along the positive Y-axis (0, 1).
   */
  public static readonly UNIT_Y: Point = new Point(0, 1);

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
   * @throws {RangeError} if coordinates are not finite numbers
   */
  constructor(x: number = 0, y: number = 0, name?: string) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
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
   * @returns {Point} a new instance of Point located at the same cartesian coordinates
   */
  clone(): Point {
    return new Point(this.x, this.y, this.name);
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
   * Calculates the magnitude (length) of the vector represented by this point (from the origin).
   * Equivalent to `this.distanceTo(Point2D.ORIGIN)`.
   * @returns The magnitude.
   */
  public magnitude(): number {
    return this.getDistanceFromOrigin();
  }

  /**
   * Calculates the squared magnitude (length) of the vector represented by this point.
   * Equivalent to `this.distanceSquaredTo(Point2D.ORIGIN)`.
   * @returns The squared magnitude.
   */
  public magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * normalize converts this point (as s vector) to a unit vector
   * Returns the origin (0,0) if the magnitude is zero (or very close to it).
   * @returns {Point} return new Point2D representing the normalized vector, or the origin if the magnitude is zero.
   */
  normalize(): Point {
    const norm = this.norm();
    if (Math.abs(norm) <= EPSILON) {
      return Point.ORIGIN.clone();
    }
    return this.clone().divide(norm);
  }

  /**
   * add will add the coordinates of the other to a copy of this Point
   * @param {Point} other
   * @returns {Point} return a new Point object with the sum of this Point and other
   */
  add(other: Point): Point {
    return this.clone().moveRel(other.x, other.y);
  }

  /**
   * subtract will subtract the coordinates of the other Point to a copy of this Point
   * @param {Point} other
   * @returns {Point} return a new Point object with the difference of this Point and other Point
   */
  subtract(other: Point): Point {
    return this.clone().moveRel(-other.x, -other.y);
  }

  /**
   * multiply will scale the coordinates of a copy of this Point by the factor c
   * @param {number} c is the factor to multiply the coordinates of this Point
   * @returns {Point} return a new Point object with the coordinates of this Point multiplied by c
   * @throws {TypeError} if c is not a number
   * @throws {RangeError} if c is not a finite number
   */
  multiply(c: number): Point {
    if (!isNumeric(c)) {
      throw new TypeError(
        "Point.multiply(c) expects a finite number as parameter",
      );
    }
    const tmpPoint = this.clone();
    tmpPoint.x *= c;
    tmpPoint.y *= c;
    return tmpPoint;
  }

  /**
   * divide will scale the coordinates of a copy of this Point by the factor 1/c
   * @param {number} c is the factor to divide the coordinates of this Point
   * @returns {Point} return a new Point object with the coordinates of this Point divided by c
   * @throws {TypeError} if c is not a number
   */
  divide(c: number): Point {
    if (!isNumeric(c)) {
      throw new TypeError(
        "Point.divide(c) expects a finite number as parameter",
      );
    }
    if (Math.abs(c) <= EPSILON) {
      throw new RangeError(
        "Point.divide(c) expects number different from zero",
      );
    }
    const tmpPoint = this.clone();
    tmpPoint.x /= c;
    tmpPoint.y /= c;
    return tmpPoint;
  }

  /**
   * dot will calculate the dot product of this Point with other Point
   * @param {Point} other
   * @returns {number} the dot product of this Point and other Point
   */
  dot(other: Point): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * cross calculates the 2D scalar cross product  represents this signed area between this (as a vector) and other point.
   * Geometrically, this is `|A| * |B| * sin(theta)`, where theta is the angle from A to B.
   * The sign indicates orientation (+ve for counter-clockwise angle from this to other, -ve for clockwise).
   * @param {Point} other point
   * @returns {number} The scalar value representing the 2D cross product (z-component of the 3D cross product).
   */
  cross(other: Point): number {
    return this.x * other.y - this.y * other.x;
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
      let tmpPoint = this.clone();
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
      let tmpPoint = this.clone();
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
    let tmpPoint2 = this.clone();
    tmpPoint2.x = tmpPoint2.x + tmpPoint.x;
    tmpPoint2.y = tmpPoint2.y + tmpPoint.y;
    return tmpPoint2;
  }

  /**
   * distanceTo calculates the distance from this point to other point
   * @param {Point} other
   * @return {Number} the distance calculated between this Point and other Point
   */
  distanceTo(other: Point): number {
    let distance = this.subtract(other).norm();
    if (distance <= EPSILON) {
      return 0;
    } else {
      return Math.abs(distance);
    }
  }

  /**
   * distanceSquaredTo calculates the squared Euclidean distance between this point and another point.
   * Often preferred for comparisons as it avoids a square root calculation.
   * @param {Point} other - The other point.
   * @returns {Number} The squared distance.
   */
  public distanceSquaredTo(other: Point): number {
    const distance = this.subtract(other).magnitudeSquared();
    if (distance <= EPSILON) {
      return 0;
    } else {
      return Math.abs(distance);
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
    return Math.abs(
      p.subtract(q).cross(this.subtract(q)) / p.subtract(q).norm(),
    );
  }

  /**
   * rotate will rotate a copy of this Point by theta around the origin (0,0
   * @param {Angle} theta is the angle to rotate this Point
   * @returns {Point} return a new Point object rotated by theta
   */
  rotate(theta: Angle): Point {
    const cosTheta = Math.cos(theta.toRadians());
    const sinTheta = Math.sin(theta.toRadians());
    return new Point(
      this.x * cosTheta - this.y * sinTheta,
      this.x * sinTheta + this.y * cosTheta,
    );
  }

  /**
   * rotateAround will rotate a copy of this Point by theta around another center Point
   * @param {Angle} theta is the angle to rotate this Point
   * @param {Point} center is the Point to use as center of rotation
   */
  rotateAround(theta: Angle, center: Point): Point {
    // if given center is origin no need translate
    if (center.isOrigin()) {
      return this.rotate(theta);
    }
    // Translate point so center is the origin
    const translated = this.subtract(center);
    const rotated = translated.rotate(theta);
    // Translate point back
    return rotated.add(center);
  }

  /**
   * project will project this Point onto the line defined by points p and q
   * @param {Point} p
   * @param {Point} q
   * @returns {Point} return a new Point object projected onto the line defined by p and q
   */
  project(p: Point, q: Point): Point {
    const pq = q.subtract(p);
    const t = this.subtract(p).dot(pq) / pq.dot(pq);
    return p.add(pq.multiply(t));
  }

  /**
   * reflect will reflect this Point across the line defined by points p and q
   * @param {Point} p
   * @param {Point} q
   * @returns {Point} return a new Point object reflected across the line defined by p and q
   */
  reflect(p: Point, q: Point): Point {
    const projection = this.project(p, q);
    return this.add(projection.subtract(this).multiply(2));
  }

  /**
   * midPoint will calculate the midpoint between this Point and other point
   * @param {Point} other
   * @returns {Point} return a new Point object located at the midpoint between this Point and other point
   */
  midPoint(other: Point): Point {
    return this.clone().add(other).divide(2);
  }

  /**
   * perpendicular will return a new Point perpendicular to the baseline from this point to other Point,
   * the point returned will be at a given length distance starting from other point
   * @param {Point}  other is the support point to draw the baseline, where the perpendicular will begin
   * @param {Number} length is the distance between pointA and the returned point
   * @returns {Point} returns a new Point located at a length distance from the other point and perpendicular to line from this point to other
   */
  perpendicular(other: Point, length: number): Point {
    const angleLine = this.angleTo(other);
    // get a Polar point at origin with
    const polarPoint = Point.fromPolar(
      length,
      angleLine.add(Math.PI / 2, "radians"),
      other.name,
    );
    // return the point
    return polarPoint.moveTo(other.x, other.y);
  }

  /**
   * angleTo calculates the angle in radian from this point to other point
   * @param {Point} other
   * @return {Angle} the angle in radian calculated between this Point and other point
   */
  angleTo(other: Point): Angle {
    if (this.isSameLocation(other, EPSILON)) {
      throw new RangeError("angleTo: points are at the same location");
    }
    return new Angle(Math.atan2(other.y - this.y, other.x - this.x), "radians");
  }

  /**
   * slopeTo calculates the slope between this point and other point
   * if the line between this Point and other point is vertical the result is Infinity
   * if the line is horizontal the result is 0
   * @param {Point} other
   * @return {Number} the slope calculated between this Point and other point
   */
  slopeTo(other: Point): number {
    if (this.isSameLocation(other)) {
      throw new RangeError("slopeTo: points are at the same location");
    }
    if (Math.abs(other.x - this.x) <= EPSILON) {
      return Infinity;
    }
    return (other.y - this.y) / (other.x - this.x);
  }

  /**
   * isOrigin checks if this Point is at the origin (0,0)
   * @returns {boolean} true if this Point is at the origin, false otherwise
   */
  isOrigin(): boolean {
    return this.isSameLocation(Point.ORIGIN);
  }

  /**
   * Checks if this Point instance represents the same location as another Point,
   * within a specified tolerance. This comparison is robust against floating-point inaccuracies.
   *
   * @param {Point | undefined | null} other The point to compare against.Accepts null or undefined gracefully.
   * @param {number} tolerance The maximum allowed absolute difference for each coordinate.
   * Must be non-negative. Defaults to EPSILON (a small constant for float comparison).
   * @returns {boolean} True if the points are considered the same location within the tolerance, false otherwise.
   * @throws {RangeError} If the provided tolerance is negative, as it's mathematically illogical for this comparison.
   */
  isSameLocation(
    other: Point | undefined | null,
    tolerance: number = EPSILON,
  ): boolean {
    // 1. Robustness: Validate tolerance input.
    //    A negative tolerance doesn't make sense for checking proximity.
    if (tolerance < 0) {
      throw new RangeError("Tolerance cannot be negative.");
    }
    // 2. Robustness: Handle null or undefined input gracefully.
    //    If the other point doesn't exist, it's not at the same location.
    if (other == null) {
      // Using == checks for both null and undefined
      return false;
    }
    // 4. Clarity & Logic: Calculate absolute differences for each coordinate.
    const deltaX = Math.abs(this.x - other.x);
    const deltaY = Math.abs(this.y - other.y);

    // 5. Core Logic: Check if both differences are within the specified tolerance.
    return deltaX <= tolerance && deltaY <= tolerance;
  }

  /**
   * isEqual allows to compare equality with other, they should have the same values for x and y and name
   * Math.sqrt(2) * Math.sqrt(2) should give 2 but gives instead 2.0000000000000004
   * Math.sqrt(3) * Math.sqrt(3) should give 2 but gives instead 2.9999999999999996
   * So the Point Class equality test should take this fact account to test near equality with tolerance
   * @param {Point} other point to compare with this one
   * @param {number} tolerance The maximum allowed difference for coordinates (default: Geometry.EPSILON)
   * @returns {boolean}
   */
  isEqual(other: Point, tolerance: number = EPSILON): boolean {
    return this.isSameLocation(other, tolerance) && this.name === other.name;
  }

  /**
   * lessThan allows to compare if this Point is less than other point
   * if x is different then the comparison is made on x else on y
   * @param {Point} other
   * @returns {boolean}
   */
  lessThan(other: Point): boolean {
    return this.x !== other.x ? this.x < other.x : this.y < other.y;
  }

  /**
   * lessThanOrEqual allows to compare if this Point is less than or equal to other point
   * if x is different then the comparison is made on x else on y
   * @param {Point} other
   * @returns {boolean}
   */
  lessThanOrEqual(other: Point): boolean {
    return this.x !== other.x ? this.x < other.x : this.y <= other.y;
  }

  /**
   * greaterThan allows to compare if this Point is greater than other point
   * if x is different then the comparison is made on x else on y
   * @param {Point} other
   * @returns {boolean}
   */
  greaterThan(other: Point): boolean {
    return this.x !== other.x ? this.x > other.x : this.y > other.y;
  }

  /**
   * greaterThanOrEqual allows to compare if this Point is greater than or equal to other point
   * if x is different then the comparison is made on x else on y
   * @param {Point} other
   * @returns {boolean}
   */
  greaterThanOrEqual(other: Point): boolean {
    return this.x !== other.x ? this.x > other.x : this.y >= other.y;
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
  }

  /**
   * isInsideRectangle allows to check if this Point is inside the rectangle defined by the two corners p1 and p2
   * @param {Point} p1 is the first corner of the rectangle
   * @param {Point} p2 is the second corner of the rectangle
   * @returns {boolean}
   */
  isInsideRectangle(p1: Point, p2: Point): boolean {
    return (
      this.x >= Math.min(p1.x, p2.x) &&
      this.x <= Math.max(p1.x, p2.x) &&
      this.y >= Math.min(p1.y, p2.y) &&
      this.y <= Math.max(p1.y, p2.y)
    );
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
