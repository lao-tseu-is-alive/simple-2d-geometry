//import {expect, test, describe} from "jest";
import Point from "../src/Point";
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
        PointWithYWrong.x = badY
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
    test(
        'should give a Point(0,5) when radius=5 and theta=Pi/2 radians',
        () => {
          const P1 = Point.fromPolar(5, myAngle, 'P0')
          expect(P1.x).toBe(0);
          expect(P1.y).toBe(5);
          expect(P1.equal(new Point(0, 5))).toEqual(true)
        }
    )
  })

})
