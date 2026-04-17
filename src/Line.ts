import Point, {type coordinate2dArray, type iPoint} from "./Point.ts";
import Converters from "./Converters.ts";
import Angle from "./Angle.ts";
import type {GeometryDriver, Extent} from "./Driver.ts";
import type {RenderDriver, RenderOptions} from "./RenderDriver.ts";
import {EPSILON} from "./Geometry.ts";

export interface LineInterface {
    start: iPoint;
    end: iPoint;
    name?: string;
    isValid?: boolean;
}

export type coordinatesLineArray = [coordinate2dArray, coordinate2dArray];

/**
 * Class representing  a line in 2 dimension Cartesian space
 * @class Line
 * @property {Point} start Point of the line (p1 is an alias)
 * @property {Point} end Point of the Line (p2 is an alias)
 * @property {string} name optional name of this line
 * @property {number} length of the line
 * @property {number} angle of the line
 * @property {number} slope of the line
 */
export default class Line implements GeometryDriver {
    private _start: Point = Point.fromArray([0, 0]); // default start point
    private _end: Point = Point.fromArray([1, 1]); // default end point
    private _name: string | undefined = undefined;
    private _direction: Point;
    private _lenSq: number;

    get start(): Point {
        return this._start.clone();
    }

    set start(input: Point) {
        if (!(input as unknown)) {
            throw new TypeError("start should be a Point object");
        }
        if (input.isSameLocation(this._end)) {
            throw new RangeError(
                `start:'${input.dump()}' should be at different location from end:'${this._end.dump()}'`,
            );
        }
        this._start = input;
        this._direction = this.end.subtract(this.start)
        this._lenSq = this.end.distanceSquaredTo(this.start)
    }

    get end(): Point {
        return this._end.clone();
    }

