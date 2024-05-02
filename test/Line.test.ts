import { Point } from "../src";
import Line, { coordinatesLineArray } from "../src/Line";

describe("Line module", () => {
  const PO = new Point(0, 0, "PO");
  const PObis = new Point(0, 0, "PObis");
  const P1 = new Point(1, 1, "P1");
  const L0 = new Line(PO, P1, "L0");
  describe("Line constructor", () => {
    test("constructor with parameters should store points", () => {
      expect(L0.start.equal(PO)).toBe(true);
      expect(L0.end.equal(P1)).toBe(true);
      expect(L0.name).toBe("L0");
      expect(L0 instanceof Line).toBe(true);
    });
    test("constructor with same points location should throw an Error", () => {
      expect(() => new Line(PO, PObis)).toThrow(RangeError);
    });
  });
  describe("Line setters", () => {
    test("start setter should store a point", () => {
      const P2 = new Point(2, 4, "P2");
      L0.start = P2;
      expect(L0.start).toBe(P2);
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
      expect(L0.end).toBe(P3);
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
  });
  describe("Line.fromLine(otherLine)", () => {
    const L0 = new Line(PO, P1, "L0");
    const L2 = Line.fromLine(L0);
    test("should throw an Error when parameter is not a valid Line", () => {
      expect(Line.fromLine.bind(undefined, [] as unknown as Line)).toThrow(
        TypeError,
      );
    });
    test("should have identical start and end points", () => {
      expect(L2.start.sameLocation(L0.start)).toBe(true);
      expect(L2.end.sameLocation(L0.end)).toBe(true);
    });
    test("should copy Points by value in the new Line", () => {
      L2.start.moveTo(1.0, 1.0);
      expect(L2.start.x).toBe(1.0);
      expect(L2.start.y).toBe(1.0);
      expect(L2.start.equal(L0.start)).toBe(false);
      expect(L0.start.x).toBe(0);
      expect(L0.start.y).toBe(0);
      expect(PO.x).toBe(0);
      expect(PO.y).toBe(0);
    });
  });
  describe("Line.fromArray", () => {
    const L0 = Line.fromArray([
      [0, 0],
      [1, 1],
    ]);
    test("should create a Line from an array", () => {
      expect(L0.start.x).toBe(0);
      expect(L0.start.y).toBe(0);
      expect(L0.end.x).toBe(1);
      expect(L0.end.y).toBe(1);
      expect(L0.name).toBe("");
    });
    test("should throw an Error if array is not valid", () => {
      expect(
        //prettier-ignore
        Line.fromArray.bind(undefined, [0, 0, 1, 1] as unknown as coordinatesLineArray),
      ).toThrow(TypeError);
    });
  });
  describe("Line.fromJSON", () => {
    const L0 = Line.fromJSON(
      '{ "start": {"x":0, "y":0}, "end": {"x":1, "y":1}, "name": "L0" }',
    );
    test("should create a Line from a JSON object", () => {
      expect(L0.start.x).toBe(0);
      expect(L0.start.y).toBe(0);
      expect(L0.end.x).toBe(1);
      expect(L0.end.y).toBe(1);
      expect(L0.name).toBe("L0");
    });
    test("should throw an Error if JSON object is not valid", () => {
      expect(
        Line.fromJSON.bind(undefined, "{ start-it-up: [0, 0], end: [1, 1] }"),
      ).toThrow(TypeError);
    });
  });
  describe("Line.toJSON", () => {
    const L0 = new Line(PO, P1, "L0");
    const json = L0.toJSON();
    test("should create a JSON object from a Line", () => {
      expect(json).toContain('"start":{"x":0,"y":0,"name":"PO"}');
      expect(json).toContain('"end":{"x":1,"y":1,"name":"P1"}');
      expect(json).toContain('"name":"L0"}');
    });
  });
  describe("Line.toString", () => {
    const L0 = new Line(PO, P1, "L0");
    test("should create a string from a Line", () => {
      expect(L0.toString()).toBe("L0:((0,0),(1,1))");
    });
  });
});