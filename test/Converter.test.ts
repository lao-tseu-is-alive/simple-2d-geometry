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
        { x: 0, y: 0, name: undefined, isValid: true },
        { x: 1, y: 1, name: undefined, isValid: true },
      ]);
    });
  });
  describe("convertToPoint", () => {
    it("should return a default iPoint if data is undefined", () => {
      expect(Converters.convertToPoint(undefined)).toEqual({
        x: 0,
        y: 0,
        name: undefined,
        isValid: false,
      });
    });
    it("should return an iPoint if data is defined", () => {
      expect(Converters.convertToPoint({ x: 0, y: 0 })).toEqual({
        x: 0,
        y: 0,
        name: undefined,
        isValid: true,
      });
    });
  });
  describe("convertToLineArray", () => {
    it("should return undefined if data is not an array", () => {
      expect(Converters.convertToLineArray({})).toBeUndefined();
    });
    it("should return an array of LineInterface if data is an array", () => {
      const data = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        { start: { x: 1, y: 1 }, end: { x: 2, y: 2 } },
      ];
      expect(Converters.convertToLineArray(data)).toEqual([
        {
          start: { x: 0, y: 0, name: undefined, isValid: true },
          end: { x: 1, y: 1, name: undefined, isValid: true },
          name: undefined,
          isValid: true,
        },
        {
          start: { x: 1, y: 1, name: undefined, isValid: true },
          end: { x: 2, y: 2, name: undefined, isValid: true },
          name: undefined,
          isValid: true,
        },
      ]);
    });
  });
  describe("convertToLine", () => {
    it("should return a default LineInterface if data is undefined", () => {
      expect(Converters.convertToLine(undefined)).toEqual({
        start: { x: 0, y: 0, name: undefined, isValid: false },
        end: { x: 0, y: 0, name: undefined, isValid: false },
        isValid: false,
        name: undefined,
      });
    });
    it("should return a LineInterface if data is defined", () => {
      expect(
        Converters.convertToLine({
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        }),
      ).toEqual({
        start: { x: 0, y: 0, name: undefined, isValid: true },
        end: { x: 1, y: 1, name: undefined, isValid: true },
        name: undefined,
        isValid: true,
      });
    });
  });
});
