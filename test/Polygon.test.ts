import {describe, test, expect} from "bun:test";
import {Point, Angle} from "../src";
import Polygon, {type coordinatesPolygonArray} from "../src/Polygon";
import type {RenderDriver, RenderOptions} from "../src";

const defaultOptions: RenderOptions = {
    stroke: "#000000",
    strokeWidth: 1,
    fill: "none",
    opacity: 1.0,
    pointRadius: 3,
};

describe("Polygon module", () => {
    const P0 = new Point(0, 0, "P0");
    const P1 = new Point(4, 0, "P1");
    const P2 = new Point(4, 3, "P2");
    const P3 = new Point(0, 3, "P3");
    const square = new Polygon([P0, P1, P2, P3], "square");

    const T0 = new Point(0, 0);
    const T1 = new Point(1, 0);
    const T2 = new Point(0, 1);
    const trianglePoly = new Polygon([T0, T1, T2], "triangle");

    describe("Polygon constructor", () => {
        test("constructor with parameters should store points", () => {
            expect(square.vertexCount).toBe(4);
            expect(square.name).toBe("square");
            expect(square instanceof Polygon).toBe(true);
        });
        test("constructor with less than 3 points should throw an Error", () => {
            expect(() => new Polygon([P0, P1])).toThrow(RangeError);
        });
        test("constructor with invalid points should throw an Error", () => {
            expect(() => new Polygon([P0, {} as unknown as Point, P2])).toThrow(TypeError);
        });
        test("constructor clones points so external mutation doesn't affect polygon", () => {
            const mutableP = new Point(0, 0);
            const poly = new Polygon([mutableP, P1, P2]);
            mutableP.moveTo(100, 100);
            expect(poly.getVertex(0).isSameLocation(new Point(0, 0))).toBe(true);
        });
    });

    describe("Polygon setters & getters", () => {
        test("points getter should return cloned points", () => {
            const pts = square.points;
            expect(pts.length).toBe(4);
            expect(pts[0]!.isSameLocation(P0)).toBe(true);
            // Ensure clones
            pts[0]!.moveTo(100, 100);
            expect(square.getVertex(0).isSameLocation(P0)).toBe(true);
        });
        test("points setter should store new points", () => {
            const poly = square.clone();
            poly.points = [P0, P1, P2];
            expect(poly.vertexCount).toBe(3);
        });
        test("points setter should throw with less than 3 points", () => {
            expect(() => {
                square.points = [P0, P1];
            }).toThrow(RangeError);
        });
        test("vertexCount getter should return correct count", () => {
            expect(trianglePoly.vertexCount).toBe(3);
            expect(square.vertexCount).toBe(4);
        });
        test("name setter should store a string", () => {
            const poly = square.clone();
            poly.name = "newName";
            expect(poly.name).toBe("newName");
        });
        test("name getter should return empty string if undefined", () => {
            const poly = new Polygon([P0, P1, P2]);
            expect(poly.name).toBe("");
        });
        test("edges getter should return correct Line segments", () => {
            const edges = trianglePoly.edges;
            expect(edges.length).toBe(3);
            expect(edges[0]!.start.isSameLocation(T0)).toBe(true);
            expect(edges[0]!.end.isSameLocation(T1)).toBe(true);
            expect(edges[1]!.start.isSameLocation(T1)).toBe(true);
            expect(edges[1]!.end.isSameLocation(T2)).toBe(true);
            expect(edges[2]!.start.isSameLocation(T2)).toBe(true);
            expect(edges[2]!.end.isSameLocation(T0)).toBe(true);
        });
        test("getVertex should return cloned point at index", () => {
            expect(square.getVertex(0).isSameLocation(P0)).toBe(true);
            expect(square.getVertex(3).isSameLocation(P3)).toBe(true);
        });
        test("getVertex should throw on out of bounds", () => {
            expect(() => square.getVertex(-1)).toThrow(RangeError);
            expect(() => square.getVertex(4)).toThrow(RangeError);
        });
        test("setVertex should update point at index", () => {
            const poly = square.clone();
            const newPoint = new Point(5, 5);
            poly.setVertex(1, newPoint);
            expect(poly.getVertex(1).isSameLocation(newPoint)).toBe(true);
        });
    });

    describe("Static Factories", () => {
        test("fromPolygon should throw an Error when parameter is not a valid Polygon", () => {
            expect(Polygon.fromPolygon.bind(undefined, [] as unknown as Polygon)).toThrow(TypeError);
        });
        test("fromPolygon should create an identical polygon", () => {
            const copy = Polygon.fromPolygon(square);
            expect(copy.equal(square)).toBe(true);
        });
        test("fromPolygon should copy Points by value", () => {
            const copy = Polygon.fromPolygon(square);
            copy.setVertex(0, new Point(99, 99));
            expect(copy.getVertex(0).isSameLocation(new Point(99, 99))).toBe(true);
            expect(square.getVertex(0).isSameLocation(P0)).toBe(true);
        });
        test("fromArray should create a Polygon from an array", () => {
            const arr: coordinatesPolygonArray = [[0, 0], [4, 0], [4, 3], [0, 3]];
            const poly = Polygon.fromArray(arr);
            expect(poly.vertexCount).toBe(4);
            expect(poly.getVertex(0).isSameLocation(P0)).toBe(true);
            expect(poly.getVertex(1).isSameLocation(P1)).toBe(true);
        });
        test("fromArray should throw with less than 3 points", () => {
            expect(Polygon.fromArray.bind(undefined, [[0, 0], [1, 1]] as coordinatesPolygonArray)).toThrow(TypeError);
        });
        test("fromObject should create a Polygon from an object", () => {
            const obj = {
                points: [
                    {x: 0, y: 0, name: "P0"},
                    {x: 4, y: 0, name: "P1"},
                    {x: 4, y: 3, name: "P2"},
                ],
                name: "poly",
            };
            const poly = Polygon.fromObject(obj);
            expect(poly.vertexCount).toBe(3);
            expect(poly.name).toBe("poly");
        });
        test("fromObject should throw if object is undefined or null", () => {
            expect(() => Polygon.fromObject(undefined as any)).toThrow(TypeError);
        });
        test("fromJSON should create a Polygon from a JSON string", () => {
            const json = '{"points":[{"x":0,"y":0},{"x":4,"y":0},{"x":4,"y":3}],"name":"poly"}';
            const poly = Polygon.fromJSON(json);
            expect(poly.vertexCount).toBe(3);
            expect(poly.name).toBe("poly");
        });
        test("fromJSON should throw with invalid JSON", () => {
            expect(Polygon.fromJSON.bind(undefined, "{ invalid json")).toThrow(TypeError);
        });
    });

    describe("Serialization & Formatting", () => {
        test("toJSON should serialize all vertices and name", () => {
            const json = square.toJSON();
            expect(json).toContain("\"name\":\"square\"");
            expect(json).toContain("\"points\"");
            expect(json).toContain("P0");
            expect(json).toContain("P3");
        });
        test("toJSON without name should omit polygon name property", () => {
            const poly = new Polygon([new Point(0, 0), new Point(4, 0), new Point(4, 3)]);
            const json = poly.toJSON();
            expect(json).toBe('{"points":[{"x":0,"y":0},{"x":4,"y":0},{"x":4,"y":3}]}');
        });
        test("toString should create a formatted string", () => {
            expect(square.toString()).toContain("square");
            expect(square.toString()).toContain("(0,0)");
        });
        test("toWKT should create a valid WKT string", () => {
            expect(square.toWKT()).toBe("POLYGON((0 0,4 0,4 3,0 3))");
        });
        test("toGeoJSON should create a valid GeoJSON string", () => {
            const geo = square.toGeoJSON();
            expect(geo).toContain('"type":"Polygon"');
            expect(geo).toContain("[0,0]");
            expect(geo).toContain("[4,3]");
        });
    });

    describe("Equality & Status Checkers", () => {
        test("sameLocation should return true if same vertices in same order", () => {
            const copy = new Polygon([P0, P1, P2, P3]);
            expect(square.sameLocation(copy)).toBe(true);
        });
        test("sameLocation should return false if different vertex count", () => {
            expect(square.sameLocation(trianglePoly)).toBe(false);
        });
        test("sameLocation should return false if different vertices", () => {
            const other = new Polygon([P0, P1, P2, new Point(0, 4)]);
            expect(square.sameLocation(other)).toBe(false);
        });
        test("sameLocation should throw if not a Polygon", () => {
            expect(square.sameLocation.bind(undefined, {} as unknown as Polygon)).toThrow(TypeError);
        });
        test("equal should return true if same location and name", () => {
            const copy = new Polygon([P0, P1, P2, P3], "square");
            expect(square.equal(copy)).toBe(true);
        });
        test("equal should return false if different name", () => {
            const other = new Polygon([P0, P1, P2, P3], "other");
            expect(square.equal(other)).toBe(false);
        });
        test("clone should create a new Polygon with same coordinates", () => {
            const copy = square.clone();
            expect(copy.equal(square)).toBe(true);
            expect(copy === square).toBe(false);
        });
        test("rename should rename the Polygon", () => {
            const poly = square.clone();
            poly.rename("newName");
            expect(poly.name).toBe("newName");
        });
    });

    describe("Geometric Methods", () => {
        test("area should return correct area for a square", () => {
            expect(square.area()).toBe(12); // 4 x 3
        });
        test("area should return correct area for a triangle", () => {
            expect(trianglePoly.area()).toBeCloseTo(0.5, 5);
        });
        test("signedArea should be positive for CCW polygon", () => {
            const ccw = new Polygon([new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 1)]);
            expect(ccw.signedArea()).toBeGreaterThan(0);
        });
        test("signedArea should be negative for CW polygon", () => {
            const cw = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 0)]);
            expect(cw.signedArea()).toBeLessThan(0);
        });
        test("perimeter should return correct perimeter", () => {
            expect(square.perimeter()).toBe(14); // 4+3+4+3
        });
        test("centroid should return correct centroid for a square", () => {
            const centroid = square.centroid();
            expect(centroid.x).toBeCloseTo(2, 5);
            expect(centroid.y).toBeCloseTo(1.5, 5);
        });
        test("containsPoint should return true for interior point", () => {
            expect(square.containsPoint(new Point(2, 1))).toBe(true);
        });
        test("containsPoint should return true for point on edge", () => {
            expect(square.containsPoint(new Point(2, 0))).toBe(true);
        });
        test("containsPoint should return true for vertex", () => {
            expect(square.containsPoint(P0)).toBe(true);
        });
        test("containsPoint should return false for exterior point", () => {
            expect(square.containsPoint(new Point(5, 5))).toBe(false);
        });
        test("isConvex should return true for convex polygon", () => {
            expect(square.isConvex()).toBe(true);
            expect(trianglePoly.isConvex()).toBe(true);
        });
        test("isConvex should return false for concave polygon", () => {
            const concave = new Polygon([
                new Point(0, 0),
                new Point(4, 0),
                new Point(4, 4),
                new Point(2, 1), // dent inward
                new Point(0, 4),
            ]);
            expect(concave.isConvex()).toBe(false);
        });
        test("isSimple should return true for simple polygon", () => {
            expect(square.isSimple()).toBe(true);
        });
        test("isSimple should return false for self-intersecting polygon", () => {
            const bowtie = new Polygon([
                new Point(0, 0),
                new Point(2, 2),
                new Point(0, 2),
                new Point(2, 0),
            ]);
            expect(bowtie.isSimple()).toBe(false);
        });
        test("orientation should return 1 for CCW", () => {
            const ccw = new Polygon([new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 1)]);
            expect(ccw.orientation()).toBe(1);
        });
        test("orientation should return -1 for CW", () => {
            const cw = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 0)]);
            expect(cw.orientation()).toBe(-1);
        });
    });

    describe("Transformations", () => {
        test("translate shifts all vertices", () => {
            const shifted = square.translate(new Point(1, 2));
            expect(shifted.getVertex(0).isSameLocation(new Point(1, 2))).toBe(true);
            expect(shifted.getVertex(1).isSameLocation(new Point(5, 2))).toBe(true);
        });
        test("rotate revolves around origin", () => {
            const rotated = square.rotate(Angle.fromDegrees(90));
            expect(rotated.getVertex(0).isSameLocation(new Point(0, 0))).toBe(true);
            expect(rotated.getVertex(1).x).toBeCloseTo(0, 5);
            expect(rotated.getVertex(1).y).toBeCloseTo(4, 5);
        });
        test("rotateAround revolves around specific center", () => {
            const rotated = square.rotateAround(Angle.fromDegrees(90), new Point(2, 1.5));
            expect(rotated.getVertex(0).x).toBeCloseTo(3.5, 5);
            expect(rotated.getVertex(0).y).toBeCloseTo(-0.5, 5);
        });
        test("scale scales from origin", () => {
            const scaled = square.scale(2);
            expect(scaled.getVertex(1).isSameLocation(new Point(8, 0))).toBe(true);
            expect(scaled.getVertex(2).isSameLocation(new Point(8, 6))).toBe(true);
        });
        test("scaleAround scales from center point", () => {
            const scaled = square.scaleAround(2, new Point(2, 1.5));
            expect(scaled.getVertex(0).x).toBeCloseTo(-2, 5);
            expect(scaled.getVertex(0).y).toBeCloseTo(-1.5, 5);
        });
    });

    describe("GeometryDriver Implementation", () => {
        test("getArea should delegate to area()", () => {
            expect(square.getArea()).toBe(12);
        });
        test("getPerimeter should delegate to perimeter()", () => {
            expect(square.getPerimeter()).toBe(14);
        });
        test("getExtent should return the bounding box", () => {
            const extent = square.getExtent();
            expect(extent).toEqual([0, 0, 4, 3]);
        });
        test("accept delegates to renderPolygon on the visitor", () => {
            let passedPolygon: Polygon | null = null;
            let passedOpts: RenderOptions | null = null;
            let passedInvert: boolean = false;

            const mockRenderer: RenderDriver<string> = {
                renderPoint: () => "",
                renderLine: () => "",
                renderCircle: () => "",
                renderTriangle: () => "",
                renderPolygon: (polygon, opts, invert) => {
                    passedPolygon = polygon;
                    passedOpts = opts;
                    passedInvert = invert;
                    return "rendered-polygon";
                },
                compose: () => "",
            };

            const options: RenderOptions = {
                ...defaultOptions,
                stroke: "red",
            };
            const result = square.accept(mockRenderer, options, true);

            expect(result).toBe("rendered-polygon");
            expect(passedPolygon!).toBe(square);
            expect(passedOpts!).toBe(options);
            expect(passedInvert).toBe(true);
        });
    });
});
