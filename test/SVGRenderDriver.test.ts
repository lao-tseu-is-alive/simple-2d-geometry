import { describe, test, expect } from "bun:test";
import Point from "../src/Point";
import Line from "../src/Line";
import Circle from "../src/Circle";
import Triangle from "../src/Triangle";
import SVGRenderDriver from "../src/SVGRenderDriver";
import type { RenderOptions } from "../src/RenderDriver";

const defaultOptions: RenderOptions = {
  stroke: "#000000",
  strokeWidth: 1,
  fill: "none",
  opacity: 1.0,
  pointRadius: 3,
};

describe("SVGRenderDriver", () => {
  const renderer = new SVGRenderDriver();

  describe("renderPoint", () => {
    const p = new Point(10, 20);

    test("renders a circle marker without Y-inversion", () => {
      const svg = renderer.renderPoint(p, defaultOptions, false);
      expect(svg).toContain('cx="10"');
      expect(svg).toContain('cy="20"');
      expect(svg).toContain('r="3"');
      expect(svg).toContain('stroke="#000000"');
      expect(svg).toContain('fill="none"');
    });

    test("negates Y when invertY is true", () => {
      const svg = renderer.renderPoint(p, defaultOptions, true);
      expect(svg).toContain('cx="10"');
      expect(svg).toContain('cy="-20"');
    });

    test("uses configurable pointRadius", () => {
      const opts = { ...defaultOptions, pointRadius: 5 };
      const svg = renderer.renderPoint(p, opts, false);
      expect(svg).toContain('r="5"');
    });
  });

  describe("renderLine", () => {
    const l = new Line(new Point(1, 2), new Point(3, 4));

    test("renders a line element without Y-inversion", () => {
      const svg = renderer.renderLine(l, defaultOptions, false);
      expect(svg).toContain('x1="1"');
      expect(svg).toContain('y1="2"');
      expect(svg).toContain('x2="3"');
      expect(svg).toContain('y2="4"');
    });

    test("negates Y when invertY is true", () => {
      const svg = renderer.renderLine(l, defaultOptions, true);
      expect(svg).toContain('y1="-2"');
      expect(svg).toContain('y2="-4"');
    });
  });

  describe("renderCircle", () => {
    const c = new Circle(new Point(5, 10), 7);

    test("renders a circle element with correct radius", () => {
      const svg = renderer.renderCircle(c, defaultOptions, false);
      expect(svg).toContain('cx="5"');
      expect(svg).toContain('cy="10"');
      expect(svg).toContain('r="7"');
    });

    test("negates Y when invertY is true", () => {
      const svg = renderer.renderCircle(c, defaultOptions, true);
      expect(svg).toContain('cy="-10"');
      expect(svg).toContain('r="7"'); // radius is NOT negated
    });
  });

  describe("renderTriangle", () => {
    const t = new Triangle(
      new Point(0, 0),
      new Point(3, 0),
      new Point(0, 4),
    );

    test("renders a polygon element", () => {
      const svg = renderer.renderTriangle(t, defaultOptions, false);
      expect(svg).toContain("<polygon");
      expect(svg).toContain('points="0,0 3,0 0,4"');
    });

    test("negates Y when invertY is true", () => {
      const svg = renderer.renderTriangle(t, defaultOptions, true);
      expect(svg).toContain('points="0,0 3,0 0,-4"');
    });
  });

  describe("accept() double dispatch", () => {
    test("Point.accept calls renderPoint", () => {
      const p = new Point(1, 2);
      const svg = p.accept(renderer, defaultOptions, false);
      expect(svg).toContain('cx="1"');
      expect(svg).toContain('cy="2"');
    });

    test("Line.accept calls renderLine", () => {
      const l = new Line(new Point(0, 0), new Point(5, 5));
      const svg = l.accept(renderer, defaultOptions, false);
      expect(svg).toContain("<line");
    });

    test("Circle.accept calls renderCircle", () => {
      const c = new Circle(new Point(0, 0), 10);
      const svg = c.accept(renderer, defaultOptions, false);
      expect(svg).toContain('r="10"');
    });

    test("Triangle.accept calls renderTriangle", () => {
      const t = new Triangle(
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),
      );
      const svg = t.accept(renderer, defaultOptions, false);
      expect(svg).toContain("<polygon");
    });
  });

  describe("compose", () => {
    test("wraps elements in <svg> with computed viewBox", () => {
      const elements = ['<circle cx="5" cy="5" r="3"/>', '<line x1="0" y1="0" x2="10" y2="10"/>'];
      const svg = renderer.compose(elements, [0, 0, 10, 10], {
        invertY: false,
        padding: 5,
      });
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('viewBox="-5 -5 20 20"');
      expect(svg).toContain('<circle cx="5" cy="5" r="3"/>');
      expect(svg).toContain('<line x1="0" y1="0" x2="10" y2="10"/>');
    });

    test("adjusts viewBox for invertY", () => {
      const svg = renderer.compose([], [0, 0, 10, 20], {
        invertY: true,
        padding: 0,
      });
      // invertY: vbMinY = -maxY = -20, vbHeight = maxY - minY = 20
      expect(svg).toContain('viewBox="0 -20 10 20"');
    });

    test("includes width and height attributes when provided", () => {
      const svg = renderer.compose([], [0, 0, 10, 10], {
        invertY: false,
        padding: 0,
        width: 800,
        height: 600,
      });
      expect(svg).toContain('width="800"');
      expect(svg).toContain('height="600"');
    });

    test("omits width and height when not provided", () => {
      const svg = renderer.compose([], [0, 0, 10, 10], {
        invertY: false,
        padding: 0,
      });
      expect(svg).not.toContain("width=");
      expect(svg).not.toContain("height=");
    });
  });
});
