import Point, {assertIsPoint, type coordinate2dArray, type iPoint} from "./Point.ts";
import Converters from "./Converters.ts";
import Angle from "./Angle.ts";
import Line from "./Line.ts";
import type {GeometryDriver, Extent} from "./Driver.ts";
import type {RenderDriver, RenderOptions} from "./RenderDriver.ts";
import {EPSILON, Guard} from "./Geometry.ts";

/**
 * PolygonInterface is an interface for a Polygon object
 * @interface PolygonInterface
 * @property {iPoint[]} points array of Point objects defining the polygon vertices
 * @property {string} name optional name of this polygon
 */
export interface PolygonInterface {
    points: iPoint[];
    name?: string;
}

/**
 * coordinatesPolygonArray is an array of n points with 2d coordinates
 */
export type coordinatesPolygonArray = coordinate2dArray[];

export function assertIsPolygon(val: any, msg: string = ""): asserts val is Polygon {
    Guard.throwIf(!(val instanceof Polygon), `${msg} expected a Polygon instance.`);
}

/**
 * Class representing a polygon in 2 dimension cartesian space
 * @class Polygon
 * @implements {GeometryDriver}
 * @property {Point[]} points array of vertices defining the polygon
 * @property {string} name optional name of this polygon
 * @property {number} vertexCount number of vertices
 * @property {Line[]} edges array of Line segments connecting consecutive vertices
 */
export default class Polygon implements GeometryDriver {
    private _points: Point[] = [];
    private _name: string | undefined = undefined;

    /**
     * get points returns a copy of the array of vertices defining the polygon
     * @returns {Point[]} a copy of the vertices array
     */
    get points(): Point[] {
        return this._points.map(p => p.clone());
    }

    /**
     * set points allows changing the vertices of the polygon
     * @param {Point[]} input is the new array of vertices
     */
    set points(input: Point[]) {
        if (!Array.isArray(input) || input.length < 3) {
            throw new RangeError("Polygon needs at least 3 vertices");
        }
        for (const p of input) {
            assertIsPoint(p, "Polygon points");
        }
        this._points = input.map(p => p.clone());
    }

    /**
     * get vertexCount returns the number of vertices in the polygon
     * @returns {number} the number of vertices
     */
    get vertexCount(): number {
        return this._points.length;
    }

    /**
     * get edges returns the array of Line segments connecting consecutive vertices
     * The last vertex connects back to the first.
     * @returns {Line[]} array of edge segments
     */
    get edges(): Line[] {
        const edges: Line[] = [];
        for (let i = 0; i < this._points.length; i++) {
            const start = this._points[i]!;
            const end = this._points[(i + 1) % this._points.length]!;
            edges.push(new Line(start, end));
        }
        return edges;
    }

    /**
     * name returns the name attribute of the polygon
     * @returns {string} the name of the polygon
     */
    get name(): string {
        if (this._name === undefined) {
            return "";
        }
        return this._name;
    }

    /**
     * set name allows to change the name attribute of the polygon
     * @param value is the new name of the polygon
     */
    set name(value: string) {
        this._name = value;
    }

