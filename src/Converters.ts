import type {iPoint} from "./Point.ts";
import type {LineInterface} from "./Line.ts";
import type {TriangleInterface} from "./Triangle.ts";
import type {CircleInterface} from "./Circle.ts";
import type {PolygonInterface} from "./Polygon.ts";

export default class Converters {
  public static convertToPointArray(data: unknown): iPoint[] | undefined {
    return Array.isArray(data)
      ? data.map((item: unknown) => Converters.convertToPoint(item as Record<string, unknown>))
      : undefined;
  }

  public static convertToPoint(data: Record<string, unknown>): iPoint {
    if (data === undefined || data === null) {
      throw new TypeError("Point data is undefined or null");
    }
    if ("x" in data && "y" in data) {
      return {
        x: data["x"] as number,
        y: data["y"] as number,
        name: "name" in data ? data["name"] as string : undefined,
      };
    } else {
      throw new TypeError("Point data is not valid");
    }
  }

  public static convertToLineArray(data: unknown): LineInterface[] | undefined {
    if (Array.isArray(data)) {
      return data.map((item: unknown) => Converters.convertToLine(item as Record<string, unknown>));
    } else {
      throw new TypeError("data is not an array");
    }
  }

  public static convertToLine(data: Record<string, unknown>): LineInterface {
    if (data === undefined || data === null) {
      throw new TypeError("Line data is undefined or null");
    }
    if ("start" in data && "end" in data) {
      return {
        start: Converters.convertToPoint(data["start"] as Record<string, unknown>),
        end: Converters.convertToPoint(data["end"] as Record<string, unknown>),
        name: "name" in data ? data["name"] as string : undefined,
        isValid: true,
      };
    } else {
      throw new TypeError("Line data is not valid");
    }
  }

  public static convertToCircle(data: Record<string, unknown>): CircleInterface {
    if (data === undefined || data === null) {
      throw new TypeError("Circle data is undefined or null");
    }
    if ("center" in data && "radius" in data) {
      return {
        center: Converters.convertToPoint(data["center"] as Record<string, unknown>),
        radius: data["radius"] as number,
        name: "name" in data ? data["name"] as string : undefined,
      };
    } else {
      throw new TypeError("Circle data is not valid");
    }
  }

  static convertToTriangle(data: Record<string, unknown>): TriangleInterface {
    if (data === undefined || data === null) {
      throw new TypeError("Triangle data is undefined or null");
    }
    if (
      "pA" in data &&
      "pB" in data &&
      "pC" in data &&
      data["pA"] !== undefined &&
      data["pB"] !== undefined &&
      data["pC"] !== undefined
    ) {
      return {
        pA: Converters.convertToPoint(data["pA"] as Record<string, unknown>),
        pB: Converters.convertToPoint(data["pB"] as Record<string, unknown>),
        pC: Converters.convertToPoint(data["pC"] as Record<string, unknown>),
        name: "name" in data ? data["name"] as string : undefined,
      };
    }
    throw new TypeError("Triangle data is not valid");
  }

  static convertToPolygon(data: Record<string, unknown>): PolygonInterface {
    if (data === undefined || data === null) {
      throw new TypeError("Polygon data is undefined or null");
    }
    if ("points" in data && data["points"] !== undefined) {
      const pointsData = data["points"] as unknown[];
      if (!Array.isArray(pointsData) || pointsData.length < 3) {
        throw new TypeError("Polygon data needs at least 3 points");
      }
      return {
        points: pointsData.map((p) => Converters.convertToPoint(p as Record<string, unknown>)),
        name: "name" in data ? data["name"] as string : undefined,
      };
    }
    throw new TypeError("Polygon data is not valid");
  }
}
