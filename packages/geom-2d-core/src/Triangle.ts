import Point, {
    assertIsPoint,
    assertIsIPoint,
    type coordinate2dArray,
    type iPoint,
    type ReadonlyPoint
} from "./Point.ts";
import Converters from "./Converters.ts";
import {EPSILON, Guard} from "./Geometry.ts";
import Angle from "./Angle.ts";
import type {GeometryDriver, Extent} from "./Driver.ts";
import type {RenderDriver, RenderOptions} from "./RenderDriver.ts";

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

export type ReadonlyTriangle = Omit<Triangle, 'pA' | 'pB' | 'pC' | 'name' | 'rename'> & {
    readonly pA: ReadonlyPoint;
    readonly pB: ReadonlyPoint;
    readonly pC: ReadonlyPoint;
    readonly name: string;
};

/**
 * coordinatesTriangleArray is an array of 3 points with 2d coordinates
 */
export type coordinatesTriangleArray = [
    coordinate2dArray,
    coordinate2dArray,
    coordinate2dArray,
];

export function assertIsTriangle(val: any, msg: string = ""): asserts val is Triangle {
    Guard.throwIf(!(val instanceof Triangle), `${msg} expected a Triangle instance.`);
}


/**
 * Class representing  a triangle in 2 dimension cartesian space
 * @class Triangle
 * @implements {TriangleInterface}
 * @property {Point} pA first Point of the triangle
 * @property {Point} pB second Point of the triangle
 * @property {Point} pC third Point of the triangle
 * @property {string} name optional name of this triangle
 * @property {a} returns the length of side a opposite the angle A and pA of the triangle
 * @property {b} returns the length of side b opposite the angle B and pB of the triangle
 * @property {c} returns the length of side c opposite the angle C and pC of the triangle
 * @property {Angle} aA angle A at pA opposite of the side a of the triangle
 * @property {Angle} aB angle B at pB opposite of the side b of the triangle
 * @property {Angle} aC angle C at pC opposite of the side c of the triangle
 * @example const T0 = new Triangle(new Point(0,0,'P0'), new Point(1,1,'P1'), new Point(1,0,'P2'), "T0");
 */
export default class Triangle implements GeometryDriver {
    private _pA: Point = Point.fromArray([1, 0]); // default pA point
    private _pB: Point = Point.fromArray([0, 1]); // default pB point
    private _pC: Point = Point.fromArray([-1, 0]); // default pC point
    private _name: string | undefined = undefined;

    /**
     * get pA returns the first Point of the triangle
     * @returns {ReadonlyPoint} the first Point of the triangle
     */
    get pA(): ReadonlyPoint {
        return this._pA.clone();
    }

    /**
     * set pA allows to change the first Point of the triangle
     * @param {Readonly<iPoint>} input is the new first Point of the triangle
     */
    set pA(input: Readonly<iPoint>) {
        assertIsIPoint(input, "Triangle pA")
        if (this._pB.isSameLocation(input)) {
            throw new RangeError(
                `pA should be at different location from pB`,
            );
        }
        if (this._pC.isSameLocation(input)) {
            throw new RangeError(
                `pA should be at different location from pC`,
            );
        }
        this._pA = new Point(input.x, input.y, input.name);
    }

    /**
     * get pB returns the second Point of the triangle
     * @returns {ReadonlyPoint} the second Point of the triangle
     */
    get pB(): ReadonlyPoint {
        return this._pB.clone();
    }

    /**
     * set pB allows to change the second Point of the triangle
     * @param {Readonly<iPoint>} input is the new second Point of the triangle
     */
    set pB(input: Readonly<iPoint>) {
        assertIsIPoint(input, "Triangle pB")
        if (this._pA.isSameLocation(input)) {
            throw new RangeError(
                `pB should be at different location from pA`,
            );
        }
        if (this._pC.isSameLocation(input)) {
            throw new RangeError(
                `pB should be at different location from pC`,
            );
        }
        this._pB = new Point(input.x, input.y, input.name);
    }

    /**
     * get pC returns the third Point of the triangle
     * @returns {ReadonlyPoint} the third Point of the triangle
     */
    get pC(): ReadonlyPoint {
        return this._pC.clone();
    }

    /**
     * set pC allows to change the third Point of the triangle
     * @param {Readonly<iPoint>} input is the new third Point of the triangle
     */
    set pC(input: Readonly<iPoint>) {
        assertIsIPoint(input, "Triangle pC")
        if (this._pA.isSameLocation(input)) {
            throw new RangeError(
                `pC should be at different location from pA`,
            );
        }
        if (this._pB.isSameLocation(input)) {
            throw new RangeError(
                `pC should be at different location from pB`,
            );
        }
        this._pC = new Point(input.x, input.y, input.name);
    }

