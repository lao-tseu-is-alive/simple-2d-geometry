import { iPoint } from "./Point.ts";
import { LineInterface } from "./Line.ts";
import { TriangleInterface } from "./Triangle.ts";

export default class Converters {
  public static convertToPointArray(data: any): iPoint[] | undefined {
    return Array.isArray(data)
      ? data.map((item) => Converters.convertToPoint(item))
      : undefined;
  }

  public static convertToPoint(data: any): iPoint {
    if (data === undefined || data === null) {
      throw new TypeError("Point data is undefined or null");
    }
    if ("x" in data && "y" in data) {
      return {
        x: data["x"],
        y: data["y"],
        name: "name" in data ? data["name"] : undefined,
      };
    } else {
      throw new TypeError("Point data is not valid");
    }
  }

  public static convertToLineArray(data: any): LineInterface[] | undefined {
    if (Array.isArray(data)) {
      return data.map((item) => Converters.convertToLine(item));
    } else {
      throw new TypeError("data is not an array");
    }
  }

  public static convertToLine(data: any): LineInterface {
    if (data === undefined || data === null) {
      throw new TypeError("Line data is undefined or null");
    }
    if ("start" in data && "end" in data) {
      return {
        start: Converters.convertToPoint(data["start"]),
        end: Converters.convertToPoint(data["end"]),
        name: "name" in data ? data["name"] : undefined,
        isValid: true,
      };
    } else {
      throw new TypeError("Line data is not valid");
    }
  }

  static convertToTriangle(data: any): TriangleInterface {
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
        pA: Converters.convertToPoint(data["pA"]),
        pB: Converters.convertToPoint(data["pB"]),
        pC: Converters.convertToPoint(data["pC"]),
        name: "name" in data ? data["name"] : undefined,
      };
    }
    throw new TypeError("Triangle data is not valid");
  }
}
