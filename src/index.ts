import Angle, { AngleType } from "./Angle.ts";
import {
  EPSILON,
  PRECISION,
  isNumeric,
  roundNumber,
  getNumberOrFail,
  fixDec,
} from "./Geometry.ts";
import Line from "./Line.ts";
import Point, { iPoint } from "./Point.ts";
import Triangle from "./Triangle.ts";
import { APP, VERSION, BUILD_DATE } from "./version.ts";

export {
  APP,
  Angle,
  BUILD_DATE,
  Point,
  Line,
  Triangle,
  EPSILON,
  PRECISION,
  isNumeric,
  roundNumber,
  getNumberOrFail,
  fixDec,
  VERSION,
};
export type { iPoint, AngleType };