    /**
     * name returns the name attribute of the triangle
     * @returns {string} the name of the triangle
     */
    get name(): string {
        if (this._name === undefined) {
            return "";
        }
        return this._name;
    }

    /**
     * set name allows to change the name attribute of the triangle
     * @param value is the new name of the triangle
     */
    set name(value: string) {
        this._name = value;
    }

    /**
     * a returns the length of side a opposite the angle A and pA of the triangle
     * @returns {number} the length of side a opposite the angle A and pA of the triangle
     */
    get a(): number {
        return this._pB.distanceTo(this._pC);
    }

    /**
     * b returns the length of side b opposite the angle B and pB of the triangle
     * @returns {number} the length of side b opposite the angle B and pB of the triangle
     */
    get b(): number {
        return this._pA.distanceTo(this._pC);
    }

    /**
     * c returns the length of side c opposite the angle C and pC of the triangle
     * @returns {number} the length of side c opposite the angle C and pC of the triangle
     */
    get c(): number {
        return this._pA.distanceTo(this._pB);
    }

    /**
     * aA returns the angle A at pA opposite of the side a of the triangle
     * @returns {Angle} the angle A at pA opposite of the side a of the triangle
     */
    get aA(): Angle {
        return new Angle(
            Math.acos(
                (this.b ** 2 + this.c ** 2 - this.a ** 2) / (2 * this.b * this.c),
            ),
            "radians",
        );
    }

    /**
     * aB returns the angle B at pB opposite of the side b of the triangle
     * @returns {Angle} the angle B at pB opposite of the side b of the triangle
     */
    get aB(): Angle {
        return new Angle(
            Math.acos(
                (this.a ** 2 + this.c ** 2 - this.b ** 2) / (2 * this.a * this.c),
            ),
            "radians",
        );
    }

    /**
     * aC returns the angle C at pC opposite of the side c of the triangle
     * @returns {Angle} the angle C at pC opposite of the side c of the triangle
     */
    get aC(): Angle {
        return new Angle(
            Math.acos(
                (this.a ** 2 + this.b ** 2 - this.c ** 2) / (2 * this.a * this.b),
            ),
            "radians",
        );
    }

    /**
     * Creates a triangle
     * @param {Point} pA first Point of the triangle
     * @param {Point} pB second Point of the triangle
     * @param {Point} pC third Point of the triangle
     * @param {string | undefined} name optional name of this triangle
     */
    constructor(pA: Point, pB: Point, pC: Point, name?: string) {
        assertIsPoint(pA, "Triangle pA")
        assertIsPoint(pB, "Triangle pB")
        assertIsPoint(pC, "Triangle pC")

        if (pA.isSameLocation(pB)) {
            throw new RangeError(
                `pA:'${pA.dump()}' should be at different location from pB:'${pB.dump()}'`,
            );
        }
        if (pA.isSameLocation(pC)) {
            throw new RangeError(
                `pA:'${pA.dump()}' should be at different location from pC:'${pC.dump()}'`,
            );
        }
        if (pB.isSameLocation(pC)) {
            throw new RangeError(
                `pB:'${pB.dump()}' should be at different location from pC:'${pC.dump()}'`,
            );
        }
        if (Point.isCollinear(pA, pB, pC)) {
            throw new RangeError(
                `pA:'${pA.dump()}', pB:'${pB.dump()}' and pC:'${pC.dump()}' should not be collinear`,
            );
        }
        this._pA = pA.clone();
        this._pB = pB.clone(); // make a copy of the Point object
        this._pC = pC.clone(); // make a copy of the Point object
        if (name !== undefined) this.name = name;
    }

    /**
     * fromTriangle returns a new Triangle that is a copy (clone) of the other passed has parameter
     * @param {Triangle} other is the Triangle you want to copy
     * @returns {Triangle} a new Triangle located at the same cartesian coordinates as other
     */
    static fromTriangle(other: Triangle): Triangle {
        assertIsTriangle(other, "Triangle fromTriangle other")
        return new Triangle(
            other._pA,
            other._pB,
            other._pC,
            other._name,
        );
    }

