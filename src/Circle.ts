import Point, {assertIsPoint, type coordinate2dArray, type iPoint} from "./Point.ts";
import type {GeometryDriver, Extent} from "./Driver.ts";
import type {RenderDriver, RenderOptions} from "./RenderDriver.ts";
import Converters from "./Converters.ts";
import {Guard} from "./Geometry.ts";
import type Angle from "./Angle.ts";

export interface CircleInterface {
    center: iPoint;
    radius: number;
    name?: string;
}

export function assertIsCircle(val: any, msg:string=""): asserts val is Circle {
    Guard.throwIf(!(val instanceof Circle), `${msg} expected a Circle instance.`);
}

/**
 * Class representing a circle in 2 dimension cartesian space
 */
export default class Circle implements GeometryDriver {
    private _center: Point = Point.fromArray([0, 0]); // default center point
    private _radius: number = 1.0; // default radius
    private _name: string | undefined = undefined;

    get center(): Point {
        return this._center;
    }

    set center(input: Point) {
        assertIsPoint(input, "Circle center")
        this._center = input;
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
        if (typeof value as unknown === "string") {
            this._name = value;
        } else {
            throw new TypeError("name should be a string");
        }
    }

    get diameter(): number {
        return this.radius * 2;
    }

    get area(): number {
        return Math.PI * this.radius * this.radius;
    }

    /**
     * Circle constructor
     * @param {Point} center Point of the circle
     * @param {number} radius radius of the circle
     * @param {string | undefined} name optional name of this circle
     */
    constructor(center: Point, radius: number, name?: string) {
        this.center = center;
        this.radius = radius;
        if (name !== undefined) {
            this.name = name;
        }
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Static Factories
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * fromCircle returns a new Circle that is a copy (clone) of the other passed has parameter
     * @param {Circle} other is the Circle you want to copy
     * @returns {Circle} a new Circle located at the same cartesian coordinates as other
     */
    static fromCircle(other: Circle): Circle {
        assertIsCircle(other, "fromCircle other")
            return new Circle(other.center.clone(), other.radius, other.name);
    }

    /**
     * Creates a circle from an array of 3 numbers
     * @param {number[]} inputArray array of 3 numbers [x,y,radius]
     * @param {string | undefined} name optional name of this circle
     */
    static fromArray(inputArray: [number, number, number], name?: string): Circle {
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

    static fromObject(data: Record<string, unknown>) {
        if (data === undefined || data === null) {
            throw new TypeError("cannot create a Line from nothing");
        }
        const tempCircle: CircleInterface = Converters.convertToCircle(data);
        return new Circle(
            new Point(tempCircle.center.x, tempCircle.center.y, tempCircle.center.name),
            tempCircle.radius,
            tempCircle.name,
        );
    }

    static fromJSON(json: string): Circle {
        try {
            const tmpObject = JSON.parse(json);
            return Circle.fromObject(tmpObject);
        } catch (e) {
            throw new TypeError(
                `Circle:fromJSON got ${e}, needs a valid JSON string as parameter :${json}`,
            );
        }
    }

    /**
     * clone returns a new Circle that is a copy of itself
     * @returns {Circle} a new Circle located at the same cartesian coordinates as this Circle
     */
    clone(): Circle {
        return Circle.fromCircle(this);
    }

    toString(
        separator: string = ",",
        surroundingParenthesis: boolean = true,
        precision: number = 2,
        withName: boolean = true,
    ): string {
        const tmpRes = `${this.center.toString(separator, surroundingParenthesis, precision)}${separator}radius:${this.radius}`;
        if (surroundingParenthesis) {
            return withName ? `${this.name}:(${tmpRes})` : `(${tmpRes})`;
        } else {
            return withName ? `${this.name}:${tmpRes}` : `${tmpRes}`;
        }
    }

    toJSON(): string {
        if (this.name.length > 0) {
            return `{"start":${this.center.toJSON()}, "radius":${this.radius}, "name":"${this.name}"}`;
        }
        return `{"start":${this.center.toJSON()}, "radius":${this.radius}"}`;
    }

    /**
     * sameLocation allows to compare if this Circle segment is at exact  same location as other
     * @param {Circle} other
     * @returns {boolean}
     */
    sameLocation(other: Circle): boolean {
        assertIsCircle(other, "Circle sameLocation other")
        return (
            this.center.isSameLocation(other.center) &&
            this.radius == other.radius
        );
    }

    /**
     * equal allows comparing equality with other, they should have the same values
     * for start and end and the same names if you just want to check the geom use
     * sameLocation(other) instead
     * @param {Circle} other
     * @returns {boolean}
     */
    equal(other: Circle): boolean {
        assertIsCircle(other, "Circle equal other")
        return this.sameLocation(other) && this.name === other.name;
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // --- Spatial Queries ---
    // ──────────────────────────────────────────────────────────────────────────────
    /**
     * Checks if a specific other is inside or on the boundary of the circle.
     */
    containsPoint(other: Point): boolean {
        assertIsPoint(other, "Circle containsPoint other")
        const distanceSq = this.distanceToPointSq(other);
        return distanceSq <= Math.pow(this.radius, 2);
    }

    /**
     * Calculates the Euclidean distance to a other.
     * Note: Using distance squared is computationally cheaper (avoiding Math.sqrt).
     */
    distanceToPointSq(other: Point): number {
        assertIsPoint(other, "distanceToPointSq other")
        const dx = this.center.x - other.x;
        const dy = this.center.y - other.y;
        return dx * dx + dy * dy;
    }

    /**
     * Checks if this circle overlaps with another circle.
     */
    intersectsCircle(other: Circle): boolean {
        assertIsCircle(other, "intersectsCircle other")
        const distanceSq = this.distanceToPointSq(other.center);
        const radiusSum = this.radius + other.radius;
        return distanceSq <= Math.pow(radiusSum, 2);
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Transformations (Return new Circle instances)
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * translate will add the coordinates of the other to a copy of this Circle
     * @param {Point} other
     * @returns {Circle} return a new Circle object translated by other.x, other.y
     */
    translate(other: Point): Circle {
        assertIsPoint(other, "Circle translate other")
        const newCenter = this.center.add(other);
        if (this.name.length < 0) {
            return new Circle(newCenter, this.radius)
        }
        return new Circle(newCenter, this.radius, this.name)
    }

    /**
     * rotate will rotate a copy of this Circle by theta around the origin (0,0)
     * in the case of a circle rotation at 0,0 does nothing so it's just returning a copy of itself
     * @param {Angle} theta is the angle to rotate this Circle
     * @returns {Circle} return a clone of this Circle
     */
    rotate(theta: Angle): Circle {
        return this.clone()
    }

    /**
     * rotateAround will rotate a copy of this Circle by theta around another center Point
     * @param {Angle} theta is the angle to rotate this Circle
     * @param {Point} center is the Point to use as center of rotation
     */
    rotateAround(theta: Angle, center: Point): Circle {
        assertIsPoint(center, "Circle rotateAround center")
        // if given center is origin no need translate
        if (center.isOrigin()) {
            return this.rotate(theta);
        }
        // Translate points so center is the origin
        const centerTranslated = this.center.subtract(center);
        const centerRotated = centerTranslated.rotate(theta);
        // Translate point back
        return new Circle(centerRotated.add(center), this.radius);
    }


    // ── GeometryDriver implementation ──────────────────────────────

    /**
     * Returns the area of the circle (delegates to area()).
     */
    getArea(): number {
        return this.area;
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
