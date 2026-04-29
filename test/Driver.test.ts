import { describe, test, expect } from "bun:test";
import { Point } from "../packages/geom-2d-core";
import { Line } from "../packages/geom-2d-core";
import { Circle } from "../packages/geom-2d-core";
import { Triangle } from "../packages/geom-2d-core";
import type { GeometryDriver } from "../packages/geom-2d-core";

describe("GeometryDriver interface", () => {
  describe("Point as GeometryDriver", () => {
    const p = new Point(3, 4, "P");

    test("getArea() returns 0", () => {
      expect(p.getArea()).toBe(0);
    });

    test("getPerimeter() returns 0", () => {
      expect(p.getPerimeter()).toBe(0);
    });

    test("getExtent() returns degenerate bbox", () => {
      expect(p.getExtent()).toEqual([3, 4, 3, 4]);
    });

    test("satisfies GeometryDriver structurally", () => {
      const driver: GeometryDriver = p;
      expect(driver.getArea()).toBe(0);
    });
  });

  describe("Line as GeometryDriver", () => {
    const l = new Line(new Point(1, 2), new Point(4, 6), "L");

    test("getArea() returns 0", () => {
      expect(l.getArea()).toBe(0);
    });

    test("getPerimeter() returns segment length", () => {
      // distance = sqrt((4-1)^2 + (6-2)^2) = sqrt(9+16) = 5
      expect(l.getPerimeter()).toBeCloseTo(5, 9);
    });

    test("getExtent() returns correct bbox", () => {
      expect(l.getExtent()).toEqual([1, 2, 4, 6]);
    });

    test("getExtent() handles reversed coordinates", () => {
      const l2 = new Line(new Point(5, 8), new Point(2, 3));
      expect(l2.getExtent()).toEqual([2, 3, 5, 8]);
    });
  });

  describe("Circle as GeometryDriver", () => {
    const c = new Circle(new Point(5, 5), 3, "C");

    test("getArea() returns π*r²", () => {
      expect(c.getArea()).toBeCloseTo(Math.PI * 9, 9);
    });

    test("getPerimeter() returns 2πr (circumference)", () => {
      expect(c.getPerimeter()).toBeCloseTo(2 * Math.PI * 3, 9);
    });

    test("getExtent() returns bbox from center ± radius", () => {
      expect(c.getExtent()).toEqual([2, 2, 8, 8]);
    });
  });

  describe("Triangle as GeometryDriver", () => {
    // Right triangle: (0,0), (3,0), (0,4) — area = 6, perimeter = 12
    const t = new Triangle(
      new Point(0, 0),
      new Point(3, 0),
      new Point(0, 4),
      "T"
    );

    test("getArea() returns correct area", () => {
      expect(t.getArea()).toBeCloseTo(6, 9);
    });

    test("getPerimeter() returns correct perimeter", () => {
      // sides: 3, 4, 5 → perimeter = 12
      expect(t.getPerimeter()).toBeCloseTo(12, 9);
    });

    test("getExtent() returns correct bbox", () => {
      expect(t.getExtent()).toEqual([0, 0, 3, 4]);
    });

    test("getExtent() handles negative coordinates", () => {
      const t2 = new Triangle(
        new Point(-2, -3),
        new Point(4, 1),
        new Point(1, 5),
      );
      expect(t2.getExtent()).toEqual([-2, -3, 4, 5]);
    });
  });
});
