import { describe, test, expect } from "bun:test";
import { Point } from "../packages/geom-2d-core";
import { Line } from "../packages/geom-2d-core";
import { Circle } from "../packages/geom-2d-core";
import { Triangle } from "../packages/geom-2d-core";
import { Feature } from "../packages/geom-2d-drawing";
import { DrawingBoard } from "../packages/geom-2d-drawing";
import { SVGRenderDriver } from "../packages/geom-2d-drawing";

describe("DrawingBoard", () => {
  const renderer = new SVGRenderDriver();

  describe("add / remove / clear", () => {
    test("add() appends features", () => {
      const board = new DrawingBoard(renderer);
      const f1 = new Feature(new Point(0, 0));
      const f2 = new Feature(new Point(1, 1));
      board.add(f1).add(f2);
      expect(board.features.length).toBe(2);
    });

    test("remove() removes by reference", () => {
      const board = new DrawingBoard(renderer);
      const f1 = new Feature(new Point(0, 0));
      const f2 = new Feature(new Point(1, 1));
      board.add(f1).add(f2);
      board.remove(f1);
      expect(board.features.length).toBe(1);
      expect(board.features[0]).toBe(f2);
    });

    test("remove() is a no-op for unknown feature", () => {
      const board = new DrawingBoard(renderer);
      const f1 = new Feature(new Point(0, 0));
      const f2 = new Feature(new Point(1, 1));
      board.add(f1);
      board.remove(f2);
      expect(board.features.length).toBe(1);
    });

    test("clear() removes all features", () => {
      const board = new DrawingBoard(renderer);
      board.add(new Feature(new Point(0, 0)));
      board.add(new Feature(new Point(1, 1)));
      board.clear();
      expect(board.features.length).toBe(0);
    });

    test("methods are chainable", () => {
      const board = new DrawingBoard(renderer);
      const f = new Feature(new Point(0, 0));
      const result = board.add(f).remove(f).clear();
      expect(result).toBe(board);
    });
  });

  describe("getGlobalExtent()", () => {
    test("returns [0,0,0,0] for empty board", () => {
      const board = new DrawingBoard(renderer);
      expect(board.getGlobalExtent()).toEqual([0, 0, 0, 0]);
    });

    test("returns extent of a single feature", () => {
      const board = new DrawingBoard(renderer);
      board.add(new Feature(new Circle(new Point(5, 5), 3)));
      expect(board.getGlobalExtent()).toEqual([2, 2, 8, 8]);
    });

    test("returns union extent of multiple features", () => {
      const board = new DrawingBoard(renderer);
      board.add(new Feature(new Point(0, 0)));
      board.add(new Feature(new Point(10, 20)));
      board.add(new Feature(new Circle(new Point(5, 5), 2)));
      // Union: min(0,10,3)=0, min(0,20,3)=0, max(0,10,7)=10, max(0,20,7)=20
      expect(board.getGlobalExtent()).toEqual([0, 0, 10, 20]);
    });

    test("ignores invisible features", () => {
      const board = new DrawingBoard(renderer);
      const visible = new Feature(new Point(0, 0));
      const hidden = new Feature(new Point(100, 100), { isVisible: false });
      board.add(visible).add(hidden);
      expect(board.getGlobalExtent()).toEqual([0, 0, 0, 0]);
    });

    test("returns [0,0,0,0] when all features are invisible", () => {
      const board = new DrawingBoard(renderer);
      board.add(new Feature(new Point(5, 5), { isVisible: false }));
      expect(board.getGlobalExtent()).toEqual([0, 0, 0, 0]);
    });
  });

  describe("render()", () => {
    test("produces well-formed SVG", () => {
      const board = new DrawingBoard(renderer, { padding: 5 });
      board.add(new Feature(new Circle(new Point(10, 10), 5), {
        stroke: "#ff0000",
        fill: "blue",
      }));
      const svg = board.render();
      expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain("viewBox=");
      expect(svg).toContain("</svg>");
      expect(svg).toContain('<circle');
      expect(svg).toContain('stroke="#ff0000"');
      expect(svg).toContain('fill="blue"');
    });

    test("applies default invertY=true", () => {
      const board = new DrawingBoard(renderer, { padding: 0 });
      board.add(new Feature(new Point(5, 10)));
      const svg = board.render();
      // With invertY, point cy should be -10
      expect(svg).toContain('cy="-10"');
    });

    test("respects invertY=false option", () => {
      const board = new DrawingBoard(renderer, { padding: 0, invertY: false });
      board.add(new Feature(new Point(5, 10)));
      const svg = board.render();
      expect(svg).toContain('cy="10"');
    });

    test("sorts features by zIndex", () => {
      const board = new DrawingBoard(renderer, { padding: 0 });
      const behind = new Feature(new Point(1, 1), { zIndex: 0, stroke: "#aaa" });
      const inFront = new Feature(new Point(2, 2), { zIndex: 10, stroke: "#bbb" });
      // Add in reverse order
      board.add(inFront).add(behind);
      const svg = board.render();
      const aPos = svg.indexOf('#aaa');
      const bPos = svg.indexOf('#bbb');
      // #aaa (zIndex 0) should appear before #bbb (zIndex 10)
      expect(aPos).toBeLessThan(bPos);
    });

    test("skips invisible features in output", () => {
      const board = new DrawingBoard(renderer, { padding: 0 });
      board.add(new Feature(new Point(1, 1), { stroke: "#visible" }));
      board.add(new Feature(new Point(2, 2), { stroke: "#hidden", isVisible: false }));
      const svg = board.render();
      expect(svg).toContain("#visible");
      expect(svg).not.toContain("#hidden");
    });

    test("renders empty board without error", () => {
      const board = new DrawingBoard(renderer);
      const svg = board.render();
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
    });

    test("includes width/height when provided", () => {
      const board = new DrawingBoard(renderer, { width: 800, height: 600 });
      board.add(new Feature(new Point(0, 0)));
      const svg = board.render();
      expect(svg).toContain('width="800"');
      expect(svg).toContain('height="600"');
    });

    test("renders mixed geometry types", () => {
      const board = new DrawingBoard(renderer, { padding: 0 });
      board.add(new Feature(new Point(0, 0)));
      board.add(new Feature(new Line(new Point(0, 0), new Point(5, 5))));
      board.add(new Feature(new Circle(new Point(3, 3), 2)));
      board.add(new Feature(new Triangle(
        new Point(0, 0),
        new Point(4, 0),
        new Point(2, 3),
      )));
      const svg = board.render();
      // Should contain all four geometry types
      const circleCount = (svg.match(/<circle/g) || []).length;
      expect(circleCount).toBe(2); // Point marker + Circle
      expect(svg).toContain("<line");
      expect(svg).toContain("<polygon");
    });
  });
});
