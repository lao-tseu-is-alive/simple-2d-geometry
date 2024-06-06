import { Point } from "../src";
import Triangle, { coordinatesTriangleArray } from "../src/Triangle";

describe("Triangle module", () => {
  const PO = new Point(0, 0, "PO");
  const PObis = new Point(0, 0, "PObis");
  const P1 = new Point(1, 1, "P1");
  const P2 = new Point(1, 0, "P1");
  const T0 = new Triangle(PO, P1, P2, "T0");
  describe("Triangle constructor", () => {
    test("constructor with parameters should store points", () => {
      expect(T0.p1.equal(PO)).toBe(true);
      expect(T0.p2.equal(P1)).toBe(true);
      expect(T0.name).toBe("T0");
      expect(T0 instanceof Triangle).toBe(true);
    });
    test("constructor with same points location should throw an Error", () => {
      expect(() => new Triangle(PO, PObis, P2)).toThrow(RangeError);
    });
    test("constructor with p1 same points location as p3 should throw an Error", () => {
      expect(() => new Triangle(PO, P2, PObis)).toThrow(RangeError);
    });
    test("constructor with invalid points should throw an Error", () => {
      expect(
        () =>
          new Triangle(
            {} as unknown as Point,
            {} as unknown as Point,
            {} as unknown as Point,
          ),
      ).toThrow(TypeError);
    });
  });
  describe("Triangle setters", () => {
    test("p1 setter should store a point", () => {
      const P2 = new Point(2, 4, "P2");
      T0.p1 = P2;
      expect(T0.p1).toBe(P2);
    });
    test("p1 setter should throw an Error if same location as p2 ", () => {
      expect(() => {
        T0.p1 = new Point(1, 1);
      }).toThrow(RangeError);
    });
    test("p1 setter should throw an Error if same location as p3 ", () => {
      expect(() => {
        T0.p1 = new Point(1, 0);
      }).toThrow(RangeError);
    });
    test("p1 setter should throw an Error if not a Point ", () => {
      expect(() => {
        T0.p1 = {} as unknown as Point;
      }).toThrow(TypeError);
    });
    test("p2 setter should store a point", () => {
      const P3 = new Point(0, 0, "P3");
      T0.p2 = P3;
      expect(T0.p2).toBe(P3);
    });
    test("p2 setter should throw an Error if same location as p1 ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.p2 = new Point(0, 0);
      }).toThrow(RangeError);
    });
    test("p2 setter should throw an Error if same location as p3 ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.p2 = new Point(1, 0);
      }).toThrow(RangeError);
    });
    test("p2 setter should throw an Error if not a Point ", () => {
      expect(() => {
        T0.p2 = {} as unknown as Point;
      }).toThrow(TypeError);
    });
    test("p3 setter should throw an Error if same location as p1 ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.p3 = new Point(0, 0);
      }).toThrow(RangeError);
    });
    test("p3 setter should throw an Error if same location as p2 ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.p3 = new Point(1, 1);
      }).toThrow(RangeError);
    });
    test("p3 setter should throw an Error if not a Point ", () => {
      expect(() => {
        T0.p3 = {} as unknown as Point;
      }).toThrow(TypeError);
    });
    test("name setter should store a string", () => {
      T0.name = "T1";
      expect(T0.name).toBe("T1");
    });
    test("name getter should store an empty string if undefined", () => {
      const T1 = new Triangle(PO, P1, P2);
      expect(T1.name).toBe("");
    });
  });
  describe("Triangle.fromTriangle(otherTriangle)", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    const T2 = Triangle.fromTriangle(T0);
    test("should throw an Error when parameter is not a valid Triangle", () => {
      expect(
        Triangle.fromTriangle.bind(undefined, [] as unknown as Triangle),
      ).toThrow(TypeError);
    });
    test("should have identical p1, p2 and p3 points", () => {
      expect(T2.p1.sameLocation(T0.p1)).toBe(true);
      expect(T2.p2.sameLocation(T0.p2)).toBe(true);
      expect(T2.p3.sameLocation(T0.p3)).toBe(true);
    });
    test("should copy Points by value in the new Triangle", () => {
      T2.p1.moveTo(1.0, 1.0);
      expect(T2.p1.x).toBe(1.0);
      expect(T2.p1.y).toBe(1.0);
      expect(T2.p1.equal(T0.p1)).toBe(false);
      expect(T0.p1.x).toBe(0);
      expect(T0.p1.y).toBe(0);
      expect(PO.x).toBe(0);
      expect(PO.y).toBe(0);
    });
  });
  describe("Triangle.fromArray", () => {
    const T0 = Triangle.fromArray([
      [0, 0],
      [1, 1],
      [1, 0],
    ]);
    test("should create a Triangle from an array", () => {
      expect(T0.p1.x).toBe(0);
      expect(T0.p1.y).toBe(0);
      expect(T0.p2.x).toBe(1);
      expect(T0.p2.y).toBe(1);
      expect(T0.name).toBe("");
    });
    test("should throw an Error if array is not valid", () => {
      expect(
        //prettier-ignore
        Triangle.fromArray.bind(undefined, [0, 0, 1, 1] as unknown as coordinatesTriangleArray),
      ).toThrow(TypeError);
    });
  });
  describe("Triangle.fromJSON", () => {
    const T0 = Triangle.fromJSON(
      '{ "p1": {"x":0, "y":0}, "p2": {"x":1, "y":1}, "p3": {"x":1, "y":0}, "name": "T0" }',
    );
    test("should create a Triangle from a JSON object", () => {
      expect(T0.p1.x).toBe(0);
      expect(T0.p1.y).toBe(0);
      expect(T0.p2.x).toBe(1);
      expect(T0.p2.y).toBe(1);
      expect(T0.name).toBe("T0");
    });
    test("should throw an Error if JSON object is not valid", () => {
      expect(
        Triangle.fromJSON.bind(undefined, "{ p1-it-up: [0, 0], p2: [1, 1] }"),
      ).toThrow(TypeError);
    });
  });
  describe("Triangle.toJSON", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    const json = T0.toJSON();
    test("should create a JSON object from a Triangle", () => {
      expect(json).toContain('"p1":{"x":0,"y":0,"name":"PO"}');
      expect(json).toContain('"p2":{"x":1,"y":1,"name":"P1"}');
      expect(json).toContain('"name":"T0"}');
    });
  });
  describe("Triangle.toString", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    test("should create a string from a Triangle", () => {
      expect(T0.toString()).toBe("T0:((0,0),(1,1))");
    });
    test("should create a correct string from a Triangle with delimiter", () => {
      expect(T0.toString(";", false)).toBe("T0:0;0;1;1");
    });
  });
  describe("Triangle.clone", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    const T1 = T0.clone();
    test("should create a new Triangle that is a copy of itself", () => {
      expect(T1.equal(T0)).toBe(true);
    });
    test("should have different references", () => {
      expect(T1 === T0).toBe(false);
    });
    test("should have different references for points", () => {
      expect(T1.p1 === T0.p1).toBe(false);
      expect(T1.p2 === T0.p2).toBe(false);
      expect(T1.p3 === T0.p3).toBe(false);
    });
  });
  describe("Triangle.sameLocation", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    const T1 = new Triangle(new Point(0, 0), P1, P2, "T1");
    const T2 = new Triangle(PO, new Point(3, 5), P2, "T2");
    test("should return true if same location", () => {
      expect(T0.sameLocation(T1)).toBe(true);
    });
    test("should return false if different location", () => {
      expect(T0.sameLocation(T2)).toBe(false);
    });
    test("should throw an Error if parameter is not a Triangle", () => {
      expect(
        T0.sameLocation.bind(undefined, {} as unknown as Triangle),
      ).toThrow(TypeError);
    });
  });
  describe("Triangle.equal", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    const T1 = new Triangle(new Point(0, 0), P1, P2, "T0");
    const T2 = new Triangle(PO, new Point(4, 6), P2, "T2");
    const T3 = new Triangle(PO, P1, P2, "T3");
    test("should return true if same location", () => {
      expect(T0.equal(T1)).toBe(true);
    });
    test("should return false if different location", () => {
      expect(T0.equal(T2)).toBe(false);
    });
    test("should return false if different name", () => {
      expect(T0.equal(T3)).toBe(false);
    });
    test("should throw an Error if parameter is not a Triangle", () => {
      expect(T0.equal.bind(undefined, {} as unknown as Triangle)).toThrow(
        TypeError,
      );
    });
  });
  describe("Triangle.rename", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    T0.rename("T1");
    test("should rename the Triangle", () => {
      expect(T0.name).toBe("T1");
    });
  });
  describe("Triangle.area", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    test("should return the area of the triangle", () => {
      expect(T0.area()).toBe(0.5);
    });
  });
});
