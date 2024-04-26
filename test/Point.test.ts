//import {expect, test, describe} from "jest";
import Point, {coordinate2dArray} from "../src/Point";
import Angle from "../src/Angle";
const P0 = new Point()
describe('Point module', () => {
  describe('Point constructor', () => {
    test("'constructor with default parameters should should have x = y = 0'", () => {
      expect(P0.x).toBe(0);
      expect(P0.y).toBe(0);
      expect(P0.name).toBe('');
    });
    test("'constructor with default parameters should should have name = ''", () => {
      expect(P0.name).toBe('');
    });
    test("'constructor with parameters should have x = 1.0, y = 2.0, name = 'P1'", () => {
      const P1 = new Point(1.0, 2.0, 'P1')
      expect(P1.x).toBe(1.0);
      expect(P1.y).toBe(2.0);
      expect(P1.name).toBe('P1');
    });
  })
  describe('Point x,y accessors ', () => {
    const P1 = new Point(1.0, 2.0, 'P1')
    test('should allow changing x to 3.0 and give back x value', () => {
      P1.x = 3.0
      expect(P1).toHaveProperty('x', 3.0)
    })
    test('should allow changing y to 4.0 give back y value', () => {
      P1.y = 4.0
      expect(P1).toHaveProperty('y', 4.0)
    })
    const P2 = new Point()
    P2.x = "4.0"
    P2.y = "8.0"
    test('should allow to set x from string "4.0" representing a number value', () => {
      expect(P2).toHaveProperty('x', 4.0)
    })
    test('should allow to set y  from string "8.0" representing a number value', () => {
      expect(P2).toHaveProperty('y', 8.0)
    })
  })

  describe('Point refuses wrong values for x and y', () => {
    const badX = 'l25' // this is not a numeric value
    const badY = 'one'
    test('should throw an Error if invalid point x coordinate is given ', () => {
      expect(function () {
        const PointWithXWrong = new Point()
        PointWithXWrong.x = badX
      }).toThrow(`Invalid number format for input: '${badX}'`)
    })
    test('should throw an Error if invalid point y coordinate is given ', () => {
      expect(function () {
        const PointWithYWrong = new Point()
        PointWithYWrong.y = badY
      }).toThrow(`Invalid number format for input: '${badY}'`)
    })
  })

  describe('Point.fromPolar(radius, theta)', () => {
    const myAngle = new Angle(90, "degrees")
    test('should throw an Error when no parameters are passed', () => {
      expect(Point.fromPolar.bind(undefined, 4)).toThrow(TypeError)
    })
    test('should give a Point(0,0) when radius=0', () => {
      const P0 = Point.fromPolar(0, myAngle, 'P0')
      expect(P0.x).toBe(0);
      expect(P0.y).toBe(0);
      expect(P0.equal(new Point(0,0,'P0'))).toEqual(true)
    })
    test('should give a Point(0,5) when radius=5 and theta=Pi/2 radians',
        () => {
          const P1 = Point.fromPolar(5, myAngle, 'P0')
          expect(P1.x).toBe(0);
          expect(P1.y).toBe(5);
          expect(P1.equal(new Point(0, 5))).toEqual(true)
        }
    )
    test('should give a Point(-5,0) when radius=5 and theta=Pi/2 radians',
        () => {
          const P1 = Point.fromPolar(5, new Angle(180, "degrees"), 'P1')
          expect(P1.x).toBe(-5);
          expect(P1.y).toBe(0);
          expect(P1.equal(new Point(-5, 0))).toEqual(true)
        }
    )
  })

  describe('Point.fromPoint(otherPoint)', () => {
    let P0 = Point.fromPoint(new Point())
    const P1 = Point.fromPoint(P0)

    test('should throw an Error when parameter is not a valid Point', () => {
      expect(Point.fromPoint.bind(undefined, {} as Point)).toThrow(TypeError)
    })
    test('should give a Point(0,0) when given new Point()', () => {
      expect(P1.equal(P0)).toEqual(true)
    })
    test('should copy x,y values in a new point without affecting original point', () => {
      P1.x = 5.3
      P1.y = 2.1
      P1.name = 'P1'
      expect(P0.x).toBe(0)  // original point should not be affected
      expect(P0.y).toBe(0)  // original point should not be affected
      expect(P1.equal(P0)).toEqual(false)
      expect(P1.x).toBe(5.3)
      expect(P1.y).toBe(2.1)
      expect(P1.name).toBe('P1')
    })
    test('should still exist when original point is set to null', () => {
      Object.bind(P0, null)
      expect(P1.x).toBe(5.3)
      expect(P1.y).toBe(2.1)
      expect(P1.name).toBe('P1')
    })
  })

  describe('Point.fromArray([x,y])', () => {
    const P1 = Point.fromArray([1.0, 2.0])
    test('should give a Point(1,2) when given [1,2]', () => {
      expect(P1.x).toBe(1.0);
      expect(P1.y).toBe(2.0);
    })
    test('should throw an Error when parameter is not a valid Point', () => {
      expect(Point.fromArray.bind(undefined, [] as unknown as coordinate2dArray)).toThrow(TypeError)
    })
    test('should throw an Error when parameter is not a valid Point', () => {
      expect(Point.fromArray.bind(undefined, undefined as unknown as coordinate2dArray)).toThrow(TypeError)
    })
  })

  describe('Point.clone()', () => {
    const P1 = new Point(1.0, 2.0, 'P1')
    const P2 = P1.clone()
    test('should give a Point(1,2) when given [1,2]', () => {
      expect(P2.x).toBe(1.0);
      expect(P2.y).toBe(2.0);
      expect(P2.name).toBe('P1');
    })
    test('should give a new Point object', () => {
      expect(P2).not.toBe(P1);
    })
  })

  describe('Point.dump()', () => {
    const P1 = new Point(1.0, 2.0, 'P1')
    test('should give a Point(1,2) when given [1,2]', () => {
      expect(P1.dump()).toEqual(`Point[P1](1, 2)`)
    })
    const P2 = new Point()
    test('should give a Point(0,0) when no name is given', () => {
      expect(P2.dump()).toEqual(`Point[](0, 0)`)
    })
  })

  describe('Point.toArray()', () => {
    const P1 = new Point(1.0, 2.0, 'P1')
    test('should give a [1,2] when given Point(1,2)', () => {
      expect(P1.toArray()).toEqual([1.0, 2.0])
    })
  })

  describe('Point can be exported to OGC WKT and GeoJSON', () => {
    const P1 = new Point(1.0, 2.0, 'P1')
    test('toWKT should return a correct OGC Well-known text (WKT) representation',() => {
          expect(P1.toWKT()).toEqual(`POINT(${P1.x} ${P1.y})`)
        })
    test('toEWKT should return a correct Postgis Extended Well-known text (EWKT) representation',() => {
          const srid = 2056
          expect(P1.toEWKT()).toEqual(`SRID=${srid};POINT(${P1.x} ${P1.y})`
          )}
    )
    test('toGeoJSON should return a correct GeoJSON (http://geojson.org/) representation',() => {
          expect(P1.toGeoJSON()).toEqual(`{"type":"Point","coordinates":[${P1.x},${P1.y}]}`)
        })
  })




  describe('Point.toString()', () => {
    const P1 = new Point(1.0, 2.0, 'P1')
    test('should return a correct string representation', () => {
      expect(P1.toString()).toEqual(`(${1.0}, ${2.0})`)
    })
    test('should return a string  without parenthesis when surroundingParenthesis is false', () => {
      expect(P1.toString(',', false)).toEqual(`${1.0}, ${2.0}`)
    })
  })

})
