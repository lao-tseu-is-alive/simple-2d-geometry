import {describe, test, expect, beforeEach} from "bun:test";
import { Angle } from "../packages/geom-2d-core";
import { Circle } from "../packages/geom-2d-core";
import { Point } from "../packages/geom-2d-core";
import type { RenderDriver, RenderOptions } from "../packages/geom-2d-core";

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
            expect(circle.center.x).toEqual(center.x);
            expect(circle.center.y).toEqual(center.y);
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

    describe("Circle getters", () => {
        test("diameter should return the correct value", () => {
            expect(circle.diameter).toEqual(radius * 2)
        })
    })

    describe("Circle constructor", () => {
        test("constructor with parameters should store center, radius and name", () => {
            expect(circle.center.x).toEqual(center.x);
            expect(circle.center.y).toEqual(center.y);
            expect(circle.radius).toEqual(radius);
            expect(circle.name).toEqual(name);
            expect(circle instanceof Circle).toBe(true);
        });
        test("constructor with only center and radius should store center and radius and empty name", () => {
            const circle2 = new Circle(center, radius);
            expect(circle2.center.x).toEqual(center.x);
            expect(circle2.center.y).toEqual(center.y);
            expect(circle2.radius).toEqual(radius);
            expect(circle2.name).toEqual("");
        });
    });

    describe("Circle static methods", () => {
        test("fromCircle should create a Circle from center and radius", () => {
            const newCircle = Circle.fromCircle(new Circle(center, radius, name));
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toEqual(name);
        });
        test("fromCircle should create a Circle from center and radius with empty name", () => {
            const newCircle = Circle.fromCircle(new Circle(center, radius));
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.name).toEqual("");
        });
        test("fromArray should create a Circle from an array", () => {
            const newCircle = Circle.fromArray([1, 2, 3], name);
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toEqual(name);
        });
        test("fromArray should create a Circle from an array with empty name", () => {
            const newCircle = Circle.fromArray([1, 2, 3]);
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toEqual("");
        });
        test("fromArray should throw a RangeError if center is not an array", () => {
            expect(() => {
                Circle.fromArray({} as [number, number, number], name);
            }).toThrow(RangeError);
        });
        test("fromArray should throw a RangeError if center array length is not 3", () => {
            expect(() => {
                Circle.fromArray([1, 2] as any, name);
            }).toThrow(RangeError);
        });
        test("fromObject should throw a TypeError if object is not a circle like object", () => {
            expect(() => {
                Circle.fromObject({c: 1, nope: 2} as any);
            }).toThrow(TypeError);
        });
        test("fromObject should create a Circle from a valid object", () => {
            const newCircle = Circle.fromObject({center: center, radius: radius, name: "C2"});
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toEqual("C2");
        });
        test("fromJSON should throw a TypeError if JSON is not valid", () => {
            expect(() => {
                Circle.fromJSON(`{"center": "{ x:${center.x}}", "radius": ${radius} }`);
            }).toThrow(TypeError);
        });
        test(`fromJSON should create a Circle from a valid JSON`, () => {
            const newCircle = Circle.fromJSON(`{"center": ${center.toJSON()}, "radius": ${radius}, "name": "C2" }`);
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toEqual("C2");
        });
        test("fromCenterAndPoint should throw a RangeError if radius is not valid", () => {
            expect(() => {
                Circle.fromCenterAndPoint(center, center, "C2");
            }).toThrow(RangeError);
        });
        test(`fromCenterAndPoint should create a Circle from a center and a Point`, () => {
            const newCircle = Circle.fromCenterAndPoint(center, new Point(1, radius + center.y), "C2");
            expect(newCircle.center.x).toEqual(center.x);
            expect(newCircle.center.y).toEqual(center.y);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toContain("C2");
        });
        test("fromDiameter should throw a RangeError if two Point are at same location", () => {
            expect(() => {
                Circle.fromDiameter(center, center, "C2");
            }).toThrow(RangeError);
        });
        test(`fromDiameter should create a Circle from two Points`, () => {
            const newCircle = Circle.fromDiameter(new Point(0, 0), new Point(0, radius * 2), "C2");
            expect(newCircle.center.x).toEqual(0);
            expect(newCircle.center.y).toEqual(radius);
            expect(newCircle.radius).toEqual(radius);
            expect(newCircle.name).toContain("C2");
        });
        test("from3Points should throw a RangeError if any 2 Points are at same location", () => {
            expect(() => {
                Circle.from3Points(center, center, new Point(0, 10), "C2");
            }).toThrow(RangeError);
        });
        test(`from3Points should create a Circle from 3 Points`, () => {
            const newCircle = Circle.from3Points(
                new Point(-10, 0), new Point(0, -10), new Point(10, 0), "C2");
            expect(newCircle.center.x).toEqual(0);
            expect(newCircle.center.y).toEqual(0);
            expect(newCircle.radius).toEqual(10);
            expect(newCircle.name).toContain("C2");
        });
    });

    describe("Circle output functions", () => {
        test("toString should return a valid string representation ", () => {
            expect(circle.toString(" ", false)).toContain("circle:1 2 radius:3");
            expect(circle.toString()).toContain("circle:((1,2),radius:3");
        })

        test("toObject should return a valid circle object ", () => {
            expect(circle.toObject()).toEqual({center: {x: 1, y: 2}, radius: 3, name: "circle"});
        })
        test("toJSON should return a valid circle JSON ", () => {
            expect(circle.toJSON()).toEqual(JSON.stringify({center: {x: 1, y: 2}, radius: 3, name: "circle"}));
        })
    })

    describe("Circle area", () => {
        test("area should return the area of the circle", () => {
            expect(circle.area).toBeCloseTo(28.274333882308138);
        });
    });

    describe("Circle equality functions", () => {
        test("sameLocation circle with other circle at same position and radius to be true", () => {
            expect(circle.sameLocation(new Circle(center,radius))).toBe(true);
        });
        test("sameLocation circle with other circle at same position and different radius to be false", () => {
            expect(circle.sameLocation(new Circle(center,radius*2))).toBe(false);
        });
        test("equal circle with other circle at same position,radius and name to be true", () => {
            expect(circle.equal(new Circle(center,radius, "circle"))).toBe(true);
        });
        test("equal circle with other circle at same position,radius but different name to be false", () => {
            expect(circle.equal(new Circle(center,radius, "other" ))).toBe(false);
        });
        test("equal circle with other circle at same position and different radius to be false", () => {
            expect(circle.equal(new Circle(center,radius*2))).toBe(false);
        });
    });


    describe("Circle spatial queries and transformations", () => {
        test("containsPoint returns true for point inside the circle", () => {
            const inside = new Point(1, 2);
            expect(circle.containsPoint(inside)).toBe(true);
        });

        test("containsPoint returns false for point outside the circle", () => {
            const outside = new Point(10, 10);
            expect(circle.containsPoint(outside)).toBe(false);
        });

        test("intersectsCircle returns true for overlapping circles", () => {
            const other = new Circle(new Point(2, 2), 2);
            expect(circle.intersectsCircle(other)).toBe(true);
        });

        test("intersectsCircle returns false for non-overlapping circles", () => {
            const other = new Circle(new Point(10, 10), 1);
            expect(circle.intersectsCircle(other)).toBe(false);
        });

        test("translate returns a new Circle with translated center", () => {
            const translated = circle.translate(new Point(5, -3));
            expect(translated.center.x).toEqual(6);
            expect(translated.center.y).toEqual(-1);
            expect(translated.radius).toBe(circle.radius);
            expect(translated.name).toBe(circle.name);
        });

        test("rotate returns a new Circle rotated around origin", () => {
            const originCircle = new Circle(new Point(0, 0), 5);
            const angle = Angle.fromDegrees(90);
            const rotated = originCircle.rotate(angle);
            expect(rotated.center.x).toBeCloseTo(originCircle.center.x);
            expect(rotated.center.y).toBeCloseTo(originCircle.center.y);
            expect(rotated.radius).toBe(originCircle.radius);
        });

        test("rotateAround rotates around a given point", () => {
            const otherCenter = new Point(1, 1);
            const angle = Angle.fromDegrees(180);
            const rotated = circle.rotateAround(angle, otherCenter);
            const expectedCenter = new Point(
                -(circle.center.x - otherCenter.x) + otherCenter.x,
                -(circle.center.y - otherCenter.y) + otherCenter.y,
            );
            expect(rotated.center.x).toBeCloseTo(expectedCenter.x);
            expect(rotated.center.y).toBeCloseTo(expectedCenter.y);
        });

        test("getArea returns correct area", () => {
            expect(circle.getArea()).toBeCloseTo(circle.area);
        });

        test("getPerimeter returns correct perimeter", () => {
            expect(circle.getPerimeter()).toBeCloseTo(2 * Math.PI * circle.radius);
        });

        test("getExtent returns correct bounding box", () => {
            const extent = circle.getExtent();
            expect(extent).toEqual([
                circle.center.x - circle.radius,
                circle.center.y - circle.radius,
                circle.center.x + circle.radius,
                circle.center.y + circle.radius,
            ]);
        });
    });


    describe("Circle WKT and EWKT factories", () => {
        test("fromWKT should throw a TypeError for non-string input", () => {
            expect(() => {
                Circle.fromWKT(123);
            }).toThrow(TypeError);
        });

        test("fromWKT should throw a TypeError for an empty string", () => {
            expect(() => {
                Circle.fromWKT("   ");
            }).toThrow(TypeError);
        });

        test("fromWKT should throw a TypeError when geometry type is not CIRCULARSTRING", () => {
            expect(() => {
                Circle.fromWKT("POINT(1 2)");
            }).toThrow(TypeError);
        });

        test("fromWKT should throw a TypeError if CIRCULARSTRING has less than 3 points", () => {
            expect(() => {
                Circle.fromWKT("CIRCULARSTRING(1 0, -1 0)");
            }).toThrow(TypeError);
        });

        test("fromWKT should throw a TypeError for an invalid coordinate pair with one coordinate", () => {
            expect(() => {
                Circle.fromWKT("CIRCULARSTRING(1 0, 2, 1 0)");
            }).toThrow(TypeError);
        });

        test("fromWKT should throw a TypeError for non-numeric coordinates", () => {
            expect(() => {
                Circle.fromWKT("CIRCULARSTRING(1 0, foo bar, 1 0)");
            }).toThrow(TypeError);
        });

        test("fromWKT should throw a RangeError when CIRCULARSTRING is not closed", () => {
            expect(() => {
                Circle.fromWKT("CIRCULARSTRING(1 0, 0 1, -1 0)");
            }).toThrow(RangeError);
        });

        test("fromWKT should create a Circle from a 3-point full-circle CIRCULARSTRING", () => {
            const newCircle = Circle.fromWKT("CIRCULARSTRING(1 0, -1 0, 1 0)");

            expect(newCircle.center.x).toBeCloseTo(0);
            expect(newCircle.center.y).toBeCloseTo(0);
            expect(newCircle.radius).toBeCloseTo(1);
        });

        test("fromWKT should create a Circle from a 5-point full-circle CIRCULARSTRING", () => {
            const newCircle = Circle.fromWKT("CIRCULARSTRING(4 2, 1 5, -2 2, 1 -1, 4 2)");

            expect(newCircle.center.x).toBeCloseTo(1);
            expect(newCircle.center.y).toBeCloseTo(2);
            expect(newCircle.radius).toBeCloseTo(3);
        });

        test("fromWKT should use the farthest point fallback for non-standard closed CIRCULARSTRING", () => {
            const newCircle = Circle.fromWKT("CIRCULARSTRING(4 2, 2 4, 1 5, -2 2, 1 -1, 4 2)");

            expect(newCircle.center.x).toBeCloseTo(1);
            expect(newCircle.center.y).toBeCloseTo(2);
            expect(newCircle.radius).toBeCloseTo(3);
        });

        test("fromEWKT should throw a TypeError for non-string input", () => {
            expect(() => {
                Circle.fromEWKT(null);
            }).toThrow(TypeError);
        });

        test("fromEWKT should throw a TypeError for an empty string", () => {
            expect(() => {
                Circle.fromEWKT("   ");
            }).toThrow(TypeError);
        });

        test("fromEWKT should create a Circle after stripping the SRID prefix", () => {
            const newCircle = Circle.fromEWKT("SRID=2056;CIRCULARSTRING(4 2, 1 5, -2 2, 1 -1, 4 2)");

            expect(newCircle.center.x).toBeCloseTo(1);
            expect(newCircle.center.y).toBeCloseTo(2);
            expect(newCircle.radius).toBeCloseTo(3);
        });

        test("fromEWKT should also accept WKT without SRID prefix", () => {
            const newCircle = Circle.fromEWKT("CIRCULARSTRING(4 2, 1 5, -2 2, 1 -1, 4 2)");

            expect(newCircle.center.x).toBeCloseTo(1);
            expect(newCircle.center.y).toBeCloseTo(2);
            expect(newCircle.radius).toBeCloseTo(3);
        });
    });

    describe("Circle WKT and EWKT output functions", () => {
        test("toWKT should return a valid 5-point CIRCULARSTRING", () => {
            const wkt = circle.toWKT(2);

            expect(wkt).toBe("CIRCULARSTRING(4 2, 1 5, -2 2, 1 -1, 4 2)");
        });

        test("toWKT should be readable by fromWKT", () => {
            const parsed = Circle.fromWKT(circle.toWKT(8));

            expect(parsed.center.x).toBeCloseTo(circle.center.x);
            expect(parsed.center.y).toBeCloseTo(circle.center.y);
            expect(parsed.radius).toBeCloseTo(circle.radius);
        });

        test("toEWKT should return an EWKT with default SRID 2056", () => {
            expect(circle.toEWKT(2056, 2)).toBe(
                "SRID=2056;CIRCULARSTRING(4 2, 1 5, -2 2, 1 -1, 4 2)",
            );
        });

        test("toEWKT should return an EWKT with a custom SRID", () => {
            expect(circle.toEWKT(4326, 2)).toBe(
                "SRID=4326;CIRCULARSTRING(4 2, 1 5, -2 2, 1 -1, 4 2)",
            );
        });
    });

    describe("Circle clone and rendering visitor", () => {
        test("clone should return an independent copy", () => {
            const cloned = circle.clone();

            expect(cloned).not.toBe(circle);
            expect(cloned.center).not.toBe(circle.center);
            expect(cloned.equal(circle)).toBe(true);
        });

        test("accept should delegate to renderer.renderCircle", () => {
            const options = {strokeWidth: 2} as any;
            const renderer = {
                renderCircle(receivedCircle: Circle, receivedOptions: unknown, receivedInvertY: boolean): string {
                    expect(receivedCircle).toBe(circle);
                    expect(receivedOptions).toBe(options);
                    expect(receivedInvertY).toBe(true);
                    return "rendered-circle";
                },
            } as unknown as RenderDriver<string>;

            expect(circle.accept<string>(renderer, options, true)).toBe("rendered-circle");
        });
    });

});