    set end(input: Point) {
        if (!(input as unknown)) {
            throw new TypeError("end should be a Point object");
        }
        if (input.isSameLocation(this._start)) {
            throw new RangeError("end should be at different location from start");
        }
        this._end = input;
        this._direction = this.end.subtract(this.start)
        this._lenSq = this.end.distanceSquaredTo(this.start)
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

    get p1(): Point {
        return this.start;
    }

    get p2(): Point {
        return this.end;
    }

    get direction(): Point {
        return this._direction.clone()
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

    get isVertical(): boolean {
        return Math.abs(this._direction.x) < EPSILON;
    }

    get isHorizontal(): boolean {
        return Math.abs(this._direction.y) < EPSILON;
    }

    get normalizedDirection(): Point {
        return this._direction.normalize()
    }

    /**
     * yIntercept calculates `b` of the line in the form `y = mx + b`.
     * it corresponds to the y value where the line crosses at x=0
     *  Returns `null` for vertical lines, which do not have a defined y-intercept in slope-intercept form.
     */
    get yIntercept(): number | null {
        if (this.slope === null) return null;
        return this.p1.y - this.slope * this.p1.x;
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
            // calculate the direction vector
            this._direction = this.end.subtract(this.start)
            this._lenSq = this.end.distanceSquaredTo(this.start)
        } else {
            throw new TypeError(
                "Line constructor needs 2 Point objects as parameters",
            );
        }
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Static Factories
    // ──────────────────────────────────────────────────────────────────────────────
    /**
     * fromLine returns a new Line that is a copy (clone) of the otherLine passed has parameter
     * @param {Line} otherLine is the Line you want to copy
     * @returns {Line} a new Line located at the same cartesian coordinates as otherLine
     */
    static fromLine(otherLine: Line): Line {
        if (otherLine instanceof Line) {
            return new Line(otherLine.start.clone(), otherLine.end.clone(), otherLine.name);
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
        // Guard Clause : JS Runtime safety validation
        if (
            coordinatesLine === undefined ||
            !Array.isArray(coordinatesLine) ||
            coordinatesLine.length !== 2
        ) {
            throw new TypeError(
                "fromArray needs parameter coordinates to be an array of 2 points with 2d coordinates : [[number, number], [number, number]]",
            );
        }
        return new Line(
            Point.fromArray(coordinatesLine[0]),
            Point.fromArray(coordinatesLine[1]),
        );
    }

    /**
     * fromTwoPointsCoordinates returns a new Line constructed with
     * @param {number} x1 is the x coordinate of start point
     * @param {number} y1 is the y coordinate of start point
     * @param {number} x2 is the x coordinate of end point
     * @param {number} y2 is the y coordinate of end point
     * @returns {Line} a new Line at given coordinates start:[x0,y0] and end:[x1,y1]
     */
    static fromTwoPointsCoordinates(x1: number, y1: number, x2: number, y2: number): Line {
        return new Line(new Point(x1, y1), new Point(x2, y2));
    }

    /**
     * fromSlopeAndPoint
     * @param {number} m is the slope of the line
     * @param {Point} p is the Point where the line should pass
     */
    static fromSlopeAndPoint(m: number, p: Point): Line {
        // For horizontal/vertical or undefined slope, fallback to a direction vector
        const dx = 1;
        const dy = m * dx;
        return new Line(p, new Point(p.x + dx, p.y + dy));
    }

    static fromObject(data: Record<string, unknown>) {
        if (data === undefined || data === null) {
            throw new TypeError("cannot create a Line from nothing");
        }
        const tempLine: LineInterface = Converters.convertToLine(data);
        return new Line(
            new Point(tempLine.start.x, tempLine.start.y, tempLine.start.name),
            new Point(tempLine.end.x, tempLine.end.y, tempLine.end.name),
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

    toLineEquation(): string {
        if (this.isVertical) return `Line: x = ${this.p1.x.toFixed(4)}`;
        if (this.isHorizontal) return `Line: y = ${this.p1.y.toFixed(4)}`;
        return `Line: y = ${this.slope!.toFixed(4)}x + ${this.yIntercept!.toFixed(4)}`;
    }

    toJSON(): string {
        return `{"start":${this.start.toJSON()}, "end":${this.end.toJSON()}, "name":"${this.name}"}`;
    }

    /**
     * sameLocation allows to compare if this Line segment is at exact  same location as otherLine
     * @param {Line} otherLine
     * @returns {boolean}
     */
    sameLocation(otherLine: Line): boolean {
        if (otherLine instanceof Line) {
            /** Checks if two infinite lines represent the exact same infinite line */
            //if (!this.isParallelTo(otherLine)) return false;
            //    return this.getDistanceTo(otherLine.p1) < EPSILON;

            return (
                this.start.isSameLocation(otherLine.start) &&
                this.end.isSameLocation(otherLine.end)
            );
        } else {
            throw new TypeError("A Line can only be compared to another Line");
        }
    }

    /**
     * equal allows to compare equality with otherLine, they should have the same values
     * for start and end and the same names if you just want to check the geom use
     * sameLocation(otherLine) instead
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

    /**
     * getPointAt returns a point on the line using parametric form: P(t) = P1 + t * direction
     * Here, `direction` is the vector from `P1` to `P2`, so `t = 0` gives `P1`
     *  and `t = 1` gives `P2`.
     * @param t Parameter along the line. `t=0` → `p1`, `t=1` → `p2`, `t=0.5` → midpoint between p1 and p2
     */
    getPointAt(t: number): Point {
        return new Point(
            this.p1.x + t * this.direction.x,
            this.p1.y + t * this.direction.y);
    }

    /** Shortest perpendicular distance from a point to this infinite line */
    getDistanceTo(point: Point): number {
        const dx = this._direction.x;
        const dy = this._direction.y;
        const num = Math.abs(dx * (this.p1.y - point.y) - dy * (this.p1.x - point.x));
        return num / Math.sqrt(this._lenSq);
    }

    /** Checks if another line is parallel (directions are collinear) */
    isParallelTo(other: Line): boolean {
        return Math.abs(this._direction.x * other.direction.y - this._direction.y * other.direction.x) < EPSILON;
    }

    /** Checks if another line is perpendicular */
    isPerpendicularTo(other: Line): boolean {
        return Math.abs(this._direction.x * other.direction.x + this._direction.y * other.direction.y) < EPSILON;
    }

    /** Returns intersection point of two infinite lines, or null if parallel
     * Solves line-line intersection using Cramer's rule. Returns `null` if parallel
     * */
    getIntersectionWith(other: Line): Point | null {
        if (this.isParallelTo(other)) return null;

        const A1 = this._direction.y;
        const B1 = -this._direction.x;
        const C1 = A1 * this.p1.x + B1 * this.p1.y;

        const A2 = other.direction.y;
        const B2 = -other.direction.x;
        const C2 = A2 * other.p1.x + B2 * other.p1.y;

        const det = A1 * B2 - A2 * B1;
        if (Math.abs(det) < EPSILON) return null; // Parallel fallback

        return new Point( (B2 * C1 - B1 * C2) / det, (A1 * C2 - A2 * C1) / det);
    }

    /** Orthogonally projects a point onto this line
     * Drops a perpendicular from point to line. Essential for snapping, Voronoi, etc.
     * */
    projectPointToLine(point: Point): Point {
        const t = ((point.x - this.p1.x) * this._direction.x + (point.y - this.p1.y) * this._direction.y) / this._lenSq;
        return new Point(this.p1.x + t * this._direction.x, this.p1.y + t * this._direction.y);
    }

    /** Reflects a point across this line */
    reflectPointAcrossLine(point: Point): Point {
        const proj = this.projectPointToLine(point);
        return new Point(2 * proj.x - point.x, 2 * proj.y - point.y);
    }

    /** Returns the angle (radians, 0 to π) between this line and another */
    getAngleTo(other: Line): number {
        const dx1 = this._direction.x, dy1 = this._direction.y;
        const dx2 = other.direction.x, dy2 = other.direction.y;
        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (len1 < EPSILON || len2 < EPSILON) return NaN;

        const cosAngle = (dx1 * dx2 + dy1 * dy2) / (len1 * len2);
        // Clamp for floating-point safety
        return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Transformations (Return new Line instances)
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * translate will add the coordinates of the other to a copy of this Line
     * @param {Point} other
     * @returns {Line} return a new Line object translated by other.x,other.y
     */
    translate(other: Point): Line {
        const newStart = this.start.add(other);
        const newEnd = this.end.add(other);
        return new Line(newStart, newEnd)
    }

    /**
     * rotate will rotate a copy of this Line by theta around the origin (0,0
     * @param {Angle} theta is the angle to rotate this Line
     * @returns {Point} return a new Point object rotated by theta
     */
    rotate(theta: Angle): Line {
        return new Line( this.p1.rotate(theta),this.p2.rotate(theta))
    }

    /**
     * rotateAround will rotate a copy of this Line by theta around another center Point
     * @param {Angle} theta is the angle to rotate this Line
     * @param {Point} center is the Point to use as center of rotation
     */
    rotateAround(theta: Angle, center: Point): Line {
        // if given center is origin no need translate
        if (center.isOrigin()) {
            return this.rotate(theta);
        }
        // Translate points so center is the origin
        const p1Translated = this.p1.subtract(center);
        const p1Rotated = p1Translated.rotate(theta);
        const p2Translated = this.p2.subtract(center);
        const p2Rotated = p2Translated.rotate(theta);
        // Translate point back
        return new Line(p1Rotated.add(center), p2Rotated.add(center) );
    }


    // ── GeometryDriver implementation ──────────────────────────────

    /**
     * A line segment has no area.
     */
    getArea(): number {
        return 0;
    }

    /**
     * Returns the length of the line segment.
     */
    getPerimeter(): number {
        return this.length;
    }

    /**
     * Returns the axis-aligned bounding box of the line segment.
     */
    getExtent(): Extent {
        return [
            Math.min(this.start.x, this.end.x),
            Math.min(this.start.y, this.end.y),
            Math.max(this.start.x, this.end.x),
            Math.max(this.start.y, this.end.y),
        ];
    }

    /**
     * Visitor double-dispatch: delegates to renderer.renderLine.
     */
    accept<T = string>(renderer: RenderDriver<T>, options: RenderOptions, invertY: boolean): T {
        return renderer.renderLine(this, options, invertY);
    }
}
