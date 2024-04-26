//import {expect, test, describe} from "jest";
import Angle from "../src/Angle";
const A0 = new Angle(0)
describe('Angle module', () => {
  describe('Angle constructor', () => {
    test('constructor with default parameters should should have angle = 0', () => {
      expect(A0.toDegrees()).toBe(0);
      expect(A0.toRadians()).toBe(0);
      expect(A0.type).toBe('degrees');
      expect(A0.angle).toBe(0);
    });
    test('constructor with 90 degrees should work', () => {
      const A1 = new Angle(90, "degrees")
      expect(A1.toDegrees()).toBe(90);
      expect(A1.toRadians()).toBe(Math.PI/2);
      expect(A1.type).toBe('degrees');
      expect(A1.angle).toBe(90);
    });
    test("constructor with radians and PI/2 should return 90 deg", () => {
      const A1 = new Angle(Math.PI/2, "radians")
      expect(A1.toDegrees()).toBe(90);
      expect(A1.toRadians()).toBe(Math.PI/2);
      expect(A1.type).toBe('radians');
      expect(A1.angle).toBe(Math.PI/2);
    });
  })

  describe('Angle normalization', () => {
    const A1 = Angle.fromDegrees(450)
    const A2 = new Angle(-450, 'degrees')
    test('angle 450 degrees should be normalized to 90 degrees', () => {
      expect(A1.toDegrees()).toBe(90);
      expect(A1.toRadians()).toBe(Math.PI/2);
      expect(A1.type).toBe('degrees');
      expect(A1.angle).toBe(90);
    });
    test('angle -450 degrees should be normalized to 270 degrees', () => {
      expect(A2.toDegrees()).toBe(270);
      expect(A2.toRadians()).toBe(3*Math.PI/2);
      expect(A2.type).toBe('degrees');
      expect(A2.angle).toBe(270);
    });
  })
  describe('Angle.fromRadians', () => {
    const A1 = Angle.fromRadians(Math.PI/2)
    test('angle PI/2 radians should be normalized to 90 degrees', () => {
      expect(A1.toDegrees()).toBe(90);
      expect(A1.toRadians()).toBe(Math.PI/2);
      expect(A1.type).toBe('radians');
      expect(A1.angle).toBe(Math.PI/2);
    });
    const A2 = Angle.fromRadians(0)
    test('angle 0 radians should be normalized to 0 degrees', () => {
      expect(A2.toDegrees()).toBe(0);
      expect(A2.toRadians()).toBe(0);
      expect(A2.type).toBe('radians');
      expect(A2.angle).toBe(0);
    });
  })

  describe('Angle.fromDegrees', () => {
    const A1 = Angle.fromDegrees(90)
    test('from 90 degrees should work', () => {
      expect(A1.toDegrees()).toBe(90);
      expect(A1.toRadians()).toBe(Math.PI/2);
      expect(A1.type).toBe('degrees');
      expect(A1.angle).toBe(90);
    });
    const A2 = Angle.fromDegrees(0)
    test('from 0 degrees should work', () => {
      expect(A2.toDegrees()).toBe(0);
      expect(A2.toRadians()).toBe(0);
      expect(A2.type).toBe('degrees');
      expect(A2.angle).toBe(0);
    });
  })

  describe('Angle setters', () => {
    const A1 = new Angle(0)
    A1.angle = 450
    test('setting angle to 450 degrees should be normalized to 90 degrees', () => {
      expect(A1.toDegrees()).toBe(90);
      expect(A1.toRadians()).toBe(Math.PI/2);
      expect(A1.type).toBe('degrees');
      expect(A1.angle).toBe(90);
    });
    const A2 = new Angle(Math.PI, 'radians')
    A2.angle = 3*Math.PI
    test('setting angle to 3PI radians should be normalized to PI radians', () => {
      expect(A2.toDegrees()).toBe(180);
      expect(A2.toRadians()).toBe(Math.PI);
      expect(A2.type).toBe('radians');
      expect(A2.angle).toBe(Math.PI);
    });
  })

})
