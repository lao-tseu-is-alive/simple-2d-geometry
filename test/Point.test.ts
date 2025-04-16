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
    test("constructor with parameters having x,y values like Infinity or NaN should throw a range error", () => {
      // Test cases with invalid inputs
      const invalidCoordinates = [
        { x: Infinity, y: 0 },
        { x: -Infinity, y: 0 },
        { x: NaN, y: 0 },
        { x: 0, y: Infinity },
        { x: 0, y: -Infinity },
        { x: 0, y: NaN },
        { x: Infinity, y: Infinity },
        { x: NaN, y: NaN },
      ];

      // Loop through invalid cases and assert that RangeError is thrown
      invalidCoordinates.forEach((coords) => {
        // Use expect().toThrow() to check for the specific error type
        // The code that should throw is wrapped in a function () => {...}
        expect(() => {
          new Point(coords.x, coords.y);
        }).toThrow(RangeError);

        // Optionally, you can also check the error message
        expect(() => {
          new Point(coords.x, coords.y);
        }).toThrow("Expected coordinates to be finite numbers");
      });
    });
    test("constructor with valid coordinates x,y should not throw range error", () => {
      expect(() => {
        new Point(1, 2);
      }).not.toThrow(); // Ensure no error is thrown for valid inputs
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
      expect(P0.isEqual(new Point(0, 0, "P0"))).toEqual(true);
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

  describe("Point.fromObject({x,y})", () => {
    const P1 = Point.fromObject({ x: 1.0, y: 2.0 });
    test("should give a Point(1,2) when given {x:1,y:2}", () => {
      expect(P1.x).toBe(1.0);
      expect(P1.y).toBe(2.0);
    });
    test("should throw an Error when parameter is not a valid Point", () => {
      expect(
        Point.fromObject.bind(undefined, {} as unknown as coordinate2dArray),
      ).toThrow(TypeError);
    });
    test("should throw an Error when parameter is not a valid Point", () => {
      expect(
        Point.fromObject.bind(
          undefined,
          undefined as unknown as coordinate2dArray,
        ),
      ).toThrow(TypeError);
    });
  });
  describe("Point.fromJSON()", () => {
    const P1 = Point.fromJSON('{ "x": 1.0, "y": 2.0 }');
    test("should give a Point(1,2) when given {x:1,y:2}", () => {
      expect(P1.x).toBe(1.0);
      expect(P1.y).toBe(2.0);
    });
    test("should throw an Error when parameter is not a valid Point", () => {
      expect(Point.fromJSON.bind(undefined, "")).toThrow(TypeError);
    });
    test("should throw an Error when parameter is not a valid Point", () => {
      expect(Point.fromJSON.bind(undefined, "2,4")).toThrow(TypeError);
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
    let P0 = new Point();
    const P0Clone = P0.clone();
    test("should give a Point(0,0) when given new Point()", () => {
      expect(P0Clone.isEqual(P0)).toEqual(true);
    });
    test("should copy x,y values in a new point without affecting original point", () => {
      P0Clone.x = 5.3;
      P0Clone.y = 2.1;
      P0Clone.name = "P0Clone";
      P0.name = "P0";
      expect(P0.x).toBe(0); // original point should not be affected
      expect(P0.y).toBe(0); // original point should not be affected
      expect(P0Clone.isEqual(P0)).toEqual(false);
      expect(P0Clone.x).toBe(5.3);
      expect(P0Clone.y).toBe(2.1);
      expect(P0Clone.name).toBe("P0Clone");
    });
    test("should still exist when original point is set to null", () => {
      Object.bind(P0, null);
      expect(P0Clone.x).toBe(5.3);
      expect(P0Clone.y).toBe(2.1);
      expect(P0Clone.name).toBe("P0Clone");
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

  describe("Point.magnitude()", () => {
    const P1 = new Point(3.0, 4.0, "P1");
    test("should return the distance from the origin", () => {
      expect(P1.magnitude()).toEqual(5.0);
    });
    test("should return zero when the point is at origin", () => {
      const P2 = new Point(0.0, 0.0, "P2");
      expect(P2.magnitude()).toEqual(0.0);
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

  describe("Point.distanceSquaredTo()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(4.0, 5.0, "P2");
    test("should return the squared distance between two points", () => {
      expect(P1.distanceSquaredTo(P2)).toEqual(25.0);
    });
    const P1bis = new Point(1.0, 1.0 - EPSILON / 10, "P1");
    test("should return zero when two points are equal within EPSILON", () => {
      expect(P1.distanceSquaredTo(P1bis)).toEqual(0);
    });
  });

  describe("Point.isSameLocation()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P1bis = new Point(1.0, 1.0 - EPSILON / 10, "P1");
    const P2 = new Point(4.0, 5.0, "P2");
    test("should return true when two points are equal within EPSILON", () => {
      expect(P1.isSameLocation(P1bis)).toEqual(true);
    });
    test("should return false when two points are not equal", () => {
      expect(P1.isSameLocation(P2)).toEqual(false);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.isSameLocation.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should throw an RangeError when the tolerance is negative", () => {
      expect(P1.isSameLocation.bind(undefined, P2, -1)).toThrow(RangeError);
    });
    test("should return false if other Point parameter is null", () => {
      expect(P1.isSameLocation(null)).toEqual(false);
    });
  });

  describe("Point.equal()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P1bis = new Point(1.0, 1.0, "P1");
    const P3 = new Point(1.0, 1.0, "P3");
    const P4 = new Point(2.0, 1, "P3");
    test("should return true when two points are equal", () => {
      expect(P1.isEqual(P1bis)).toEqual(true);
    });
    test("should return false when two points are not equal", () => {
      expect(P1.isEqual(P3)).toEqual(false);
    });
    test("should return false when two points have different names", () => {
      expect(P1.isEqual(P4)).toEqual(false);
    });
    test("should return false when two points have the same name but different coordinates", () => {
      expect(P3.isEqual(P4)).toEqual(false);
    });
    const P3bis = new Point(1.0, 1.0 - EPSILON / 10, "P3");
    test("should return true when two points are equal within EPSILON", () => {
      expect(P3.isEqual(P3bis)).toEqual(true);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.isEqual.bind(undefined, {} as Point)).toThrow(TypeError);
    });
  });

  describe("Point.rename()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should rename the point", () => {
      P1.rename("P2");
      expect(P1.name).toEqual("P2");
    });
  });
  describe("Point.angleTo()", () => {
    const P1 = new Point(0.0, 0.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    const P3 = new Point(0.0, 5.0, "P2");
    test("should return the angle between two points", () => {
      expect(P1.angleTo(P2).toDegrees()).toBeCloseTo(45);
    });
    test("should return the angle between two points", () => {
      expect(P1.angleTo(P3).toDegrees()).toBeCloseTo(90);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.angleTo.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should throw an RangeError when the parameter is at same location", () => {
      expect(P2.angleTo.bind(P2, new Point(5, 5))).toThrow(RangeError);
    });
  });
  describe("Point.slopeTo()", () => {
    const P1 = new Point(0.0, 0.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    const P3 = new Point(0.0, 5.0, "P2");
    test("should return the slope between two points", () => {
      expect(P1.slopeTo(P2)).toBeCloseTo(1);
    });
    test("should return the slope between two points", () => {
      expect(P1.slopeTo(P3)).toBeCloseTo(Infinity);
    });
    test("should return the correct slope between two points", () => {
      expect(new Point(-5, 10).slopeTo(new Point(-3, 4))).toBeCloseTo(-3);
    });
    test("should return the correct slope between two points", () => {
      expect(new Point(-5, -26).slopeTo(new Point(-2, -8))).toBeCloseTo(6);
    });

    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.slopeTo.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should throw an RangeError when the parameter is at same location", () => {
      expect(P1.slopeTo.bind(P1, P1)).toThrow(RangeError);
    });
  });
  describe("Point.add()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should add two points", () => {
      const P3 = P1.add(P2);
      expect(P3.x).toEqual(6.0);
      expect(P3.y).toEqual(6.0);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.add.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.add(new Point(0, 0));
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.subtract()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should subtract two points", () => {
      const P3 = P1.subtract(P2);
      expect(P3.x).toEqual(-4.0);
      expect(P3.y).toEqual(-4.0);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.subtract.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.subtract(new Point(0, 0));
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.multiply()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should multiply a point by a scalar", () => {
      const P3 = P1.multiply(5);
      expect(P3.x).toEqual(5.0);
      expect(P3.y).toEqual(5.0);
    });
    test("a parameter c value like Infinity or NaN should throw a type error", () => {
      // Test cases with invalid inputs
      const invalidValues = [Infinity, -Infinity, NaN];
      // Loop through invalid cases and assert that RangeError is thrown
      invalidValues.forEach((v) => {
        expect(P1.multiply.bind(undefined, v as number)).toThrow(TypeError);
      });
    });
    test("should throw an TypeError when the parameter is not a valid number", () => {
      expect(P1.multiply.bind(undefined, {} as number)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.multiply(1);
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.divide()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should divide a point by a scalar", () => {
      const P3 = P1.divide(5);
      expect(P3.x).toEqual(0.2);
      expect(P3.y).toEqual(0.2);
    });
    test("should throw an TypeError when the parameter is not a valid number", () => {
      expect(P1.divide.bind(undefined, {} as number)).toThrow(TypeError);
    });
    test("a parameter c value like Infinity or NaN should throw a type error", () => {
      // Test cases with invalid inputs
      const invalidValues = [Infinity, -Infinity, NaN];
      // Loop through invalid cases and assert that RangeError is thrown
      invalidValues.forEach((v) => {
        expect(P1.divide.bind(undefined, v as number)).toThrow(TypeError);
      });
    });
    test("should throw an RangeError when the parameter is zero", () => {
      expect(P1.divide.bind(undefined, 0)).toThrow(RangeError);
    });

    test("should return a clone of the point ", () => {
      const P3 = P1.divide(1);
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.dot()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should return the dot product of two points", () => {
      expect(P1.dot(P2)).toEqual(10);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.dot.bind(undefined, {} as Point)).toThrow(TypeError);
    });
  });
  describe("Point.cross()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should return the cross product of two points", () => {
      expect(P1.cross(P2)).toEqual(0);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.cross.bind(undefined, {} as Point)).toThrow(TypeError);
    });
  });
  describe("Point.rotate()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    test("should rotate a point by an angle", () => {
      const P3 = P1.rotate(new Angle(90, "degrees"));
      expect(P3.x).toBeCloseTo(-1);
      expect(P3.y).toBeCloseTo(1);
    });
    test("should throw an TypeError when the parameter is not a valid Angle", () => {
      expect(P1.rotate.bind(undefined, {} as Angle)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.rotate(new Angle(0, "degrees"));
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.rotateAround()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 2.0, "P2");
    test("should rotate a point by an angle at given center", () => {
      const P3 = P2.rotateAround(new Angle(90, "degrees"), P1);
      expect(P3.x).toBeCloseTo(0);
      expect(P3.y).toBeCloseTo(2);
    });
    test("should rotate a point by an angle at origin if center is (0,0)", () => {
      const P3 = P1.rotateAround(
        new Angle(90, "degrees"),
        Point.ORIGIN.clone(),
      );
      expect(P3.x).toBeCloseTo(-1);
      expect(P3.y).toBeCloseTo(1);
    });

    test("should throw an TypeError when the parameter is not a valid Angle", () => {
      expect(P1.rotateAround.bind(undefined, {} as Angle)).toThrow(TypeError);
    });
  });

  describe("Point.distanceToSegment()", () => {
    const P0 = new Point(0.0, 0.0, "P0");
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 3.0, "P2");
    test("should return the distance from a point to a line", () => {
      expect(P0.distanceToSegment(P1, P2)).toBeCloseTo(0.447214);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.distanceToSegment.bind(undefined, {} as Point, P2)).toThrow(
        TypeError,
      );
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.distanceToSegment.bind(undefined, P0, {} as Point)).toThrow(
        TypeError,
      );
    });
  });
  describe("Point.project()", () => {
    const P0 = new Point(0.0, 0.0, "P0");
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 3.0, "P2");
    test("should project a point on a line", () => {
      const P3 = P0.project(P2, P1);
      expect(P3.x).toBeCloseTo(0.4);
      expect(P3.y).toBeCloseTo(-0.2);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.project.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.project(P0, P2);
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.reflect()", () => {
    const P0 = new Point(0.0, 0.0, "P0");
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 3.0, "P2");
    test("should reflect a point on a line", () => {
      const P3 = P0.reflect(P2, P1);
      expect(P3.x).toBeCloseTo(0.8);
      expect(P3.y).toBeCloseTo(-0.4);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.reflect.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.reflect(P0, P2);
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.midPoint()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should return the midpoint of two points", () => {
      const P3 = P1.midPoint(P2);
      expect(P3.x).toEqual(3.0);
      expect(P3.y).toEqual(3.0);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.midPoint.bind(undefined, {} as Point)).toThrow(TypeError);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.midPoint(new Point(0, 0));
      expect(P3).not.toBe(P1);
    });
  });
  describe("Point.lessThan()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should return true when the point is less than the other", () => {
      expect(P1.lessThan(P2)).toEqual(true);
    });
    test("should return false when the point is greater than the other", () => {
      expect(P2.lessThan(P1)).toEqual(false);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.lessThan.bind(undefined, {} as Point)).toThrow(TypeError);
    });
  });
  describe("Point.greaterThan()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(1.0, 5.0, "P2");
    test("should return false when the point is less than the other", () => {
      expect(P1.greaterThan(P2)).toEqual(false);
    });
    test("should return true when the point is greater than the other", () => {
      expect(P2.greaterThan(P1)).toEqual(true);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.greaterThan.bind(undefined, {} as Point)).toThrow(TypeError);
    });
  });
  describe("Point.lessThanOrEqual()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(5.0, 5.0, "P2");
    test("should return true when the point is less than the other", () => {
      expect(P1.lessThanOrEqual(P2)).toEqual(true);
    });
    test("should return false when the point is greater than the other", () => {
      expect(P2.lessThanOrEqual(P1)).toEqual(false);
    });
    test("should return true when the point is equal to the other", () => {
      expect(P1.lessThanOrEqual(P1)).toEqual(true);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.lessThanOrEqual.bind(undefined, {} as Point)).toThrow(
        TypeError,
      );
    });
  });
  describe("Point.greaterThanOrEqual()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(1.0, 5.0, "P2");
    test("should return false when the point is less than the other", () => {
      expect(P1.greaterThanOrEqual(P2)).toEqual(false);
    });
    test("should return true when the point is greater than the other", () => {
      expect(P2.greaterThanOrEqual(P1)).toEqual(true);
    });
    test("should return true when the point is equal to the other", () => {
      expect(P1.greaterThanOrEqual(P1)).toEqual(true);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.greaterThanOrEqual.bind(undefined, {} as Point)).toThrow(
        TypeError,
      );
    });
  });
  describe("Point.isInsideCircle()", () => {
    const P0 = new Point(0.0, 0.0, "P0");
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 3.0, "P2");
    test("should return true when the point is inside the circle", () => {
      expect(P1.isInsideCircle(P0, 2)).toEqual(true);
    });
    test("should return false when the point is outside the circle", () => {
      expect(P2.isInsideCircle(P0, 2)).toEqual(false);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.isInsideCircle.bind(undefined, {} as Point, 2)).toThrow(
        TypeError,
      );
    });
    test("should throw an TypeError when the radius is not a valid number", () => {
      expect(P1.isInsideCircle.bind(P1, P0, {} as number)).toThrow(TypeError);
    });
    test("should throw an RangeError when the radius is negative", () => {
      expect(P1.isInsideCircle.bind(P1, P0, -2)).toThrow(RangeError);
    });
  });
  describe("Point.isInsideRectangle()", () => {
    const P0 = new Point(0.0, 0.0, "P0");
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 3.0, "P2");
    test("should return true when the point is inside the rectangle", () => {
      expect(P1.isInsideRectangle(P0, P2)).toEqual(true);
    });
    test("should return false when the point is outside the rectangle", () => {
      expect(P2.isInsideRectangle(P0, P1)).toEqual(false);
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.isInsideRectangle.bind(undefined, {} as Point, P2)).toThrow(
        TypeError,
      );
    });
    test("should throw an TypeError when the parameter is not a valid Point", () => {
      expect(P1.isInsideRectangle.bind(P1, {} as Point)).toThrow(TypeError);
    });
  });
  describe("Point.normalize()", () => {
    const P1 = new Point(1.0, 1.0, "P1");
    const P2 = new Point(2.0, 3.0, "P2");
    test("should normalize the point", () => {
      const P3 = P1.normalize();
      expect(P3.x).toBeCloseTo(0.707107);
      expect(P3.y).toBeCloseTo(0.707107);
      const P4 = P2.normalize();
      expect(P4.x).toBeCloseTo(0.5547);
      expect(P4.y).toBeCloseTo(0.8321);
    });
    test("should return the origin (0,0) if the magnitude is zero (or very close to it).", () => {
      const P3 = new Point(0.0, 0.0, "P3");
      const P4 = P3.normalize();
      expect(P4.x).toBeCloseTo(0.0);
      expect(P4.y).toBeCloseTo(0.0);
    });
    test("should return a clone of the point ", () => {
      const P3 = P1.normalize();
      expect(P3).not.toBe(P1);
    });
  });
});

describe("Point.perpendicular()", () => {
  const P0 = new Point(0.0, 0.0, "P0");
  const P1 = new Point(2.0, 2.0, "P1");
  const perpendicularLength = 5.0;
  const P2 = Point.fromPolar(
    perpendicularLength,
    new Angle(135, "degrees"),
    "P2",
  ).moveTo(P1.x, P1.y);
  test("should return a point perpendicular ", () => {
    const P4 = P0.perpendicular(P1, perpendicularLength);
    expect(P4.x).toBeCloseTo(P2.x);
    expect(P4.y).toBeCloseTo(P2.y);
  });
});

describe("Point.linearInterpolate()", () => {
  const P0 = new Point(0.0, 0.0, "P0");
  const P2 = new Point(2.0, 2.0, "P2");
  const pointInterpolated = P0.linearInterpolate(P2, 0.5);
  expect(pointInterpolated.x).toBeCloseTo(1.0);
  expect(pointInterpolated.y).toBeCloseTo(1.0);
});
