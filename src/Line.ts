import Point from "./Point.ts";

/**
 * Class representing  a line in 2 dimension cartesian space
 */
export default class Line {
    private _start: Point = Point.fromArray([0,0]) // default start point
    private _end: Point = Point.fromArray([0,0]) // default end point
    private _name: string = 'Line'

    get start(): Point {
        return this._start;
    }

    set start(input: Point) {
        let value = (typeof input === 'object') ? input : undefined;
        if (value !== undefined) {
            this._start = value
        } else {
            throw new TypeError('start should be a Point object')
        }
    }

    get end(): Point {
        return this._end;
    }

    set end(input: Point) {
        let value = (typeof input === 'object') ? input : undefined;
        if (value !== undefined) {
            this._end = value
        } else {
            throw new TypeError('end should be a Point object')
        }
    }

    get name(): (string) {
        if (this._name === undefined) {
            return '';
        }
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }


    /**
     * Creates a line
     * @param {Point} start coordinates in cartesian space or array with [x, y] numbers
     * @param {Point} end coordinates in cartesian space or array with [x, y] numbers
     * @param {string | undefined} name optional name of this line
     */
    constructor(start: Point, end: Point, name?: string) {
        this._start = Point.fromArray([0,0])
        this._end = Point.fromArray([0,0])
        this.start = start
        this.end = end;
        if (name !== undefined) this.name = name;
    }
}
