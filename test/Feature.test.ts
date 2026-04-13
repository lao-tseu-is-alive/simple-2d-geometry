import { describe, test, expect } from "bun:test";
import Point from "../src/Point";
import Circle from "../src/Circle";
import Feature from "../src/Feature";
import SVGRenderDriver from "../src/SVGRenderDriver";

describe("Feature", () => {
  const renderer = new SVGRenderDriver();

  describe("constructor defaults", () => {
    const feature = new Feature(new Circle(new Point(0, 0), 5));

    test("stroke defaults to #000000", () => {
      expect(feature.stroke).toBe("#000000");
    });

    test("strokeWidth defaults to 1", () => {
      expect(feature.strokeWidth).toBe(1);
    });

    test("fill defaults to none", () => {
      expect(feature.fill).toBe("none");
    });

    test("opacity defaults to 1.0", () => {
      expect(feature.opacity).toBe(1.0);
    });

    test("pointRadius defaults to 3", () => {
      expect(feature.pointRadius).toBe(3);
    });

    test("isVisible defaults to true", () => {
      expect(feature.isVisible).toBe(true);
    });

    test("zIndex defaults to 0", () => {
      expect(feature.zIndex).toBe(0);
    });
  });

  describe("constructor with custom options", () => {
    const feature = new Feature(new Point(1, 1), {
      stroke: "#ff0000",
      strokeWidth: 3,
      fill: "blue",
      opacity: 0.5,
      pointRadius: 8,
      isVisible: false,
      zIndex: 10,
    });

    test("applies custom stroke", () => {
      expect(feature.stroke).toBe("#ff0000");
    });

    test("applies custom strokeWidth", () => {
      expect(feature.strokeWidth).toBe(3);
    });

    test("applies custom fill", () => {
      expect(feature.fill).toBe("blue");
    });

    test("applies custom opacity", () => {
      expect(feature.opacity).toBe(0.5);
    });

    test("applies custom pointRadius", () => {
      expect(feature.pointRadius).toBe(8);
    });

    test("applies custom isVisible", () => {
      expect(feature.isVisible).toBe(false);
    });

    test("applies custom zIndex", () => {
      expect(feature.zIndex).toBe(10);
    });
  });

  describe("visual state mutation", () => {
    const feature = new Feature(new Point(0, 0));

    test("stroke can be changed", () => {
      feature.stroke = "#00ff00";
      expect(feature.stroke).toBe("#00ff00");
    });

    test("fill can be changed", () => {
      feature.fill = "red";
      expect(feature.fill).toBe("red");
    });

    test("opacity can be changed", () => {
      feature.opacity = 0.3;
      expect(feature.opacity).toBe(0.3);
    });

    test("zIndex can be changed", () => {
      feature.zIndex = 5;
      expect(feature.zIndex).toBe(5);
    });
  });

  describe("delegated math methods", () => {
    const circle = new Circle(new Point(5, 5), 3);
    const feature = new Feature(circle);

    test("getArea() delegates to geometry", () => {
      expect(feature.getArea()).toBeCloseTo(Math.PI * 9, 9);
    });

    test("getPerimeter() delegates to geometry", () => {
      expect(feature.getPerimeter()).toBeCloseTo(2 * Math.PI * 3, 9);
    });

    test("getExtent() delegates to geometry", () => {
      expect(feature.getExtent()).toEqual([2, 2, 8, 8]);
    });
  });

  describe("geometry accessor", () => {
    const point = new Point(7, 8, "origin");
    const feature = new Feature(point);

    test("exposes the underlying geometry", () => {
      expect(feature.geometry).toBe(point);
    });

    test("geometry is the exact same reference", () => {
      expect(feature.geometry.x).toBe(7);
      expect(feature.geometry.y).toBe(8);
    });
  });

  describe("render()", () => {
    test("renders via double dispatch with visual state", () => {
      const feature = new Feature(new Point(10, 20), {
        stroke: "#ff0000",
        strokeWidth: 2,
        fill: "blue",
        opacity: 0.7,
        pointRadius: 5,
      });
      const svg = feature.render(renderer, true);
      expect(svg).toContain('cx="10"');
      expect(svg).toContain('cy="-20"');
      expect(svg).toContain('r="5"');
      expect(svg).toContain('stroke="#ff0000"');
      expect(svg).toContain('stroke-width="2"');
      expect(svg).toContain('fill="blue"');
      expect(svg).toContain('opacity="0.7"');
    });

    test("renders Circle geometry correctly", () => {
      const feature = new Feature(new Circle(new Point(0, 0), 10));
      const svg = feature.render(renderer, false);
      expect(svg).toContain('r="10"');
      expect(svg).toContain("<circle");
    });

    test("passes invertY=false correctly", () => {
      const feature = new Feature(new Point(5, 15));
      const svg = feature.render(renderer, false);
      expect(svg).toContain('cy="15"');
    });
  });
});
