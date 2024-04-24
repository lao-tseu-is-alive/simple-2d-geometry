import Angle from "./Angle.ts";
import {EPSILON, PRECISION, getNumberOrNull, roundNumber, isNumeric} from "./Geometry.ts";

export interface iPoint {
    x: number,
    y: number,
    name?: string,
}

export type coordinate2dArray = [number, number];

/**
 * Class representing  a point in 2 dimension cartesian space
 */
export default class Point implements iPoint {
    private p: iPoint = {x: 0, y: 0, name: ''}

    get x(): number {
        return this.p.x;
    }

    set x(input: number | string) {
        let value = (typeof input === 'number') ? input : getNumberOrNull(input);
        if (value !== undefined) {
            this.p.x = value
        }
    }

    get y(): number {
        return this.p.y;
    }

    set y(input: number | string) {
        let value = (typeof input === 'number') ? input : getNumberOrNull(input);
        if (value !== undefined) {
            this.p.y = value
        }
    }

    get name(): (string) {
        if (this.p.name === undefined) {
            return '';
        }
        return this.p.name;
    }

    set name(value: string) {
        this.p.name = value;
    }

    /**
     * Creates a point
     * @param {number | undefined} x coordinates in cartesian space or array with [x, y] numbers
     * @param {number | undefined} y coordinates in cartesian space, ignored if first argument is an array
     * @param {number | undefined} name optional name of this point
     */
    constructor(x: number | undefined = 0, y: number | undefined = 0, name?: string) {
        this.p = {x:0, y:0, name:"" }
        this.x = x;
        this.y = y;
        if (name !== undefined) this.name = name;
    }

    /**
     * fromPolar creates a new Point in cartesian space from polar coordinates
     * @param {number} radius is the distance from origin to the point
     * @param {number} theta is the angle from x axes origin to point in mathematical order Counter-Clockwise
     * @param {Object} angleSystem your choice of one of AngularSystem Enum Radian, Degree or Gradians
     * @returns {Point} a new Point(x,y) located at the given polar coordinates
     */
    static fromPolar(radius: number, theta: Angle, name: (string | undefined)): Point {
        let tmpPoint: Point = new Point(0, 0, name)
        let angle: number = theta.toRadians()
        const tmpX = radius * Math.cos(angle)
        tmpPoint.x = Math.abs(tmpX) <= EPSILON ? 0 : roundNumber(tmpX, PRECISION)
        const tmpY = radius * Math.sin(angle)
        // noinspection JSSuspiciousNameCombination
        tmpPoint.y = Math.abs(tmpY) <= EPSILON ? 0 : roundNumber(tmpY, PRECISION)
        return tmpPoint
    }

    /**
     * fromPoint returns a new Point that is a copy (clone) of the otherPoint passed has parameter
     * @param {Point} otherPoint is the Point you want to copy
     * @returns {Point} a new Point located at the same cartesian coordinates as otherPoint
     */
    static fromPoint(otherPoint: Point): Point {
        if (otherPoint instanceof Point) {
            return new Point(otherPoint.x, otherPoint.y, otherPoint.name)
        } else {
            throw new TypeError('fromPoint needs parameter otherPoint of type Point')
        }
    }

    /**
     * fromArray returns a new Point constructed with
     * @param {[number, number]} coordinates is array containing number x as first element and y as second
     * @returns {Point} a new Point located at the same cartesian coordinates as coordinates[x,y]
     */
    static fromArray(coordinates:coordinate2dArray): Point {
        if ((typeof coordinates[0] === 'number') && (typeof coordinates[1] === 'number')) {
            return new Point(coordinates[0],coordinates[1])
        } else {
            throw new TypeError('fromArray needs parameter coordinates to be an array of 2 numbers [number, number]')
        }
    }

    /**
     * dump returns a string with all Point attributes values
     * @returns {string}
      */
    dump = (): string => `Point[${this.p.name}](${this.p.x}, ${this.p.y})`;

