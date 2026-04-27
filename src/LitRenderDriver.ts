import {svg, type TemplateResult} from 'lit';
import type Point from "./Point.ts";
import type Line from "./Line.ts";
import type Circle from "./Circle.ts";
import type Triangle from "./Triangle.ts";
import type Polygon from "./Polygon.ts";
import type { RenderDriver, RenderOptions, ComposeOptions } from "./RenderDriver.ts";
import type {Extent} from "./Driver.ts";


/**
 * Lit https://lit.dev/ implementation of the RenderDriver.
 * Produces Lit svg templates ready to be used in your own components .
 * you can have a look at https://github.com/lao-tseu-is-alive/drawing for an example usage
 */
export default class LitRenderDriver implements RenderDriver<TemplateResult> {
    private attrs(options: RenderOptions) {
        return svg`
      stroke=${options.stroke} 
      stroke-width=${options.strokeWidth} 
      fill=${options.fill} 
      opacity=${options.opacity}
    `;
    }
    private getStyle(options: RenderOptions): string {
        return `stroke: ${options.stroke}; stroke-width: ${options.strokeWidth}; fill: ${options.fill}; opacity: ${options.opacity};`;
    }
    /**
     * Resolves a Y-coordinate for SVG output.
     * When invertY is true, negates the value so Cartesian "up = +Y" renders correctly on screen.
     */
    private resolveY(y: number, invertY: boolean): number {
        return invertY ? -y : y;
    }


    renderPoint(point: Point, options: RenderOptions, invertY: boolean): TemplateResult {
        const cx = point.x;
        const cy = this.resolveY(point.y, invertY);
        return svg`<circle cx=${cx} cy=${cy} r=${options.pointRadius} style=${this.getStyle(options)}></circle>`;
    }

    renderLine(line: Line, options: RenderOptions, invertY: boolean): TemplateResult {
        const x1 = line.start.x;
        const y1 = this.resolveY(line.start.y, invertY);
        const x2 = line.end.x;
        const y2 = this.resolveY(line.end.y, invertY);
        return svg`<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} style=${this.getStyle(options)}></line>`;
    }

    renderCircle(circle: Circle, options: RenderOptions, invertY: boolean): TemplateResult {
        const cx = circle.center.x;
        const cy = this.resolveY(circle.center.y, invertY);
        return svg`<circle cx=${cx} cy=${cy} r=${circle.radius} style=${this.getStyle(options)}></circle>`;
    }

    renderTriangle(triangle: Triangle, options: RenderOptions, invertY: boolean): TemplateResult {
        const points = [triangle.pA, triangle.pB, triangle.pC]
            .map(p => `${p.x},${this.resolveY(p.y, invertY)}`)
            .join(" ");
        return svg`<polygon points="${points}" style=${this.getStyle(options)}/>`;
    }

    renderPolygon(polygon: Polygon, options: RenderOptions, invertY: boolean): TemplateResult {
        const points = polygon.points
            .map(p => `${p.x},${this.resolveY(p.y, invertY)}`)
            .join(" ");
        return svg`<polygon points="${points}" style=${this.getStyle(options)}/>`;
    }

    compose(elements: TemplateResult[], viewBox: Extent, options: ComposeOptions): TemplateResult {
        const [minX, minY, maxX, maxY] = viewBox;
        const pad = options.padding;

        let vbMinX: number, vbMinY: number, vbWidth: number, vbHeight: number;

        // Calcul rigoureux de la ViewBox respectant le repère cartésien
        if (options.invertY) {
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

        const width = options.width !== undefined ? options.width : '100%';
        const height = options.height !== undefined ? options.height : '100%';

        // Encapsulation dans un contexte SVG valide et réactif
        return svg`<svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}"
        width="${width}"
        height="${height}"
        class="simple-2d-board"
    >
        ${elements}
    </svg>`;
    }
}
