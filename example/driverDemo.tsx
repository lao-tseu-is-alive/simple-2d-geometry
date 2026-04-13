import Point from "../src/Point.ts";
import Line from "../src/Line.ts";
import Circle from "../src/Circle.ts";
import Triangle from "../src/Triangle.ts";
import Feature from "../src/Feature.ts";
import DrawingBoard from "../src/DrawingBoard.ts";
import SVGRenderDriver from "../src/SVGRenderDriver.ts";

/**
 * RenderDriver Pattern demo — DrawingBoard + Feature + SVGRenderDriver
 * Generates SVG entirely from code using the Driver Pattern
 */
export function setupDriverDemo(element: HTMLDivElement) {
  const renderer = new SVGRenderDriver();

  function buildScene() {
    const board = new DrawingBoard(renderer, {
      padding: 15,
      invertY: true,
      width: 500,
      height: 500,
    });

    // ── Coordinate axes ───────────────────────────────────────
    const xAxis = new Feature(new Line(new Point(-80, 0), new Point(80, 0)), {
      stroke: "rgba(255,255,255,0.4)",
      strokeWidth: 1,
      zIndex: 0,
    });
    const yAxis = new Feature(new Line(new Point(0, -80), new Point(0, 80)), {
      stroke: "rgba(255,255,255,0.4)",
      strokeWidth: 1,
      zIndex: 0,
    });
    board.add(xAxis).add(yAxis);

    // ── Triangle (background) ─────────────────────────────────
    const triangle = new Feature(
      new Triangle(
        new Point(-40, -30),
        new Point(60, -20),
        new Point(10, 50),
      ),
      {
        stroke: "#e74c3c",
        strokeWidth: 2,
        fill: "rgba(231, 76, 60, 0.15)",
        zIndex: 1,
      },
    );
    board.add(triangle);

    // ── Circumscribed circle ──────────────────────────────────
    // Compute circumcenter and circumradius of the triangle
    const tri = triangle.geometry as Triangle;
    const cx = (tri.pA.x + tri.pB.x + tri.pC.x) / 3;
    const cy = (tri.pA.y + tri.pB.y + tri.pC.y) / 3;
    const circumCircle = new Feature(
      new Circle(new Point(cx, cy), 48),
      {
        stroke: "#3498db",
        strokeWidth: 2,
        fill: "rgba(52, 152, 219, 0.1)",
        zIndex: 2,
      },
    );
    board.add(circumCircle);

    // ── Inner circle ──────────────────────────────────────────
    const innerCircle = new Feature(
      new Circle(new Point(cx, cy), 20),
      {
        stroke: "#2ecc71",
        strokeWidth: 2,
        fill: "rgba(46, 204, 113, 0.15)",
        zIndex: 3,
      },
    );
    board.add(innerCircle);

    // ── Lines connecting vertices to centroid ─────────────────
    const medianColors = ["#e67e22", "#9b59b6", "#1abc9c"];
    const centroid = new Point(cx, cy);
    const vertices = [tri.pA, tri.pB, tri.pC];
    vertices.forEach((v, i) => {
      board.add(new Feature(
        new Line(v, centroid),
        {
          stroke: medianColors[i]!,
          strokeWidth: 1.5,
          opacity: 0.7,
          zIndex: 4,
        },
      ));
    });

    // ── Vertex points (on top) ────────────────────────────────
    vertices.forEach((v) => {
      board.add(new Feature(v, {
        stroke: "#e74c3c",
        strokeWidth: 1,
        fill: "#e74c3c",
        pointRadius: 4,
        zIndex: 10,
      }));
    });

    // ── Centroid point ────────────────────────────────────────
    board.add(new Feature(centroid, {
      stroke: "#f39c12",
      strokeWidth: 1,
      fill: "#f39c12",
      pointRadius: 5,
      zIndex: 10,
    }));

    // ── Origin marker ─────────────────────────────────────────
    board.add(new Feature(new Point(0, 0), {
      stroke: "rgba(255,255,255,0.6)",
      strokeWidth: 1,
      fill: "rgba(255,255,255,0.3)",
      pointRadius: 3,
      zIndex: 5,
    }));

    return board;
  }

  function render() {
    const board = buildScene();
    const svgString = board.render();

    // Compute some math info from the features
    const tri = board.features[2]!;
    const circ = board.features[3]!;
    const extent = board.getGlobalExtent();

    element.innerHTML = `
      <div class="driver-demo-info">
        <p><strong>Driver Pattern Demo</strong> — This SVG is generated entirely from code</p>
        <p class="read-the-docs">
          Triangle area: <strong>${tri.getArea().toFixed(2)}</strong> |
          Triangle perimeter: <strong>${tri.getPerimeter().toFixed(2)}</strong> |
          Circle area: <strong>${circ.getArea().toFixed(2)}</strong> |
          Features: <strong>${board.features.length}</strong> |
          Global extent: [${extent.map(n => n.toFixed(0)).join(", ")}]
        </p>
      </div>
      <div id="driver-svg-container" class="svg-container svg-container-dark">
        ${svgString}
      </div>
      <details class="svg-source">
        <summary>View generated SVG source</summary>
        <pre><code>${svgString.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
      </details>
    `;
  }

  render();
}
