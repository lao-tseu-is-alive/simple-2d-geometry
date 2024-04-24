export type AngleType = 'radians' | 'degrees';

export default class Angle {
    private value: number;
    private type: AngleType;

    constructor(value: number, type: AngleType = 'degrees') {
        this.value = value;
        this.type = type;
        this.normalize()
    }

    toRadians(): number {
        if (this.type === 'radians') {
            return this.value;
        }
        return this.value * Math.PI / 180;
    }

    toDegrees(): number {
        if (this.type === 'degrees') {
            return this.value;
        }
        return this.value * 180 / Math.PI;
    }

    setValue(value: number, type: AngleType): void {
        this.value = value;
        this.type = type;
    }

    getValue(): number {
        return this.value;
    }

    getType(): AngleType {
        return this.type;
    }

    normalize(): void {
        if (this.type === 'degrees') {
            this.value %= 360;
            if (this.value < 0) this.value += 360;
        } else {
            this.value %= (2 * Math.PI);
            if (this.value < 0) this.value += (2 * Math.PI);
        }
    }

    static fromRadians(value: number): Angle {
        return new Angle(value, 'radians');
    }

    static fromDegrees(value: number): Angle {
        return new Angle(value, 'degrees');
    }
}
