import { Point } from "../src";
import Triangle, { coordinatesTriangleArray } from "../src/Triangle";

describe("Triangle module", () => {
  const PO = new Point(0, 0, "PO");
  const PObis = new Point(0, 0, "PObis");
  const P1 = new Point(1, 1, "P1");
  const P2 = new Point(1, 0, "P1");
  const T0 = new Triangle(PO, P1, P2, "T0");
  const point1 = new Point(-1, -Math.sqrt(3) / 3);
  const point2 = new Point(1, -Math.sqrt(3) / 3);
  const point3 = new Point(0, (2 * Math.sqrt(3)) / 3);
  const triangleEquilateral = new Triangle(point1, point2, point3);
  describe("Triangle constructor", () => {
    test("constructor with parameters should store points", () => {
      expect(T0.pA.isEqual(PO)).toBe(true);
      expect(T0.pB.isEqual(P1)).toBe(true);
      expect(T0.name).toBe("T0");
      expect(T0 instanceof Triangle).toBe(true);
    });
    test("constructor with same points location should throw an Error", () => {
      expect(() => new Triangle(PO, PObis, P2)).toThrow(RangeError);
    });
    test("constructor with pA same points location as pC should throw an Error", () => {
      expect(() => new Triangle(PO, P2, PObis)).toThrow(RangeError);
    });
    test("constructor with pB same points location as pC should throw an Error", () => {
      expect(() => new Triangle(P1, PO, PObis)).toThrow(RangeError);
    });
    test("constructor with colinear pA,pB and Pc throw an Error", () => {
      expect(
        () => new Triangle(new Point(0, 0), new Point(1, 1), new Point(2, 2)),
      ).toThrow(RangeError);
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
    test("pA setter should store a point", () => {
      const P2 = new Point(2, 4, "P2");
      T0.pA = P2;
      expect(T0.pA).toBe(P2);
    });
    test("pA setter should throw an Error if same location as pB ", () => {
      expect(() => {
        T0.pA = new Point(1, 1);
      }).toThrow(RangeError);
    });
    test("pA setter should throw an Error if same location as pC ", () => {
      expect(() => {
        T0.pA = new Point(1, 0);
      }).toThrow(RangeError);
    });
    test("pA setter should throw an Error if not a Point ", () => {
      expect(() => {
        T0.pA = {} as unknown as Point;
      }).toThrow(TypeError);
    });
    test("pB setter should store a point", () => {
      const P3 = new Point(0, 0, "P3");
      T0.pB = P3;
      expect(T0.pB).toBe(P3);
    });
    test("pB setter should throw an Error if same location as pA ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.pB = new Point(0, 0);
      }).toThrow(RangeError);
    });
    test("pB setter should throw an Error if same location as pC ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.pB = new Point(1, 0);
      }).toThrow(RangeError);
    });
    test("pB setter should throw an Error if not a Point ", () => {
      expect(() => {
        T0.pB = {} as unknown as Point;
      }).toThrow(TypeError);
    });
    test("pC setter should throw an Error if same location as pA ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.pC = new Point(0, 0);
      }).toThrow(RangeError);
    });
    test("pC setter should throw an Error if same location as pB ", () => {
      const T2 = new Triangle(PO, P1, P2, "T2");
      expect(() => {
        T2.pC = new Point(1, 1);
      }).toThrow(RangeError);
    });
    test("pC setter should throw an Error if not a Point ", () => {
      expect(() => {
        T0.pC = {} as unknown as Point;
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
    test("a getter should return the length of side a", () => {
      expect(triangleEquilateral.a).toBeCloseTo(2.0, 3);
    });
    test("b getter should return the length of side b", () => {
      expect(triangleEquilateral.b).toBeCloseTo(2.0, 3);
    });
    test("c getter should return the length of side c", () => {
      expect(triangleEquilateral.c).toBeCloseTo(2.0, 3);
    });
    test("aA getter should return the correct angle A", () => {
      expect(triangleEquilateral.aA.toDegrees()).toBeCloseTo(60, 3);
    });
    test("aB getter should return the correct angle B", () => {
      expect(triangleEquilateral.aB.toDegrees()).toBeCloseTo(60, 3);
    });
    test("aC getter should return the correct angle C in radians", () => {
      expect(triangleEquilateral.aC.toDegrees()).toBeCloseTo(60, 3);
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
    test("should have identical pA, pB and pC points", () => {
      expect(T2.pA.isSameLocation(T0.pA)).toBe(true);
      expect(T2.pB.isSameLocation(T0.pB)).toBe(true);
      expect(T2.pC.isSameLocation(T0.pC)).toBe(true);
    });
    test("should copy Points by value in the new Triangle", () => {
      T2.pA.moveTo(1.0, 1.0);
      expect(T2.pA.x).toBe(1.0);
      expect(T2.pA.y).toBe(1.0);
      expect(T2.pA.isEqual(T0.pA)).toBe(false);
      expect(T0.pA.x).toBe(0);
      expect(T0.pA.y).toBe(0);
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
      expect(T0.pA.x).toBe(0);
      expect(T0.pA.y).toBe(0);
      expect(T0.pB.x).toBe(1);
      expect(T0.pB.y).toBe(1);
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
      '{ "pA": {"x":0, "y":0}, "pB": {"x":1, "y":1}, "pC": {"x":1, "y":0}, "name": "T0" }',
    );
    test("should create a Triangle from a JSON object", () => {
      expect(T0.pA.x).toBe(0);
      expect(T0.pA.y).toBe(0);
      expect(T0.pB.x).toBe(1);
      expect(T0.pB.y).toBe(1);
      expect(T0.name).toBe("T0");
    });
    test("should throw an Error if JSON object is not valid", () => {
      expect(
        Triangle.fromJSON.bind(undefined, "{ pA-it-up: [0, 0], pB: [1, 1] }"),
      ).toThrow(TypeError);
    });
  });
  describe("Triangle.toJSON", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    const json = T0.toJSON();
    test("should create a JSON object from a Triangle", () => {
      expect(json).toContain('"pA":{"x":0,"y":0,"name":"PO"}');
      expect(json).toContain('"pB":{"x":1,"y":1,"name":"P1"}');
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
      expect(T1.pA === T0.pA).toBe(false);
      expect(T1.pB === T0.pB).toBe(false);
      expect(T1.pC === T0.pC).toBe(false);
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
    const PA = new Point(1, -2, "PA");
    const PB = new Point(-3, 4, "PB");
    const PC = new Point(2, 3, "PC");
    const T1 = new Triangle(PA, PB, PC, "T1");
    test("should return the correct area of the triangle", () => {
      expect(T1.area()).toBe(13);
    });
    const T3 = Triangle.fromArray([
      [3, 4],
      [4, 7],
      [6, -3],
    ]);
    test("should return the correct area of the triangle", () => {
      expect(T3.area()).toBe(8);
    });
  });
  describe("Triangle.perimeter", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    test("should return the perimeter of the triangle", () => {
      expect(T0.perimeter()).toBeCloseTo(3.414, 3);
    });
    const PA = new Point(1, -2, "PA");
    const PB = new Point(-3, 4, "PB");
    const PC = new Point(2, 3, "PC");
    const T1 = new Triangle(PA, PB, PC, "T1");
    test("should return the correct perimeter of the triangle", () => {
      expect(T1.perimeter()).toBeCloseTo(17.409, 3);
    });
    const T3 = Triangle.fromArray([
      [3, 4],
      [4, 7],
      [6, -3],
    ]);
    test("should return the correct perimeter of the triangle", () => {
      expect(T3.perimeter()).toBeCloseTo(20.976, 3);
    });
  });
  describe("Triangle.isEquilateral", () => {
    const T0 = new Triangle(PO, P1, P2, "T0");
    test("should return false if not an equilateral triangle", () => {
      expect(T0.isEquilateral()).toBe(false);
    });
    const PA = new Point(1, -2, "PA");
    const PB = new Point(-3, 4, "PB");
    const PC = new Point(2, 3, "PC");
    const T1 = new Triangle(PA, PB, PC, "T1");
    test("should return false if not an equilateral triangle", () => {
      expect(T1.isEquilateral()).toBe(false);
    });
    test("should return true if an equilateral triangle", () => {
      expect(triangleEquilateral.isEquilateral()).toBe(true);
    });
  });
  describe("Triangle.isValidTriangleSides", () => {
    test("should return true if valid sides", () => {
      expect(Triangle.isValidTriangleSides(3, 4, 5)).toBe(true);
      expect(Triangle.isValidTriangleSides(2, 2, 2)).toBe(true);
    });
    test("should return false if invalid sides", () => {
      expect(Triangle.isValidTriangleSides(1, 2, 3)).toBe(false);
    });
  });
});
