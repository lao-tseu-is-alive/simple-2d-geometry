import type Point from "./Point.ts";
import type Line from "./Line.ts";
import type Circle from "./Circle.ts";
import type Triangle from "./Triangle.ts";
import type Polygon from "./Polygon.ts";
import type { Extent } from "./Driver.ts";
import type { RenderDriver, RenderOptions, ComposeOptions } from "./RenderDriver.ts";

/**
 * Builds the common SVG attribute string from RenderOptions.
 */
function svgAttributes(options: RenderOptions): string {
  return `stroke="${options.stroke}" stroke-width="${options.strokeWidth}" fill="${options.fill}" opacity="${options.opacity}"`;
}

/**
 * Resolves a Y-coordinate for SVG output.
 * When invertY is true, negates the value so Cartesian "up = +Y" renders correctly on screen.
 */
function resolveY(y: number, invertY: boolean): number {
  return invertY ? -y : y;
}

/**
 * SVG implementation of the RenderDriver.
 * Produces pure SVG element strings with zero DOM dependencies.
 */
export default class SVGRenderDriver implements RenderDriver<string> {
  renderPoint(point: Point, options: RenderOptions, invertY: boolean): string {
    const cx = point.x;
    const cy = resolveY(point.y, invertY);
    return `<circle cx="${cx}" cy="${cy}" r="${options.pointRadius}" ${svgAttributes(options)}/>`;
  }

  renderLine(line: Line, options: RenderOptions, invertY: boolean): string {
    const x1 = line.start.x;
    const y1 = resolveY(line.start.y, invertY);
    const x2 = line.end.x;
    const y2 = resolveY(line.end.y, invertY);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${svgAttributes(options)}/>`;
  }

  renderCircle(circle: Circle, options: RenderOptions, invertY: boolean): string {
    const cx = circle.center.x;
    const cy = resolveY(circle.center.y, invertY);
    return `<circle cx="${cx}" cy="${cy}" r="${circle.radius}" ${svgAttributes(options)}/>`;
  }

  renderTriangle(triangle: Triangle, options: RenderOptions, invertY: boolean): string {
    const points = [triangle.pA, triangle.pB, triangle.pC]
      .map(p => `${p.x},${resolveY(p.y, invertY)}`)
      .join(" ");
    return `<polygon points="${points}" ${svgAttributes(options)}/>`;
  }

  renderPolygon(polygon: Polygon, options: RenderOptions, invertY: boolean): string {
    const points = polygon.points
      .map(p => `${p.x},${resolveY(p.y, invertY)}`)
      .join(" ");
    return `<polygon points="${points}" ${svgAttributes(options)}/>`;
  }

  compose(elements: string[], viewBox: Extent, options: ComposeOptions): string {
    const [minX, minY, maxX, maxY] = viewBox;
    const pad = options.padding;

    // When invertY is active, the Y coordinates have been negated in the elements.
    // The viewBox must reflect the negated coordinate space.
    let vbMinX: number;
    let vbMinY: number;
    let vbWidth: number;
    let vbHeight: number;

    if (options.invertY) {
      // Negated Y: screen minY = -maxY, screen maxY = -minY
      vbMinX = minX - pad;
      vbMinY = -maxY - pad;
      vbWidth = (maxX - minX) + 2 * pad;
      vbHeight = (maxY - minY) + 2 * pad;
    } else {
      vbMinX = minX - pad;
      vbMinY = minY - pad;
      vbWidth = (maxX - minX) + 2 * pad;
      vbHeight = (maxY - minY) + 2 * pad;
    }

    const widthAttr = options.width !== undefined ? ` width="${options.width}"` : "";
    const heightAttr = options.height !== undefined ? ` height="${options.height}"` : "";

    const content = elements.join("\n  ");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}"${widthAttr}${heightAttr}>\n  ${content}\n</svg>`;
  }
}
