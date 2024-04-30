import {Point} from "../src";
import Line from "../src/Line";

describe('Line module', () => {
  describe('Line constructor', () => {
    const PO =new Point(0,0, 'PO');
    const P1 =new Point(0,0, 'P1');
    const L0 = new Line(PO, P1, 'L0');
    test('constructor with parameters should store points', () => {
      expect(L0.start).toBe(PO);
      expect(L0.end).toBe(P1);
      expect(L0.name).toBe('L0');
    });
  });
})