    /**
     * toString returns a string representation of this class instance with options for presentations
     * @param {string} separator placed between x and y values ', ' by default
     * @param {boolean} surroundingParenthesis allow to tell if result string should be surrounded with parenthesis (True by default)
     * @param {number} precision defines the number of decimals for the coordinates (2 by default)
     * @returns {string}
     */
    toString (separator = ',', surroundingParenthesis = true, precision = 2) {
        if (surroundingParenthesis) {
            return `(${roundNumber(this.x, precision)}${separator} ${roundNumber(this.y, 2)})`
        } else {
            return `${roundNumber(this.x, precision)}${separator} ${roundNumber(this.y, 2)}`
        }
    }

    /**
     * toArray returns an array representation of this Point class instance [x, y]
     * @returns {[number, number]} [x, y]
     */
    toArray ():coordinate2dArray {
        return [this.x, this.y]
    }

    /**
     * toWKT returns an OGC Well-known text (WKT) representation of this class instance
     * https://en.wikipedia.org/wiki/Well-known_text
     * @returns {string}
     */
    toWKT ():string {
        return `POINT(${this.x} ${this.y})`
    }

    /**
     * toEWKT returns an Postgis Extended Well-known text (EWKT) representation of this class instance
     * https://postgis.net/docs/using_postgis_dbmanagement.html#EWKB_EWKT
     * @param {number} srid is the Spatial reference systems identifier EPSG code default is 21781 for Switzerland MN03
     * @returns {string}
     */
    toEWKT (srid = 21781):string {
        return `SRID=${srid};POINT(${this.x} ${this.y})`
    }

    // Note : to implement toEWKB I can maybe use this lib : https://github.com/cschwarz/wkx

    /**
     * toGeoJSON returns a GeoJSON (http://geojson.org/) representation of this class instance geometry
     * @returns {string}
     */
    toGeoJSON ():string {
        return `{"type":"Point","coordinates":[${this.x},${this.y}]}`
    }

    /**
    * getPoint will return a copy (clone) of the Point
    */
    getPoint = (): iPoint => ({
        x: this.p.x,
        y: this.p.y,
        name: this.p.name,
    })
    // getDistanceFromOrigin returns the length of the vector from origin to this point
    getDistanceFromOrigin = (): number => Math.sqrt(this.p.x * this.p.x + this.p.y * this.p.y)

    // getAngleRad gives the angle in Radian from horizontal axis x with the vector from origin to this point
    getAngleRad = (): number => Math.atan(this.p.y / this.p.x)

    // getAngleDeg gives the angle in degree from horizontal axis x with the vector from origin to this point
    getAngleDeg = (): number => (Math.atan(this.p.y / this.p.x) * 360) / (2 * Math.PI);

    /**
     * will move this Point to the new position in cartesian space given by the arrCoordinates
     * @param {Array} arrCoordinates is an array with the 2 cartesian coordinates [x, y]
     * @returns {Point} return this instance of the object (to allow function chaining)
     */
    moveToArray (arrCoordinates:coordinate2dArray) {
        if ((isNumeric(arrCoordinates[0])) && (isNumeric(arrCoordinates[1]))) {
            this.x = arrCoordinates[0]
            this.y = arrCoordinates[1]
            return this
        } else {
            throw new TypeError('moveToArray needs an array of 2 numbers like this [1.0, 2.0]')
        }
    }

    /**
     * will move this Point to the new position in cartesian space given by the newX and newY values
     * @param {number} newX is the new x coordinates in cartesian space of this Point
     * @param {number} newY is the new y coordinates in cartesian space of this Point
     * @returns {Point} return this instance of the object (to allow function chaining)
     */
    moveTo (newX:number, newY:number) {
        if ((isNumeric(newX)) && (isNumeric(newY))) {
            this.x = newX
            this.y = newY
            return this
        } else {
            throw new TypeError('moveTo needs newX and newY to be valid numbers !')
        }
    }
    // move will put the Point in the absolute position defined by the passed x,y coordinates
    move = (x: number, y: number): Point => {
        this.p.x = x;
        this.p.y = y;
        return this;
    }

    // moveRelative will move the current Point by the passed x,y coordinates relative to current position
    moveRelative = (dx: number, dy: number): Point => {
        this.p.x += dx;
        this.p.y += dy;
        return this;
    }

    // rename allows to change the name attribute of the point
    rename = (name: string): Point => {
        this.name = name;
        return this;
    }
}
