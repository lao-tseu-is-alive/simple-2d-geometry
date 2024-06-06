import Point, { coordinate2dArray } from "../src/Point";
import Angle from "../src/Angle";
import { EPSILON } from "../src";
const P0 = new Point();
describe("Point module", () => {
  describe("Point constructor", () => {
    test("'constructor with default parameters should should have x = y = 0'", () => {
      expect(P0.x).toBe(0);
      expect(P0.y).toBe(0);
      expect(P0.name).toBe("");
    });
    test("'constructor with default parameters should should have name = ''", () => {
      expect(P0.name).toBe("");
    });
    test("'constructor with parameters should have isValid = true'", () => {
      expect(P0.isValid).toBe(true);
    });
    test("'constructor with parameters should have x = 1.0, y = 2.0, name = 'P1'", () => {
      const P1 = new Point(1.0, 2.0, "P1");
      expect(P1.x).toBe(1.0);
      expect(P1.y).toBe(2.0);
      expect(P1.name).toBe("P1");
    });
  });
  describe("Point x,y accessors ", () => {
    const P1 = new Point(1.0, 2.0, "P1");
    test("should allow changing x to 3.0 and give back x value", () => {
      P1.x = 3.0;
      expect(P1).toHaveProperty("x", 3.0);
    });
    test("should allow changing y to 4.0 give back y value", () => {
      P1.y = 4.0;
      expect(P1).toHaveProperty("y", 4.0);
    });
    const P2 = new Point();
    P2.x = "4.0";
    P2.y = "8.0";
    test('should allow to set x from string "4.0" representing a number value', () => {
      expect(P2).toHaveProperty("x", 4.0);
    });
    test('should allow to set y  from string "8.0" representing a number value', () => {
      expect(P2).toHaveProperty("y", 8.0);
    });
  });

  describe("Point refuses wrong values for x and y", () => {
    const badX = "l25"; // this is not a numeric value
    const badY = "one";
    test("should throw an Error if invalid point x coordinate is given ", () => {
      expect(function () {
        const PointWithXWrong = new Point();
        PointWithXWrong.x = badX;
      }).toThrow(`Invalid number format for input: '${badX}'`);
    });
    test("should throw an Error if invalid point y coordinate is given ", () => {
      expect(function () {
        const PointWithYWrong = new Point();
        PointWithYWrong.y = badY;
      }).toThrow(`Invalid number format for input: '${badY}'`);
    });
  });

  describe("Point.fromPolar(radius, theta)", () => {
    const myAngle = new Angle(90, "degrees");
    test("should throw an Error when no parameters are passed", () => {
      expect(Point.fromPolar.bind(undefined, 4)).toThrow(TypeError);
    });
    test("should give a Point(0,0) when radius=0", () => {
      const P0 = Point.fromPolar(0, myAngle, "P0");
      expect(P0.x).toBe(0);
      expect(P0.y).toBe(0);
      expect(P0.equal(new Point(0, 0, "P0"))).toEqual(true);
    });
    test("should give a Point(0,5) when radius=5 and theta=Pi/2 radians", () => {
      const P1 = Point.fromPolar(5, myAngle, "P0");
      expect(P1.x).toBe(0);
      expect(P1.y).toBe(5);
      expect(P1.name).toBe("P0");
    });
    test("should give a Point(-5,0) when radius=5 and theta=Pi/2 radians", () => {
      const P1 = Point.fromPolar(5, new Angle(180, "degrees"), "P1");
      expect(P1.x).toBe(-5);
      expect(P1.y).toBe(0);
      expect(P1.name).toBe("P1");
    });
    test("should throw an TypeError when radius is not a valid number", () => {
      expect(Point.fromPolar.bind(undefined, [] as unknown as number)).toThrow(
        TypeError,
      );
    });
  });

  describe("Point.fromPoint(otherPoint)", () => {
    let P0 = Point.fromPoint(new Point());
    const P1 = Point.fromPoint(P0);

    test("should throw an Error when parameter is not a valid Point", () => {
      expect(Point.fromPoint.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should give a Point(0,0) when given new Point()", () => {
      expect(P1.equal(P0)).toEqual(true);
    });
    test("should copy x,y values in a new point without affecting original point", () => {
      P1.x = 5.3;
      P1.y = 2.1;
      P1.name = "P1";
      expect(P0.x).toBe(0); // original point should not be affected
      expect(P0.y).toBe(0); // original point should not be affected
      expect(P1.equal(P0)).toEqual(false);
      expect(P1.x).toBe(5.3);
      expect(P1.y).toBe(2.1);
      expect(P1.name).toBe("P1");
    });
    test("should still exist when original point is set to null", () => {
      Object.bind(P0, null);
      expect(P1.x).toBe(5.3);
      expect(P1.y).toBe(2.1);
      expect(P1.name).toBe("P1");
    });
  });

  describe("Point.fromArray([x,y])", () => {
    const P1 = Point.fromArray([1.0, 2.0]);
    test("should give a Point(1,2) when given [1,2]", () => {
      expect(P1.x).toBe(1.0);
      expect(P1.y).toBe(2.0);
    });
    test("should throw an Error when parameter is not a valid Point", () => {
      expect(
        Point.fromArray.bind(undefined, [] as unknown as coordinate2dArray),
      ).toThrow(TypeError);
    });
    test("should throw an Error when parameter is not a valid Point", () => {
      expect(
        Point.fromArray.bind(
          undefined,
          undefined as unknown as coordinate2dArray,
        ),
      ).toThrow(TypeError);
    });
  });

  describe("Point.clone()", () => {
    const P1 = new Point(1.0, 2.0, "P1");
    const P2 = P1.clone();
    test("should give a Point(1,2) when given [1,2]", () => {
      expect(P2.x).toBe(1.0);
      expect(P2.y).toBe(2.0);
      expect(P2.name).toBe("P1");
    });
    test("should give a new Point object", () => {
      expect(P2).not.toBe(P1);
    });
  });

  describe("Point.dump()", () => {
    const P1 = new Point(1.0, 2.0, "P1");
    test("should give a Point(1,2) when given [1,2]", () => {
      expect(P1.dump()).toEqual(`Point[P1](1, 2)`);
    });
    const P2 = new Point();
    test("should give a Point(0,0) when no name is given", () => {
      expect(P2.dump()).toEqual(`Point[](0, 0)`);
    });
  });

  describe("Point.toArray()", () => {
    const P1 = new Point(1.0, 2.0, "P1");
    test("should give a [1,2] when given Point(1,2)", () => {
      expect(P1.toArray()).toEqual([1.0, 2.0]);
    });
  });

  describe("Point can be exported to OGC WKT and GeoJSON", () => {
    const P1 = new Point(1.0, 2.0, "P1");
    test("toWKT should return a correct OGC Well-known text (WKT) representation", () => {
      expect(P1.toWKT()).toEqual(`POINT(${P1.x} ${P1.y})`);
    });
    test("toEWKT should return a correct Postgis Extended Well-known text (EWKT) representation", () => {
      const srid = 2056;
      expect(P1.toEWKT()).toEqual(`SRID=${srid};POINT(${P1.x} ${P1.y})`);
    });
    test("toGeoJSON should return a correct GeoJSON (https://geojson.org/) representation", () => {
      expect(P1.toGeoJSON()).toEqual(
        `{"type":"Point","coordinates":[${P1.x},${P1.y}]}`,
      );
    });
  });

  describe("Point.toString()", () => {
    const P1 = new Point(1.0, 2.0, "P1");
    test("should return a correct string representation", () => {
      expect(P1.toString()).toEqual(`(${1.0},${2.0})`);
    });
    test("should return a string  without parenthesis when surroundingParenthesis is false", () => {
      expect(P1.toString(",", false)).toEqual(`${1.0},${2.0}`);
    });
  });

  describe("Point.getDistanceFromOrigin()", () => {
    const P1 = new Point(3.0, 4.0, "P1");
    test("should return the distance from the origin", () => {
      expect(P1.getDistanceFromOrigin()).toEqual(5.0);
    });
    test("should return zero when the point is at origin", () => {
      const P2 = new Point(0.0, 0.0, "P2");
      expect(P2.getDistanceFromOrigin()).toEqual(0.0);
    });
  });

  describe("Point.getAngleRad()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should return the angle from the origin", () => {
      expect(P1.getAngleRad()).toBeCloseTo(Math.PI / 4);
    });
    test("should return zero when the point is at origin", () => {
      const P2 = new Point(0.0, 0.0, "P2");
      expect(P2.getAngleRad()).toEqual(0.0);
    });
  });

  describe("Point.getAngleDeg()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should return the angle from the origin", () => {
      expect(P1.getAngleDeg()).toBeCloseTo(45);
    });
    test("should return zero when the point is at origin", () => {
      const P2 = new Point(0.0, 0.0, "P2");
      expect(P2.getAngleDeg()).toEqual(0.0);
    });
  });

  describe("Point.moveToArray()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should move the point to a new position", () => {
      P1.moveToArray([2.0, 3.0]);
      expect(P1.x).toEqual(2.0);
      expect(P1.y).toEqual(3.0);
    });
    test("should throw an Error when the array is not valid", () => {
      expect(
        P1.moveToArray.bind(undefined, [] as unknown as coordinate2dArray),
      ).toThrow(TypeError);
    });
  });

  describe("Point.moveTo()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should move the point to a new position", () => {
      P1.moveTo(2.0, 3.0);
      expect(P1.x).toEqual(2.0);
      expect(P1.y).toEqual(3.0);
    });
  });

  describe("Point.moveRel()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should move the point to a new position relative to old", () => {
      P1.moveRel(2.0, 3.0);
      expect(P1.x).toEqual(3.0);
      expect(P1.y).toEqual(4.0);
    });
  });

  describe("Point.moveRelArray()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should move the point to a new position relative to old", () => {
      P1.moveRelArray([2.0, 3.0]);
      expect(P1.x).toEqual(3.0);
      expect(P1.y).toEqual(4.0);
    });
    test("should throw an Error when the array is not valid", () => {
      expect(
        P1.moveRelArray.bind(undefined, [] as unknown as coordinate2dArray),
      ).toThrow(TypeError);
    });
  });

  describe("Point.moveRelPolar()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should move the point to a new position relative to old", () => {
      P1.moveRelPolar(2.0, new Angle(45, "degrees"));
      expect(P1.x).toBeCloseTo(2.41);
      expect(P1.y).toBeCloseTo(2.41);
    });
    const P0 = new Point(0, 0, "P0");
    test("should move the point to a new position relative to old", () => {
      P0.moveRelPolar(2.0, new Angle(45, "degrees"));
      expect(P0.x).toBeCloseTo(1.41);
      expect(P0.y).toBeCloseTo(1.41);
    });
  });

  describe("Point.copyRelArray()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should copy the point to a new position relative to old", () => {
      const P2 = P1.copyRelArray([2.0, 3.0]);
      expect(P2.x).toEqual(3.0);
      expect(P2.y).toEqual(4.0);
      expect(P2.name).toEqual("P1");
      expect(P2).not.toBe(P1);
    });
    test("should throw an Error when the array is not valid", () => {
      expect(
        P1.copyRelArray.bind(undefined, [] as unknown as coordinate2dArray),
      ).toThrow(TypeError);
    });
  });

  describe("Point.copyRel()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should copy the point to a new position relative to old", () => {
      const P2 = P1.copyRel(2.0, 3.0);
      expect(P2.x).toEqual(3.0);
      expect(P2.y).toEqual(4.0);
      expect(P2.name).toEqual("P1");
      expect(P2).not.toBe(P1);
    });
    test("should throw an TypeError when parameter is not a number", () => {
      expect(P1.copyRel.bind(undefined, [] as unknown as number)).toThrow(
        TypeError,
      );
    });
  });

  describe("Point.copyRelPolar()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should copy the point to a new position relative to old", () => {
      const P2 = P1.copyRelPolar(2.0, new Angle(45, "degrees"));
      expect(P2.x).toBeCloseTo(2.41);
      expect(P2.y).toBeCloseTo(2.41);
      expect(P2.name).toEqual("P1");
      expect(P2).not.toBe(P1);
    });
  });

  describe("Point.distanceTo()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(4.0, 5.0, "P2");
    test("should return the distance between two points", () => {
      expect(P1.distanceTo(P2)).toEqual(5.0);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.distanceTo.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    const P1bis = new Point(1.0, 1.0 - EPSILON / 10, "P1");
    test("should return zero when two points are equal within EPSILON", () => {
      expect(P1.distanceTo(P1bis)).toEqual(0);
    });
  });

  describe("Point.equal()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P1bis = new Point(1.0, 1.0, "P1");
    const P3 = new Point(1.0, 1.0, "P3");
    const P4 = new Point(2.0, 1, "P3");
    test("should return true when two points are equal", () => {
      expect(P1.equal(P1bis)).toEqual(true);
    });
    test("should return false when two points are not equal", () => {
      expect(P1.equal(P3)).toEqual(false);
    });
    test("should return false when two points have different names", () => {
      expect(P1.equal(P4)).toEqual(false);
    });
    test("should return false when two points have the same name but different coordinates", () => {
      expect(P3.equal(P4)).toEqual(false);
    });
    const P3bis = new Point(1.0, 1.0 - EPSILON / 10, "P3");
    test("should return true when two points are equal within EPSILON", () => {
      expect(P3.equal(P3bis)).toEqual(true);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.equal.bind(undefined, {} as Point)).toThrow(TypeError);
    });
  });

  describe("Point.rename()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should rename the point", () => {
      P1.rename("P2");
      expect(P1.name).toEqual("P2");
    });
  });
});
