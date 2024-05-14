import Circle from "../src/Circle";
import Point from "../src/Point";

describe("Circle", () => {
  let circle: Circle;
  let center: Point;
  let radius: number;
  let name: string;

  beforeEach(() => {
    center = new Point(1, 2);
    radius = 3;
    name = "circle";
    circle = new Circle(center, radius, name);
  });
  describe("Circle setters", () => {
    test("center should be a Point object", () => {
      expect(circle.center).toBeInstanceOf(Point);
    });

    test("radius should be a positive number", () => {
      expect(circle.radius).toBeGreaterThan(0);
    });

    test("name should be a string", () => {
      expect(circle.name).toEqual(name);
    });

    test("should create a Circle from center and radius", () => {
      expect(circle.center).toEqual(center);
      expect(circle.radius).toEqual(radius);
      expect(circle.name).toEqual(name);
    });

    test("should throw a TypeError if center is not a Point object", () => {
      expect(() => {
        new Circle({} as Point, radius, name);
      }).toThrow(TypeError);
    });

    test("should throw a RangeError if radius is not a positive number", () => {
      expect(() => {
        new Circle(center, -1, name);
      }).toThrow(RangeError);
    });

    test("should throw a TypeError if name is not a string", () => {
      expect(() => {
        new Circle(center, radius, {} as string);
      }).toThrow(TypeError);
    });
  });
  describe("Circle constructor", () => {
    test("constructor with parameters should store center, radius and name", () => {
      expect(circle.center).toEqual(center);
      expect(circle.radius).toEqual(radius);
      expect(circle.name).toEqual(name);
      expect(circle instanceof Circle).toBe(true);
    });
    test("constructor with only center and radius should store center and radius and empty name", () => {
      const circle2 = new Circle(center, radius);
      expect(circle2.center).toEqual(center);
      expect(circle2.radius).toEqual(radius);
      expect(circle2.name).toEqual("");
    });
  });
  describe("Circle static methods", () => {
    test("fromCenterRadius should create a Circle from center and radius", () => {
      const newCircle = Circle.fromCenterRadius(center, radius, name);
      expect(newCircle.center).toEqual(center);
      expect(newCircle.radius).toEqual(radius);
      expect(newCircle.name).toEqual(name);
    });
    test("fromCenterRadius should create a Circle from center and radius with empty name", () => {
      const newCircle = Circle.fromCenterRadius(center, radius);
      expect(newCircle.center).toEqual(center);
      expect(newCircle.radius).toEqual(radius);
      expect(newCircle.name).toEqual("");
    });
    test("fromArray should create a Circle from an array", () => {
      const newCircle = Circle.fromArray([1, 2, 3], name);
      expect(newCircle.center).toEqual(center);
      expect(newCircle.radius).toEqual(radius);
      expect(newCircle.name).toEqual(name);
    });
    test("fromArray should create a Circle from an array with empty name", () => {
      const newCircle = Circle.fromArray([1, 2, 3]);
      expect(newCircle.center).toEqual(center);
      expect(newCircle.radius).toEqual(radius);
      expect(newCircle.name).toEqual("");
    });
    test("fromArray should throw a TypeError if center is not an array", () => {
      expect(() => {
        Circle.fromArray({} as number[], name);
      }).toThrow(TypeError);
    });
    test("fromArray should throw a RangeError if center array length is not 3", () => {
      expect(() => {
        Circle.fromArray([1, 2], name);
      }).toThrow(RangeError);
    });
  });
  describe("Circle area", () => {
    test("area should return the area of the circle", () => {
      expect(circle.area()).toBeCloseTo(28.274333882308138);
    });
  });
});
