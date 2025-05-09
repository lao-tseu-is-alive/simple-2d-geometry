export type AngleType = "radians" | "degrees";

export default class Angle {
  private _angle: number;
  private readonly _type: AngleType;

  constructor(value: number, type: AngleType = "degrees") {
    this._angle = value;
    this._type = type;
    this.normalize();
  }

  toRadians(): number {
    if (this.type === "radians") {
      return this.angle;
    }
    return (this.angle * Math.PI) / 180;
  }

  toDegrees(): number {
    if (this.type === "degrees") {
      return this.angle;
    }
    return (this.angle * 180) / Math.PI;
  }

  set angle(value: number) {
    this._angle = value;
    this.normalize();
  }

  get angle(): number {
    return this._angle;
  }

  get type(): AngleType {
    return this._type;
  }

  normalize(): void {
    if (this.type === "degrees") {
      this._angle %= 360;
      if (this._angle < 0) this._angle += 360;
    } else {
      this._angle %= 2 * Math.PI;
      if (this._angle < 0) this._angle += 2 * Math.PI;
    }
  }

  add(angleValue: number, typeAngle: AngleType = "degrees"): Angle {
    if (typeAngle !== this.type) {
      //convert angleValue
      if (typeAngle === "degrees") {
        const angleValueRadians = (angleValue * Math.PI) / 180;
        return new Angle(this.angle + angleValueRadians, typeAngle);
      } else {
        const angleValueDegrees = (angleValue * 180) / Math.PI;
        return new Angle(this.angle + angleValueDegrees, typeAngle);
      }
    } else {
      return new Angle(this.angle + angleValue, typeAngle);
    }
  }

  static fromRadians(value: number): Angle {
    return new Angle(value, "radians");
  }

  static fromDegrees(value: number): Angle {
    return new Angle(value, "degrees");
  }
}
