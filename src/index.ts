import Angle, {type AngleType} from "./Angle.ts";
import {
    EPSILON,
    PRECISION,
    isNumeric,
    roundNumber,
    getNumberOrFail,
    fixDec,
} from "./Geometry.ts";
import Point, {type iPoint, type coordinate2dArray} from "./Point.ts";
import Line, {type LineInterface, type coordinatesLineArray} from "./Line.ts";
import Triangle, {type TriangleInterface, type coordinatesTriangleArray} from "./Triangle.ts";
import Circle, {type CircleInterface} from "./Circle.ts";
import {APP, VERSION, BUILD_DATE} from "./version.ts";
import type {GeometryDriver, Extent} from "./Driver.ts";
import type {RenderDriver, RenderOptions, ComposeOptions} from "./RenderDriver.ts";
import SVGRenderDriver from "./SVGRenderDriver.ts";
import LitRenderDriver from "./LitRenderDriver.ts"
import Feature, {type FeatureOptions} from "./Feature.ts";
import DrawingBoard, {type DrawingBoardOptions} from "./DrawingBoard.ts";

export {
    APP,
    Angle,
    BUILD_DATE,
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
    GeometryDriver, Extent,
    RenderDriver, RenderOptions, ComposeOptions,
    FeatureOptions, DrawingBoardOptions,
};