    /**
     * fromArray returns a new Triangle constructed with
     * @param {[number, number]} coordinatesTriangle is an array of 2 points with 2d coordinates: [[number, number], [number, number]]
     * @returns {Triangle} a new Triangle at given coordinates pA:[x0,y0] and pB:[x1,y1]
     */
    static fromArray(coordinatesTriangle: coordinatesTriangleArray): Triangle {
        if (
            typeof coordinatesTriangle !== "undefined" &&
            coordinatesTriangle as unknown instanceof Array &&
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

    /**
     * fromObject returns a new Triangle constructed with
     * @param {TriangleInterface} data is an object with pA, pB and pC as properties
     * @returns {Triangle} a new Triangle at given coordinates pA:[x0,y0] and pB:[x1,y1]
     */
    static fromObject(data: Record<string, unknown>): Triangle {
        const tempTriangle: TriangleInterface = Converters.convertToTriangle(data);
        return new Triangle(
            new Point(tempTriangle.pA.x, tempTriangle.pA.y, tempTriangle.pA.name),
            new Point(tempTriangle.pB.x, tempTriangle.pB.y, tempTriangle.pB.name),
            new Point(tempTriangle.pC.x, tempTriangle.pC.y, tempTriangle.pC.name),
            tempTriangle.name,
        );
    }

    /**
     * fromJSON returns a new Triangle constructed with
     * @param {string} json is a string representing this object with pA, pB and pC as properties in json format
     * @returns {Triangle} a new Triangle at given coordinates pA:[x0,y0] and pB:[x1,y1]
     */
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

    /**
     * toString returns a string representing the triangle
     * @returns {string} a string representing the triangle
     */
    toString(
        separator: string = ",",
        surroundingParenthesis: boolean = true,
        precision: number = 2,
        withName: boolean = true,
    ): string {
        const tmpRes = `${this._pA.toString(separator, surroundingParenthesis, precision)}${separator}${this._pB.toString(separator, surroundingParenthesis, precision)}`;
        if (surroundingParenthesis) {
            return withName ? `${this.name}:(${tmpRes})` : `(${tmpRes})`;
        } else {
            return withName ? `${this.name}:${tmpRes}` : `${tmpRes}`;
        }
    }

    /**
     * toJSON returns a string representing the triangle properties in json format
     * @returns {string} a string representing the triangle
     */
    toJSON(): string {
        return `{"pA":${this._pA.toJSON()}, "pB":${this._pB.toJSON()}, "pC":${this._pC.toJSON()}, "name":"${this.name}"}`;
    }

    /**
     * sameLocation allows to compare if this Triangle is at the same location as other
     * @param {Triangle} other
     * @returns {boolean} true if the 2 triangles are at the same location
     */
    sameLocation(other: Triangle): boolean {
        assertIsTriangle(other, "Triangle sameLocation other")
        return (
            this._pA.isSameLocation(other._pA) &&
            this._pB.isSameLocation(other._pB) &&
            this._pC.isSameLocation(other._pC)
        );
    }

    /**
     * equal allows to compare equality with other, they should have the same values for pA,pB and pC
     * @param {Triangle} other
     * @returns {boolean}
     */
    equal(other: Triangle): boolean {
        assertIsTriangle(other, "Triangle equal other")
        return (
            this.sameLocation(other) && this.name === other.name
        );
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

    /** determinant returns the determinant of the triangle
     * @returns {number} the determinant of the triangle
     */
    determinant(): number {
        return Point.determinant(this._pA, this._pB, this._pC);
    }

    /**
     * area returns the area of the triangle
     * derived from the shoelace formula : https://en.wikipedia.org/wiki/Shoelace_formula
     * @returns {number} the area of the triangle
     */
    area(): number {
        return Math.abs(this.determinant() / 2);
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
            Math.abs(this.b - this.c) <= EPSILON &&
            Math.abs(this.c - this.a) <= EPSILON
        );
    }

    // ── GeometryDriver implementation ──────────────────────────────

    /**
     * Returns the area of the triangle (delegates to area()).
     */
    getArea(): number {
        return this.area();
    }

    /**
     * Returns the perimeter of the triangle (delegates to perimeter()).
     */
    getPerimeter(): number {
        return this.perimeter();
    }

    /**
     * Returns the axis-aligned bounding box of the triangle.
     */
    getExtent(): Extent {
        return [
            Math.min(this._pA.x, this._pB.x, this._pC.x),
            Math.min(this._pA.y, this._pB.y, this._pC.y),
            Math.max(this._pA.x, this._pB.x, this._pC.x),
            Math.max(this._pA.y, this._pB.y, this._pC.y),
        ];
    }

    /**
     * Visitor double-dispatch: delegates to renderer.renderTriangle.
     */
    accept<T = string>(renderer: RenderDriver<T>, options: RenderOptions, invertY: boolean): T {
        return renderer.renderTriangle(this, options, invertY);
    }
}
