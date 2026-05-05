import { describe, test, expect } from "bun:test";
import { GeomAngleInput } from "../packages/geom-2d-ui/src/geom-angle-input.ts";

describe('GeomAngleInput', () => {
    test('can be instantiated with default values', () => {
        const el = new GeomAngleInput();
        expect(el).toBeDefined();
        expect(el.value).toBe(0);
        expect(el.mode).toBe("degrees");
        expect(el.angle.angle).toBe(0);
        expect(el.angle.type).toBe("degrees");
    });

    test('updates angle instance when value is set', () => {
        const el = new GeomAngleInput();
        // Since it's a LitElement without DOM connection we need to call willUpdate manually to simulate lifecycle,
        // or just rely on LitElement's behavior if it works synchronously in tests.
        // Actually, the _angle is updated in `willUpdate`. If we just set value, _angle won't update
        // unless we simulate the Lit update cycle. Let's just call `willUpdate` manually for testing the logic.
        const changedProperties = new Map();
        changedProperties.set('value', 0);
        
        el.value = 90;
        el.willUpdate(changedProperties);
        
        expect(el.angle.angle).toBe(90);
        expect(el.angle.type).toBe("degrees");
        expect(el.angle.toRadians()).toBe(Math.PI / 2);
    });

    test('updates angle instance when mode is set', () => {
        const el = new GeomAngleInput();
        el.value = Math.PI;
        el.mode = "radians";
        
        const changedProperties = new Map();
        changedProperties.set('mode', 'degrees');
        changedProperties.set('value', 0);
        el.willUpdate(changedProperties);
        
        expect(el.angle.angle).toBe(Math.PI);
        expect(el.angle.type).toBe("radians");
        expect(el.angle.toDegrees()).toBe(180);
    });

    test('snaps value to integer when integerOnly is toggled on in degrees mode', () => {
        const el = new GeomAngleInput();
        el.mode = "degrees";
        el.value = 45.67;
        
        // Mock the toggle event
        const mockEvent = { target: { checked: true } } as unknown as Event;
        (el as any)._toggleIntegerOnly(mockEvent);
        
        expect(el.integerOnly).toBe(true);
        expect(el.value).toBe(46);
    });

    test('ignores integerOnly toggle when in radians mode', () => {
        const el = new GeomAngleInput();
        el.mode = "radians";
        el.value = Math.PI / 4; // ~0.785
        
        const mockEvent = { target: { checked: true } } as unknown as Event;
        (el as any)._toggleIntegerOnly(mockEvent);
        
        // Value shouldn't be rounded, and integerOnly shouldn't be activated
        expect(el.integerOnly).toBe(false);
        expect(el.value).toBe(Math.PI / 4);
    });

    test('input change respects integerOnly in degrees mode', () => {
        const el = new GeomAngleInput();
        el.mode = "degrees";
        el.integerOnly = true;

        const mockEvent = { target: { value: "33.7" } } as unknown as Event;
        (el as any)._onInputChange(mockEvent);

        expect(el.value).toBe(34); // Should be rounded to nearest integer
    });
});

