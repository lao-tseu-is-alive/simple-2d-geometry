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
});

