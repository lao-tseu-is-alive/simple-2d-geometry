//import {expect, test, describe} from "jest";
import Point from "../src/Point";
const P0 = new Point()
describe('Point module', () => {
  describe('Point constructor', () => {
    test("'constructor with default parameters should should have x = y = 0'", () => {
      expect(P0.x).toBe(0);
      expect(P0.y).toBe(0);
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
})
