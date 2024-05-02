import { iPoint } from "./Point.ts";
import { iLine } from "./Line.ts";

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

  public static convertToLineArray(data: any): iLine[] | undefined {
    return Array.isArray(data)
      ? data.map((item) => Converters.convertToLine(item))
      : undefined;
  }

  public static convertToLine(data: any): iLine {
    return data
      ? {
          start: Converters.convertToPoint(data["start"]),
          end: Converters.convertToPoint(data["end"]),
          name: "name" in data ? data["name"] : undefined,
        }
      : {
          start: { x: 0, y: 0, name: undefined, isValid: false },
          end: { x: 0, y: 0, name: undefined, isValid: false },
        };
  }
}
