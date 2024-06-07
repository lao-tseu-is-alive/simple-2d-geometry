import Converters from "../src/Converters";
describe("Converter module", () => {
  describe("convertToPointArray", () => {
    it("should return undefined if data is not an array", () => {
      expect(Converters.convertToPointArray({})).toBeUndefined();
    });
    it("should return an array of iPoint if data is an array", () => {
      const data = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ];
      expect(Converters.convertToPointArray(data)).toEqual([
        { x: 0, y: 0, name: undefined },
        { x: 1, y: 1, name: undefined },
      ]);
    });
  });
  describe("convertToPoint", () => {
    it("should throw TypeError if data is undefined", () => {
      expect(Converters.convertToPoint.bind(undefined, undefined)).toThrow(
        TypeError,
      );
    });
    it("should throw a Type Error if data Object does not contain mandatory properties", () => {
      expect(
        Converters.convertToPoint.bind(undefined, { whatever: 1 }),
      ).toThrow(TypeError);
    });
    it("should return an iPoint if data is defined", () => {
      expect(Converters.convertToPoint({ x: 0, y: 0 })).toEqual({
        x: 0,
        y: 0,
        name: undefined,
      });
    });
  });
  describe("convertToLineArray", () => {
    it("should throw TypeError if data is not an array", () => {
      expect(Converters.convertToLineArray.bind(undefined, undefined)).toThrow(
        TypeError,
      );
    });
    it("should return an array of LineInterface if data is an array", () => {
      const data = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        { start: { x: 1, y: 1 }, end: { x: 2, y: 2 } },
      ];
      expect(Converters.convertToLineArray(data)).toEqual([
        {
          start: { x: 0, y: 0, name: undefined },
          end: { x: 1, y: 1, name: undefined },
          name: undefined,
          isValid: true,
        },
        {
          start: { x: 1, y: 1, name: undefined },
          end: { x: 2, y: 2, name: undefined },
          name: undefined,
          isValid: true,
        },
      ]);
    });
  });
  describe("convertToLine", () => {
    it("should throw TypeError if data is undefined", () => {
      expect(Converters.convertToLine.bind(undefined, undefined)).toThrow(
        TypeError,
      );
    });
    it("should throw a Type Error if data Object does not contain mandatory properties", () => {
      expect(Converters.convertToLine.bind(undefined, { whatever: 1 })).toThrow(
        TypeError,
      );
    });
    it("should return a LineInterface if data is defined", () => {
      expect(
        Converters.convertToLine({
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        }),
      ).toEqual({
        start: { x: 0, y: 0, name: undefined },
        end: { x: 1, y: 1, name: undefined },
        name: undefined,
        isValid: true,
      });
    });
  });
  describe("convertToTriangle", () => {
    it("should throw a Type Error if data is undefined", () => {
      expect(Converters.convertToTriangle.bind(undefined, undefined)).toThrow(
        TypeError,
      );
    });
    it("should throw a Type Error if data Object does not contain mandatory properties", () => {
      expect(
        Converters.convertToTriangle.bind(undefined, { whatever: 1 }),
      ).toThrow(TypeError);
    });
    it("should return a TriangleInterface if data is correct", () => {
      const data = {
        pA: { x: -1, y: 2, name: "pA" },
        pB: { x: 2, y: 3, name: "pB" },
        pC: { x: 4, y: -3, name: "pC" },
        name: "T1",
      };
      expect(Converters.convertToTriangle(data)).toEqual({
        pA: { x: -1, y: 2, name: "pA" },
        pB: { x: 2, y: 3, name: "pB" },
        pC: { x: 4, y: -3, name: "pC" },
        name: "T1",
      });
    });
  });
});
