export type AngleType = "radians" | "degrees" | "gradians";

export default class Angle {
  private _angle: number;
  private readonly _type: AngleType;

  constructor(value: number, type: AngleType = "degrees") {
    this._angle = value;
    this._type = type;
    this.normalize();
  }

  toRadians(): number {
    if (this.type === "radians") return this.angle;
    if (this.type === "gradians") return (this.angle * Math.PI) / 200;
    return (this.angle * Math.PI) / 180;
  }

  toDegrees(): number {
    if (this.type === "degrees") return this.angle;
    if (this.type === "gradians") return (this.angle * 360) / 400;
    return (this.angle * 180) / Math.PI;
  }

  toGradians(): number {
    if (this.type === "gradians") return this.angle;
    if (this.type === "degrees") return (this.angle * 400) / 360;
    return (this.angle * 200) / Math.PI;
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
    } else if (this.type === "gradians") {
      this._angle %= 400;
      if (this._angle < 0) this._angle += 400;
    } else {
      this._angle %= 2 * Math.PI;
      if (this._angle < 0) this._angle += 2 * Math.PI;
    }
  }

  add(angleValue: number, typeAngle: AngleType = "degrees"): Angle {
    if (typeAngle === this.type) {
      return new Angle(this.angle + angleValue, this.type);
    }
    const tempAngle = new Angle(angleValue, typeAngle);
    if (this.type === "degrees") {
      return new Angle(this.angle + tempAngle.toDegrees(), this.type);
    } else if (this.type === "gradians") {
      return new Angle(this.angle + tempAngle.toGradians(), this.type);
    } else {
      return new Angle(this.angle + tempAngle.toRadians(), this.type);
    }
  }

  static fromRadians(value: number): Angle {
    return new Angle(value, "radians");
  }

  static fromDegrees(value: number): Angle {
    return new Angle(value, "degrees");
  }

  static fromGradians(value: number): Angle {
    return new Angle(value, "gradians");
  }
}
