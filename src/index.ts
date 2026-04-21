import Angle, {type AngleType} from "./Angle.ts";
import {
    EPSILON,
    PRECISION,
    isNumeric,
    roundNumber,
    getNumberOrFail,
    fixDec,
} from "./Geometry.ts";
import Circle, {type CircleInterface} from "./Circle.ts";
import Converters from "./Converters.ts";
import DrawingBoard, {type DrawingBoardOptions} from "./DrawingBoard.ts";
import type {GeometryDriver, Extent, BoundingBox} from "./Driver.ts";
import Feature, {type FeatureOptions} from "./Feature.ts";
import Line, {type LineInterface, type coordinatesLineArray} from "./Line.ts";
import LitRenderDriver from "./LitRenderDriver.ts"
import Point, {type iPoint, type coordinate2dArray} from "./Point.ts";
import type {RenderDriver, RenderOptions, ComposeOptions} from "./RenderDriver.ts";
import SVGRenderDriver from "./SVGRenderDriver.ts";
import Triangle, {type TriangleInterface, type coordinatesTriangleArray} from "./Triangle.ts";
import {APP, VERSION, BUILD_DATE} from "./version.ts";

export {
    APP,
    Angle,
    BUILD_DATE,
    Converters,
    Point,
    Line,
    Triangle,
    Circle,
    EPSILON,
    PRECISION,
    isNumeric,
    roundNumber,
    getNumberOrFail,
    fixDec,
    VERSION,
    SVGRenderDriver,
    LitRenderDriver,
    Feature,
    DrawingBoard,
};
export type {
    AngleType, iPoint, coordinate2dArray,
    TriangleInterface, coordinatesTriangleArray, CircleInterface,
    LineInterface, coordinatesLineArray,
    GeometryDriver, Extent, BoundingBox,
    RenderDriver, RenderOptions, ComposeOptions,
    FeatureOptions, DrawingBoardOptions,
};