    /**
     * Creates a polygon
     * @param {Point[]} points array of vertices defining the polygon
     * @param {string | undefined} name optional name of this polygon
     */
    constructor(points: Point[], name?: string) {
        if (!Array.isArray(points) || points.length < 3) {
            throw new RangeError("Polygon needs at least 3 vertices");
        }
        for (const p of points) {
            assertIsPoint(p, "Polygon constructor");
        }
        this._points = points.map(p => p.clone());
        if (name !== undefined) this.name = name;
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Static Factories
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * fromPolygon returns a new Polygon that is a copy (clone) of the other passed as parameter
     * @param {Polygon} other is the Polygon you want to copy
     * @returns {Polygon} a new Polygon located at the same cartesian coordinates as other
     */
    static fromPolygon(other: Polygon): Polygon {
        assertIsPolygon(other, "Polygon fromPolygon other");
        return new Polygon(other.points, other.name);
    }

    /**
     * fromArray returns a new Polygon constructed with
     * @param {coordinatesPolygonArray} coordinatesPolygon is an array of points with 2d coordinates: [[number, number], ...]
     * @returns {Polygon} a new Polygon at given coordinates
     */
    static fromArray(coordinatesPolygon: coordinatesPolygonArray): Polygon {
        if (!Array.isArray(coordinatesPolygon) || coordinatesPolygon.length < 3) {
            throw new TypeError(
                "fromArray needs parameter coordinates to be an array of at least 3 points with 2d coordinates : [[number, number], ...]",
            );
        }
        return new Polygon(
            coordinatesPolygon.map(coord => Point.fromArray(coord)),
        );
    }

    /**
     * fromObject returns a new Polygon constructed with
     * @param {Record<string, unknown>} data is an object with points as property
     * @returns {Polygon} a new Polygon at given coordinates
     */
    static fromObject(data: Record<string, unknown>): Polygon {
        if (data === undefined || data === null) {
            throw new TypeError("cannot create a Polygon from nothing");
        }
        const tempPolygon: PolygonInterface = Converters.convertToPolygon(data);
        return new Polygon(
            tempPolygon.points.map(p => new Point(p.x, p.y, p.name)),
            tempPolygon.name,
        );
    }

    /**
     * fromJSON returns a new Polygon constructed with
     * @param {string} json is a string representing this object with points as properties in json format
     * @returns {Polygon} a new Polygon at given coordinates
     */
    static fromJSON(json: string): Polygon {
        try {
            const tmpObject = JSON.parse(json);
            return Polygon.fromObject(tmpObject);
        } catch (e) {
            throw new TypeError(
                `Polygon:fromJSON got ${e}, needs a valid JSON string as parameter :${json}`,
            );
        }
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Instance Methods
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * clone returns a new Polygon that is a copy of itself
     * @returns {Polygon} a new Polygon located at the same cartesian coordinates as this Polygon
     */
    clone(): Polygon {
        return Polygon.fromPolygon(this);
    }

    /**
     * toString returns a string representing the polygon
     * @returns {string} a string representing the polygon
     */
    toString(
        separator: string = ",",
        surroundingParenthesis: boolean = true,
        precision: number = 2,
        withName: boolean = true,
    ): string {
        const pointStrings = this._points.map(p =>
            p.toString(separator, surroundingParenthesis, precision),
        );
        const tmpRes = pointStrings.join(separator);
        if (surroundingParenthesis) {
            return withName ? `${this.name}:(${tmpRes})` : `(${tmpRes})`;
        } else {
            return withName ? `${this.name}:${tmpRes}` : `${tmpRes}`;
        }
    }

    /**
     * toJSON returns a string representing the polygon properties in json format
     * @returns {string} a string representing the polygon
     */
    toJSON(): string {
        const pointsJson = this._points.map(p => p.toJSON()).join(",");
        if (this.name.length > 0) {
            return `{"points":[${pointsJson}],"name":"${this.name}"}`;
        }
        return `{"points":[${pointsJson}]}`;
    }

    /**
     * toWKT returns an OGC Well-known text (WKT) representation of this polygon
     * https://en.wikipedia.org/wiki/Well-known_text
     * @returns {string}
     */
    toWKT(): string {
        const coords = this._points
            .map(p => `${p.x} ${p.y}`)
            .join(",");
        return `POLYGON((${coords}))`;
    }

    /**
     * toEWKT: give a Postgis Extended Well-known text (EWKT) representation of this class instance
     * https://postgis.net/docs/using_postgis_dbmanagement.html#EWKB_EWKT
     * @param {number} srid is the Spatial reference systems identifier EPSG code, default is 2056 for Switzerland MN95
     * @returns {string} WKT representation of this line geometry
     */
    toEWKT (srid = 2056) {
        return `SRID=${srid};${this.toWKT()}`
    }

    /**
     * toGeoJSON returns a GeoJSON representation of this polygon geometry
     * @returns {string}
     */
    toGeoJSON(): string {
        const coords = this._points
            .map(p => `[${p.x},${p.y}]`)
            .join(",");
        return `{"type":"Polygon","coordinates":[[${coords}]]}`;
    }

    /**
     * sameLocation allows to compare if this Polygon is at the same location as other
     * @param {Polygon} other
     * @returns {boolean} true if the 2 polygons have the same vertices in the same order
     */
    sameLocation(other: Polygon): boolean {
        assertIsPolygon(other, "Polygon sameLocation other");
        if (this.vertexCount !== other.vertexCount) {
            return false;
        }
        return this._points.every((p, i) =>
            p!.isSameLocation(other._points[i]!),
        );
    }

    /**
     * equal allows to compare equality with other, they should have the same values for points
     * @param {Polygon} other
     * @returns {boolean}
     */
    equal(other: Polygon): boolean {
        assertIsPolygon(other, "Polygon equal other");
        return this.sameLocation(other) && this.name === other.name;
    }

    /**
     * rename allows to change the name attribute of the polygon
     * @param {string} newName is the new name of the polygon
     * @returns {Polygon} return this instance of the object (to allow function chaining)
     */
    rename(newName: string): this {
        this.name = newName;
        return this;
    }

    /**
     * getVertex returns the vertex at the given index
     * @param {number} index the index of the vertex
     * @returns {Point} the vertex at the given index
     */
    getVertex(index: number): Point {
        if (index < 0 || index >= this._points.length) {
            throw new RangeError("Index out of bounds");
        }
        return this._points[index]!.clone();
    }

    /**
     * setVertex sets the vertex at the given index
     * @param {number} index the index of the vertex to set
     * @param {Point} point the new vertex
     * @returns {Polygon} return this instance of the object (to allow function chaining)
     */
    setVertex(index: number, point: Point): this {
        assertIsPoint(point, "Polygon setVertex");
        if (index < 0 || index >= this._points.length) {
            throw new RangeError("Index out of bounds");
        }
        this._points[index] = point.clone();
        return this;
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Geometric Methods
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * area returns the signed area of the polygon using the shoelace formula
     * Positive for counter-clockwise polygons, negative for clockwise.
     * @returns {number} the signed area of the polygon
     */
    signedArea(): number {
        let area = 0;
        for (let i = 0; i < this._points.length; i++) {
            const current = this._points[i]!;
            const next = this._points[(i + 1) % this._points.length]!;
            area += current.x * next.y - next.x * current.y;
        }
        return area / 2;
    }

    /**
     * area returns the absolute area of the polygon
     * @returns {number} the area of the polygon
     */
    area(): number {
        return Math.abs(this.signedArea());
    }

    /**
     * perimeter returns the perimeter of the polygon
     * @returns {number} the perimeter of the polygon
     */
    perimeter(): number {
        return this.edges.reduce((sum, edge) => sum + edge.length, 0);
    }

    /**
     * centroid returns the geometric center (centroid) of the polygon
     * @returns {Point} the centroid of the polygon
     */
    centroid(): Point {
        let cx = 0;
        let cy = 0;
        let a = 0;
        for (let i = 0; i < this._points.length; i++) {
            const current = this._points[i]!;
            const next = this._points[(i + 1) % this._points.length]!;
            const cross = current.x * next.y - next.x * current.y;
            cx += (current.x + next.x) * cross;
            cy += (current.y + next.y) * cross;
            a += cross;
        }
        const factor = 1 / (3 * a);
        return new Point(cx * factor, cy * factor);
    }

    /**
     * containsPoint checks if a point is inside the polygon using ray casting
     * @param {Point} point the point to check
     * @returns {boolean} true if the point is inside or on the edge of the polygon
     */
    containsPoint(point: Point): boolean {
        assertIsPoint(point, "Polygon containsPoint");
        let inside = false;
        for (let i = 0, j = this._points.length - 1; i < this._points.length; j = i++) {
            const xi = this._points[i]!.x;
            const yi = this._points[i]!.y;
            const xj = this._points[j]!.x;
            const yj = this._points[j]!.y;

            const intersect =
                yi > point.y !== yj > point.y &&
                point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

            if (intersect) inside = !inside;
        }
        // Also check if point is exactly on an edge
        if (!inside) {
            return this.edges.some(edge => edge.isPointOnSegment(point));
        }
        return inside;
    }

    /**
     * isConvex checks if the polygon is convex
     * @returns {boolean} true if the polygon is convex
     */
    isConvex(): boolean {
        if (this._points.length < 4) return true; // Triangles are always convex
        let sign: number | undefined = undefined;
        for (let i = 0; i < this._points.length; i++) {
            const p1 = this._points[i]!;
            const p2 = this._points[(i + 1) % this._points.length]!;
            const p3 = this._points[(i + 2) % this._points.length]!;
            const cross = Point.determinant(p1, p2, p3);
            if (Math.abs(cross) <= EPSILON) continue; // Collinear points don't change convexity
            const currentSign = Math.sign(cross);
            if (sign === undefined) {
                sign = currentSign;
            } else if (sign !== currentSign) {
                return false;
            }
        }
        return true;
    }

    /**
     * isSimple checks if the polygon is simple (does not self-intersect)
     * @returns {boolean} true if the polygon is simple
     */
    isSimple(): boolean {
        const edges = this.edges;
        for (let i = 0; i < edges.length; i++) {
            for (let j = i + 2; j < edges.length; j++) {
                // Skip adjacent edges and the closing edge pair
                if (i === 0 && j === edges.length - 1) continue;
                const intersection = edges[i]!.getSegmentIntersectionWith(edges[j]!);
                if (intersection !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * orientation returns the orientation of the polygon
     * @returns {1 | -1 | 0} 1 for counter-clockwise, -1 for clockwise, 0 for degenerate
     */
    orientation(): 1 | -1 | 0 {
        const area = this.signedArea();
        if (Math.abs(area) <= EPSILON) return 0;
        return area > 0 ? 1 : -1;
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // Transformations (Return new Polygon instances)
    // ──────────────────────────────────────────────────────────────────────────────

    /**
     * translate will add the coordinates of the other to a copy of this Polygon
     * @param {Point} other
     * @returns {Polygon} return a new Polygon object translated by other.x, other.y
     */
    translate(other: Point): Polygon {
        assertIsPoint(other, "Polygon translate other");
        return new Polygon(
            this._points.map(p => p.add(other)),
            this.name,
        );
    }

    /**
     * rotate will rotate a copy of this Polygon by theta around the origin (0,0)
     * @param {Angle} theta is the angle to rotate this Polygon
     * @returns {Polygon} return a new Polygon object rotated by theta
     */
    rotate(theta: Angle): Polygon {
        return new Polygon(
            this._points.map(p => p.rotate(theta)),
            this.name,
        );
    }

    /**
     * rotateAround will rotate a copy of this Polygon by theta around another center Point
     * @param {Angle} theta is the angle to rotate this Polygon
     * @param {Point} center is the Point to use as center of rotation
     * @returns {Polygon} return a new Polygon object rotated
     */
    rotateAround(theta: Angle, center: Point): Polygon {
        assertIsPoint(center, "Polygon rotateAround center");
        return new Polygon(
            this._points.map(p => p.rotateAround(theta, center)),
            this.name,
        );
    }

    /**
     * scale will scale a copy of this Polygon by the given factor around the origin
     * @param {number} factor is the scale factor
     * @returns {Polygon} return a new Polygon object scaled
     */
    scale(factor: number): Polygon {
        return new Polygon(
            this._points.map(p => p.multiply(factor)),
            this.name,
        );
    }

    /**
     * scaleAround will scale a copy of this Polygon by the given factor around a center Point
     * @param {number} factor is the scale factor
     * @param {Point} center is the Point to use as center of scaling
     * @returns {Polygon} return a new Polygon object scaled
     */
    scaleAround(factor: number, center: Point): Polygon {
        assertIsPoint(center, "Polygon scaleAround center");
        return new Polygon(
            this._points.map(p => p.subtract(center).multiply(factor).add(center)),
            this.name,
        );
    }

    // ── GeometryDriver implementation ──────────────────────────────

    /**
     * Returns the area of the polygon (delegates to area()).
     */
    getArea(): number {
        return this.area();
    }

    /**
     * Returns the perimeter of the polygon (delegates to perimeter()).
     */
    getPerimeter(): number {
        return this.perimeter();
    }

    /**
     * Returns the axis-aligned bounding box of the polygon.
     */
    getExtent(): Extent {
        const xs = this._points.map(p => p.x);
        const ys = this._points.map(p => p.y);
        return [
            Math.min(...xs),
            Math.min(...ys),
            Math.max(...xs),
            Math.max(...ys),
        ];
    }

    /**
     * Visitor double-dispatch: delegates to renderer.renderPolygon.
     */
    accept<T = string>(renderer: RenderDriver<T>, options: RenderOptions, invertY: boolean): T {
        return renderer.renderPolygon(this, options, invertY);
    }
}
