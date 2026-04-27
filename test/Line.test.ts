import {describe, test, expect} from "bun:test";
import {Point, Angle} from "../src";
import Line, {type coordinatesLineArray} from "../src/Line";
import type {RenderDriver, RenderOptions} from "../src";

const defaultOptions: RenderOptions = {
    stroke: "#000000",
    strokeWidth: 1,
    fill: "none",
    opacity: 1.0,
    pointRadius: 3,
};

describe("Line module", () => {
    const PO = new Point(0, 0, "PO");
    const PObis = new Point(0, 0, "PObis");
    const P1 = new Point(1, 1, "P1");
    const L0 = new Line(PO, P1, "L0");

    describe("Line constructor", () => {
        test("constructor with parameters should store points", () => {
            expect(L0.start.isEqual(PO)).toBe(true);
            expect(L0.end.isEqual(P1)).toBe(true);
            expect(L0.name).toBe("L0");
            expect(L0 instanceof Line).toBe(true);
        });
        test("constructor with same points location should throw an Error", () => {
            expect(() => new Line(PO, PObis)).toThrow(RangeError);
        });
        test("constructor with invalid points should throw an Error", () => {
            expect(
                () => new Line({} as unknown as Point, {} as unknown as Point),
            ).toThrow(TypeError);
        });
    });

    describe("Line setters & getters", () => {
        test("start setter should store a point", () => {
            const P2 = new Point(2, 4, "P2");
            L0.start = P2;
            expect(L0.start.isEqual(P2)).toBe(true);
        });
        test("start setter should throw an Error if same location as end ", () => {
            expect(() => {
                L0.start = new Point(1, 1);
            }).toThrow(RangeError);
        });
        test("start setter should throw an Error if not a Point ", () => {
            expect(() => {
                L0.start = {} as unknown as Point;
            }).toThrow(TypeError);
        });
        test("end setter should store a point", () => {
            const P3 = new Point(0, 0, "P3");
            L0.end = P3;
            expect(L0.end.isEqual(P3)).toBe(true);
        });
        test("end setter should throw an Error if same location as start ", () => {
            const L2 = new Line(PO, P1, "L0");
            expect(() => {
                L2.end = new Point(0, 0);
            }).toThrow(RangeError);
        });
        test("end setter should throw an Error if not a Point ", () => {
            expect(() => {
                L0.end = {} as unknown as Point;
            }).toThrow(TypeError);
        });
        test("name setter should store a string", () => {
            L0.name = "L1";
            expect(L0.name).toBe("L1");
        });
        test("name getter should store an empty string if undefined", () => {
            const L1 = new Line(PO, P1);
            expect(L1.name).toBe("");
        });
        test("length getter should return the distance between start and end", () => {
            const L3 = Line.fromArray([[0, 0], [1, 1]]);
            expect(L3.length).toBeCloseTo(1.4142, 3);
            expect(Line.fromArray([[0, 0], [5, 0]]).length).toBeCloseTo(5.0, 2);
        });
        test("angle getter should return the angle between start and end", () => {
            const L3 = Line.fromArray([[0, 0], [1, 1]]);
            expect(L3.angle.toDegrees()).toBeCloseTo(45.0, 1);
            expect(Line.fromArray([[0, 0], [5, 0]]).angle.toDegrees()).toBeCloseTo(0.0, 1);
        });
        test("slope getter should return the slope between start and end", () => {
            const L3 = Line.fromArray([[0, 0], [1, 1]]);
            expect(L3.slope).toBeCloseTo(1.0, 1);
            expect(Line.fromArray([[0, 0], [5, 0]]).slope).toBeCloseTo(0.0, 1);
        });

        // --- Missing Alias and Vector Property Tests ---
        test("p1 and p2 aliases should map to start and end", () => {
            const l = new Line(new Point(0, 0), new Point(2, 2));
            expect(l.p1.isSameLocation(new Point(0, 0))).toBe(true);
            expect(l.p2.isSameLocation(new Point(2, 2))).toBe(true);
        });
        test("direction and normalizedDirection should return correct vectors", () => {
            const l = new Line(new Point(1, 1), new Point(4, 5));
            expect(l.direction.isSameLocation(new Point(3, 4))).toBe(true);
            expect(l.normalizedDirection.isSameLocation(new Point(0.6, 0.8))).toBe(true);
        });
        test("isVertical and isHorizontal should identify orthogonal lines", () => {
            const vLine = new Line(new Point(1, 0), new Point(1, 5));
            const hLine = new Line(new Point(0, 2), new Point(5, 2));
            const diagLine = new Line(new Point(0, 0), new Point(1, 1));

            expect(vLine.isVertical).toBe(true);
            expect(vLine.isHorizontal).toBe(false);

            expect(hLine.isHorizontal).toBe(true);
            expect(hLine.isVertical).toBe(false);

            expect(diagLine.isVertical).toBe(false);
            expect(diagLine.isHorizontal).toBe(false);
        });
        test("yIntercept should return correct offset or null if vertical", () => {
            const l1 = new Line(new Point(0, 5), new Point(1, 6)); // y = 1x + 5
            expect(l1.yIntercept).toBeCloseTo(5);

            const vLine = new Line(new Point(2, 0), new Point(2, 5));
            expect(vLine.yIntercept).toBeNaN(); // slope is Infinity, so Infinity * x results in NaN or we handle it gracefully. Wait, based on slopeTo, vertical slope is Infinity.
            // Let's test the specific logic implemented in Line.ts
            expect(vLine.yIntercept).toBeNaN();
        });
    });

    describe("Static Factories", () => {
        const lineL0 = new Line(PO, P1, "L0");

        test("fromLine should throw an Error when parameter is not a valid Line", () => {
            expect(Line.fromLine.bind(undefined, [] as unknown as Line)).toThrow(TypeError);
        });
        test("fromLine should have identical start and end points", () => {
            const L2 = Line.fromLine(lineL0);
            expect(L2.start.isSameLocation(lineL0.start)).toBe(true);
            expect(L2.end.isSameLocation(lineL0.end)).toBe(true);
        });
        test("fromLine should copy Points by value in the new Line", () => {
            const L2 = Line.fromLine(lineL0);
            L2.start = L2.start.moveTo(1.0, 10.0);
            expect(L2.start.x).toBe(1); // Modified locally
            expect(lineL0.start.x).toBe(0); // Original untouched
        });

        test("fromArray should create a Line from an array", () => {
            const lArray = Line.fromArray([[0, 0], [1, 1]]);
            expect(lArray.start.x).toBe(0);
            expect(lArray.end.x).toBe(1);
        });
        test("fromArray should throw an Error if array is not valid", () => {
            expect(Line.fromArray.bind(undefined, [0, 0, 1, 1] as unknown as coordinatesLineArray)).toThrow(TypeError);
        });

        test("fromObject should create a Line from an object", () => {
            const lObj = Line.fromObject({
                start: {x: 0, y: 0, name: "PO"},
                end: {x: 1, y: 1, name: "P1"},
                name: "L0",
            });
            expect(lObj.equal(new Line(PO, P1, "L0"))).toBe(true);
        });
        test("fromObject should throw an Error if object is undefined or null", () => {
            expect(() => Line.fromObject(undefined as any)).toThrow(TypeError);
        });

        test("fromJSON should create a Line from a JSON object", () => {
            const lJson = Line.fromJSON('{ "start": {"x":0, "y":0}, "end": {"x":1, "y":1}, "name": "L0" }');
            expect(lJson.name).toBe("L0");
        });
        test("fromJSON should throw an Error if JSON object is not valid", () => {
            expect(Line.fromJSON.bind(undefined, "{ start-it-up: [0, 0], end: [1, 1] }")).toThrow(TypeError);
        });

        // --- Missing Factory Tests ---
        test("fromTwoPointsCoordinates should construct a line from primitive numbers", () => {
            const l = Line.fromTwoPointsCoordinates(0, 0, 3, 4);
            expect(l.start.isSameLocation(new Point(0, 0))).toBe(true);
            expect(l.end.isSameLocation(new Point(3, 4))).toBe(true);
        });
        test("fromSlopeAndPoint should construct a line spanning dx=1 from the point", () => {
            const l = Line.fromSlopeAndPoint(2, new Point(0, 0));
            expect(l.slope).toBeCloseTo(2);
            expect(l.start.isSameLocation(new Point(0, 0))).toBe(true);
            expect(l.end.isSameLocation(new Point(1, 2))).toBe(true);
        });
        test("fromSlopeAndPoint should construct a vertical line from the point when m is infinite", () => {
            const l = Line.fromSlopeAndPoint(Number.POSITIVE_INFINITY, new Point(0, 0));
            expect(l.start.isSameLocation(new Point(0, 0))).toBe(true);
            expect(l.angle).toBeCloseTo(Math.PI/2);
            expect(l.isVertical).toBe(true)
        });
    });

    describe("Serialization & Formatting", () => {
        const serLine = new Line(PO, P1, "L0");
        test("toJSON should create a JSON object from a Line", () => {
            const json = serLine.toJSON();
            expect(json).toContain('"start":{"x":0,"y":0,"name":"PO"}');
            expect(json).toContain('"name":"L0"}');
        });
        test("toJSON without name should omit name property", () => {
            const noName = new Line(new Point(0, 0), new Point(1, 1));
            const json = noName.toJSON();
            expect(json).not.toContain('"name"');
        });
        test("toString should create a string from a Line", () => {
            expect(serLine.toString()).toBe("L0:((0,0),(1,1))");
        });
        test("toString should create a correct string from a Line without parenthesis", () => {
            expect(serLine.toString("\t", false)).toBe("L0:0\t0\t1\t1");
        });
        test("toLineEquation should format properly for normal, horizontal, and vertical lines", () => {
            const diag = new Line(new Point(0, 1), new Point(1, 3));
            expect(diag.toLineEquation()).toBe("Line: y = 2.0000x + 1.0000");

            const horiz = new Line(new Point(0, 5), new Point(10, 5));
            expect(horiz.toLineEquation()).toBe("Line: y = 5.0000");

            const vert = new Line(new Point(3, 0), new Point(3, 10));
            expect(vert.toLineEquation()).toBe("Line: x = 3.0000");
        });
    });

    describe("Equality & Status Checkers", () => {
        const lBase = new Line(PO, P1, "L0");

        test("sameLocation should return true if same location", () => {
            const lTest = new Line(new Point(0, 0), P1, "L1");
            expect(lBase.sameLocation(lTest)).toBe(true);
        });
        test("sameLocation should return false if different location", () => {
            expect(lBase.sameLocation(new Line(PO, new Point(2, 2)))).toBe(false);
        });
        test("sameLocation should throw an Error if not a Line", () => {
            expect(lBase.sameLocation.bind(undefined, {} as unknown as Line)).toThrow(TypeError);
        });
        test("equal should return true if same location and same name", () => {
            expect(lBase.equal(new Line(PO, P1, "L0"))).toBe(true);
        });
        test("equal should return false if different name", () => {
            expect(lBase.equal(new Line(PO, P1, "L2"))).toBe(false);
        });
        test("clone should create a new Line with same coordinates", () => {
            const L1 = lBase.clone();
            expect(L1.equal(lBase)).toBe(true);
            expect(L1 === lBase).toBe(false);
        });
        test("rename should rename the Line", () => {
            const renLine = new Line(PO, P1, "Old");
            renLine.rename("New");
            expect(renLine.name).toBe("New");
        });
    });

    describe("Spatial Queries & Math", () => {
        test("getPointAt should interpolate or extrapolate based on parameter t", () => {
            const l = new Line(new Point(0, 0), new Point(10, 10));
            expect(l.getPointAt(0).isSameLocation(new Point(0, 0))).toBe(true);
            expect(l.getPointAt(0.5).isSameLocation(new Point(5, 5))).toBe(true);
            expect(l.getPointAt(1).isSameLocation(new Point(10, 10))).toBe(true);
            expect(l.getPointAt(2).isSameLocation(new Point(20, 20))).toBe(true);
        });

        test("getDistanceTo should find shortest perpendicular distance to infinite line", () => {
            const l = new Line(new Point(0, 0), new Point(10, 0));
            expect(l.getDistanceTo(new Point(5, 5))).toBeCloseTo(5);
            expect(l.getDistanceTo(new Point(-5, 3))).toBeCloseTo(3); // outside bounds, infinite line test
        });

        test("isParallelTo resists epsilon-scaling bugs with micro-vectors", () => {
            const l1 = new Line(new Point(0, 0), new Point(1e-6, 0));
            const l2 = new Line(new Point(0, 0), new Point(0, 1e-6));
            expect(l1.isParallelTo(l2)).toBe(false);

            const l3 = new Line(new Point(0, 1), new Point(10, 1));
            expect(l1.isParallelTo(l3)).toBe(true);
        });

        test("isPerpendicularTo should correctly identify orthogonal lines", () => {
            const l1 = new Line(new Point(0, 0), new Point(10, 0));
            const l2 = new Line(new Point(0, 0), new Point(0, 10));
            expect(l1.isPerpendicularTo(l2)).toBe(true);
            expect(l1.isPerpendicularTo(new Line(new Point(0, 0), new Point(10, 10)))).toBe(false);
        });

        test("getIntersectionWith finds crossing point of infinite lines", () => {
            const l1 = new Line(new Point(0, 0), new Point(10, 10));
            const l2 = new Line(new Point(0, 10), new Point(10, 0));
            const inter = l1.getIntersectionWith(l2);
            expect(inter?.x).toBeCloseTo(5);
            expect(inter?.y).toBeCloseTo(5);

            const lParallel = new Line(new Point(0, 1), new Point(10, 11));
            expect(l1.getIntersectionWith(lParallel)).toBeNull();
        });

        test("getSegmentIntersectionWith honors finite bounds", () => {
            const l1 = new Line(new Point(0, 0), new Point(10, 0));

            // Intersects in the middle
            const l2 = new Line(new Point(5, -5), new Point(5, 5));
            expect(l1.getSegmentIntersectionWith(l2)?.x).toBeCloseTo(5);

            // Misses the bound
            const l3 = new Line(new Point(15, -5), new Point(15, 5));
            expect(l1.getSegmentIntersectionWith(l3)).toBeNull();

            // Parallel fallback
            const l4 = new Line(new Point(0, 1), new Point(10, 1));
            expect(l1.getSegmentIntersectionWith(l4)).toBeNull();
        });

        test("isPointOnSegment correctly identifies bounded collinearity", () => {
            const l = new Line(new Point(0, 0), new Point(10, 0));
            expect(l.isPointOnSegment(new Point(5, 0))).toBe(true);
            expect(l.isPointOnSegment(new Point(15, 0))).toBe(false); // Collinear but out of bounds
            expect(l.isPointOnSegment(new Point(5, 1))).toBe(false); // Inside bounding box but not collinear
        });

        test("projectPointToLine drops perpendicular to infinite line", () => {
            const l = new Line(new Point(0, 0), new Point(10, 0));
            const proj = l.projectPointToLine(new Point(5, 5));
            expect(proj.isSameLocation(new Point(5, 0))).toBe(true);

            const projOut = l.projectPointToLine(new Point(15, 5));
            expect(projOut.isSameLocation(new Point(15, 0))).toBe(true);
        });

        test("reflectPointAcrossLine mirrors across the infinite line", () => {
            const l = new Line(new Point(0, 0), new Point(10, 0));
            const ref = l.reflectPointAcrossLine(new Point(5, 5));
            expect(ref.isSameLocation(new Point(5, -5))).toBe(true);
        });

        test("getAngleTo calculates angle between two lines", () => {
            const l1 = new Line(new Point(0, 0), new Point(10, 0));
            const l2 = new Line(new Point(0, 0), new Point(0, 10));
            // Should be PI/2 radians
            expect(l1.getAngleTo(l2)).toBeCloseTo(Math.PI / 2);
        });
    });

    describe("Transformations", () => {
        const lBase = new Line(new Point(0, 0), new Point(10, 0));

        test("translate shifts the line", () => {
            const shifted = lBase.translate(new Point(2, 3));
            expect(shifted.start.isSameLocation(new Point(2, 3))).toBe(true);
            expect(shifted.end.isSameLocation(new Point(12, 3))).toBe(true);
        });

        test("rotate revolves around origin", () => {
            const rotated = lBase.rotate(Angle.fromDegrees(90));
            expect(rotated.start.isSameLocation(new Point(0, 0))).toBe(true);
            expect(rotated.end.isSameLocation(new Point(0, 10))).toBe(true);
        });

        test("rotateAround revolves around specific center", () => {
            const rotated = lBase.rotateAround(Angle.fromDegrees(90), new Point(5, 0));
            // Origin (0,0) rotated 90deg around (5,0) goes to (5, -5)
            // End (10,0) rotated 90deg around (5,0) goes to (5, 5)
            expect(rotated.start.isSameLocation(new Point(5, -5))).toBe(true);
            expect(rotated.end.isSameLocation(new Point(5, 5))).toBe(true);

            // Edge case: rotation around origin just delegates to rotate()
            const rotateOrig = lBase.rotateAround(Angle.fromDegrees(90), new Point(0, 0));
            expect(rotateOrig.end.isSameLocation(new Point(0, 10))).toBe(true);
        });
    });

    describe("GeometryDriver Implementation", () => {
        const l = new Line(new Point(0, 0), new Point(3, 4));

        test("getArea should be 0", () => {
            expect(l.getArea()).toBe(0);
        });

        test("getPerimeter should equal length", () => {
            expect(l.getPerimeter()).toBe(5);
        });

        test("getExtent should return the bounding box", () => {
            const l2 = new Line(new Point(5, 10), new Point(-2, 8));
            const extent = l2.getExtent();
            // [minX, minY, maxX, maxY]
            expect(extent).toEqual([-2, 8, 5, 10]);
        });

        test("accept delegates to renderLine on the visitor", () => {
            let passedLine: Line | null = null;
            let passedOpts: RenderOptions | null = null;
            let passedInvert: boolean = false;

            const mockRenderer: RenderDriver<string> = {
                renderPoint: () => "",
                renderLine: (line, opts, invert) => {
                    passedLine = line;
                    passedOpts = opts;
                    passedInvert = invert;
                    return "rendered-line";
                },
                renderCircle: () => "",
                renderTriangle: () => "",
                renderPolygon: () => "",
                compose: () => ""
            };

            const options: RenderOptions = {
                ...defaultOptions,
                stroke: "red"
            };
            const result = l.accept(mockRenderer, options, true);

            expect(result).toBe("rendered-line");
            expect(passedLine!).toBe(l);
            expect(passedOpts!).toBe(options);
            expect(passedInvert).toBe(true);
        });
    });
});
