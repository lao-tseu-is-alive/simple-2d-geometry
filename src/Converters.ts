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
    return data
      ? {
          x: data["x"],
          y: data["y"],
          name: "name" in data ? data["name"] : undefined,
          isValid: true,
        }
      : { x: 0, y: 0, name: undefined, isValid: false };
  }

  public static convertToLineArray(data: any): LineInterface[] | undefined {
    return Array.isArray(data)
      ? data.map((item) => Converters.convertToLine(item))
      : undefined;
  }

  public static convertToLine(data: any): LineInterface {
    if (data === undefined || data === null) {
      return {
        start: { x: 0, y: 0, name: undefined, isValid: false },
        end: { x: 0, y: 0, name: undefined, isValid: false },
        name: undefined,
        isValid: false,
      };
    } else
      return {
        start: Converters.convertToPoint(data["start"]),
        end: Converters.convertToPoint(data["end"]),
        name: "name" in data ? data["name"] : undefined,
        isValid: true,
      };
  }

  static convertToTriangle(data: any): TriangleInterface {
    return data
      ? {
          p1: Converters.convertToPoint(data["p1"]),
          p2: Converters.convertToPoint(data["p2"]),
          p3: Converters.convertToPoint(data["p3"]),
          name: "name" in data ? data["name"] : undefined,
          isValid: true,
        }
      : {
          p1: { x: 0, y: 0, name: undefined, isValid: false },
          p2: { x: 0, y: 0, name: undefined, isValid: false },
          p3: { x: 0, y: 0, name: undefined, isValid: false },
          name: "name" in data ? data["name"] : undefined,
          isValid: false,
        };
  }
}
