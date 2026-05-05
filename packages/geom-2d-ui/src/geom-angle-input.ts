import { LitElement, html, svg, css, type PropertyValues } from "lit";
import Angle, { type AngleType } from "../../geom-2d-core/src/Angle.ts";

/**
 * `<geom-angle-input>` — A premium Lit web component for interactive angle input.
 *
 * Offers two modes (degrees / radians), an interactive SVG cadran with mouse-driven
 * angle selection, and a classic numeric text input. Integrates with the `Angle` class
 * from `@lao-tseu-is-alive/geom-2d-core`.
 *
 * @fires angle-change - Dispatched on every value change with `{ value, mode, angle }` detail.
 *
 * @example
 * ```html
 * <geom-angle-input value="45" mode="degrees"></geom-angle-input>
 * ```
 */
export class GeomAngleInput extends LitElement {
  /* ──────────────── Reactive properties (no decorators) ──────────────── */

  static override properties = {
    value: { type: Number },
    mode: { type: String },
    size: { type: Number },
    disabled: { type: Boolean, reflect: true },
    integerOnly: { type: Boolean, attribute: 'integer-only' },
  };

  /** Current angle value (in the active mode's unit). */
  declare value: number;

  /** Active unit mode. */
  declare mode: AngleType;

  /** SVG cadran diameter in CSS pixels. */
  declare size: number;

  /** When true, all interaction is disabled. */
  declare disabled: boolean;

  /** When true, the angle snaps to integer degrees. */
  declare integerOnly: boolean;

  /* ──────────────── Internal state ──────────────── */

  /** Whether the user is currently dragging the handle. */
  private _dragging = false;

  /** Cached Angle instance — rebuilt on every value / mode change. */
  private _angle: Angle = new Angle(0, "degrees");

  /* ──────────────── Constants ──────────────── */

  /** Radius of the outer circle inside the SVG viewBox. */
  private readonly _outerR = 90;
  /** Radius for tick-mark endpoints (inner side of major ticks). */
  private readonly _majorTickInner = 78;
  /** Radius for minor tick inner. */
  private readonly _minorTickInner = 84;
  /** Radius for label placement. */
  private readonly _labelR = 66;
  /** Handle circle radius. */
  private readonly _handleR = 8;

  constructor() {
    super();
    this.value = 0;
    this.mode = "degrees";
    this.size = 200;
    this.disabled = false;
    this.integerOnly = false;
  }

  /* ──────────────── Lifecycle ──────────────── */

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("value") || changed.has("mode")) {
      this._angle = new Angle(this.value, this.mode);
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._onPointerMoveBound = this._onPointerMove.bind(this);
    this._onPointerUpBound = this._onPointerUp.bind(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopDragging();
  }

  /* ──────────────── Pointer handling ──────────────── */

  private _onPointerMoveBound!: (e: PointerEvent) => void;
  private _onPointerUpBound!: (e: PointerEvent) => void;

  private _startDragging(e: PointerEvent): void {
    if (this.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    this._dragging = true;
    window.addEventListener("pointermove", this._onPointerMoveBound);
    window.addEventListener("pointerup", this._onPointerUpBound);
    this._updateAngleFromPointer(e);
  }

  private _onPointerMove(e: PointerEvent): void {
    if (!this._dragging) return;
    this._updateAngleFromPointer(e);
  }

  private _onPointerUp(_e: PointerEvent): void {
    this._stopDragging();
  }

  private _stopDragging(): void {
    if (!this._dragging) return;
    this._dragging = false;
    window.removeEventListener("pointermove", this._onPointerMoveBound);
    window.removeEventListener("pointerup", this._onPointerUpBound);
  }

  private _onCadranClick(e: PointerEvent): void {
    if (this.disabled) return;
    this._updateAngleFromPointer(e);
  }

  /**
   * Compute angle from pointer position relative to SVG center.
   * Uses mathematical convention: 0 at 3 o'clock, counter-clockwise positive.
   */
  private _updateAngleFromPointer(e: PointerEvent): void {
    const svgEl = this.renderRoot.querySelector("#cadran") as SVGSVGElement | null;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = -(e.clientY - cy); // invert Y for math convention
    let radians = Math.atan2(dy, dx);
    if (radians < 0) radians += 2 * Math.PI;

    if (this.mode === "degrees") {
      let deg = (radians * 180) / Math.PI;
      if (this.integerOnly) deg = Math.round(deg);
      this._setValue(deg);
    } else if (this.mode === "gradians") {
      let grad = (radians * 200) / Math.PI;
      if (this.integerOnly) grad = Math.round(grad);
      this._setValue(grad);
    } else {
      this._setValue(radians);
    }
  }

  /* ──────────────── Numeric input handling ──────────────── */

  private _onInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    let raw = parseFloat(input.value);
    if (Number.isFinite(raw)) {
      if (this.mode !== "radians" && this.integerOnly) raw = Math.round(raw);
      this._setValue(raw);
    }
  }

  /* ──────────────── Mode toggle ──────────────── */

  private _setMode(newMode: AngleType): void {
    if (newMode === this.mode) return;
    if (newMode === "radians") {
      this.value = this._angle.toRadians();
    } else if (newMode === "gradians") {
      this.value = this._angle.toGradians();
    } else {
      this.value = this._angle.toDegrees();
    }
    if (this.integerOnly && newMode !== "radians") {
      this.value = Math.round(this.value);
    }
    this.mode = newMode;
    this._emitChange();
  }

  private _toggleIntegerOnly(e: Event): void {
    if (this.mode === "radians") return;
    const checkbox = e.target as HTMLInputElement;
    this.integerOnly = checkbox.checked;
    if (this.integerOnly) {
      this._setValue(Math.round(this.value));
    }
  }

  /* ──────────────── Shared value setter ──────────────── */

  private _setValue(raw: number): void {
    const a = new Angle(raw, this.mode);
    this.value = a.angle;
    this._emitChange();
  }

  private _emitChange(): void {
    this.dispatchEvent(
      new CustomEvent("angle-change", {
        detail: { value: this.value, mode: this.mode, angle: this._angle },
        bubbles: true,
        composed: true,
      })
    );
  }

  /* ──────────────── Computed getters ──────────────── */

  /** Expose the current Angle instance (read-only). */
  get angle(): Angle {
    return this._angle;
  }

  /** Current angle in radians regardless of display mode. */
  private get _radians(): number {
    return this._angle.toRadians();
  }

  /* ──────────────── SVG cadran rendering ──────────────── */

  private _renderTicks(mode:AngleType) {
    const ticks = [];
    const angleInterval = 5
    let totalTicks = 360 / angleInterval; // every 10°
    if (mode=="gradians") totalTicks = 400 / angleInterval
    for (let i = 0; i < totalTicks; i++) {
      const angleDeg = i * angleInterval;
      const rad = (angleDeg * Math.PI) / 180;
      const isMajor =  (mode=="gradians")?angleDeg % 45 === 0:angleDeg % 30 === 0;
      const innerR = isMajor ? this._majorTickInner : this._minorTickInner;
      const x1 = Math.cos(rad) * innerR;
      const y1 = -Math.sin(rad) * innerR;
      const x2 = Math.cos(rad) * (this._outerR);
      const y2 = -Math.sin(rad) * (this._outerR);
      ticks.push(svg`
        <line
          x1=${x1} y1=${y1} x2=${x2} y2=${y2}
          class=${isMajor ? "tick-major" : "tick-minor"}
        />
      `);
    }
    return ticks;
  }

  private _renderLabels() {
    let labelsData;
    if (this.mode === "degrees") {
      labelsData = [
        { angle: 0, text: "0°" },
        { angle: 90, text: "90°" },
        { angle: 180, text: "180°" },
        { angle: 270, text: "270°" },
      ];
    } else if (this.mode === "gradians") {
      labelsData = [
        { angle: 0, text: "0g" },
        { angle: 90, text: "100g" },
        { angle: 180, text: "200g" },
        { angle: 270, text: "300g" },
      ];
    } else {
      labelsData = [
        { angle: 0, text: "0" },
        { angle: 90, text: "π/2" },
        { angle: 180, text: "π" },
        { angle: 270, text: "3π/2" },
      ];
    }

    return labelsData.map(({ angle, text }) => {
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * this._labelR;
      const y = -Math.sin(rad) * this._labelR;
      return svg`<text x=${x} y=${y} class="label" dominant-baseline="central" text-anchor="middle">${text}</text>`;
    });
  }

  private _renderArc() {
    const r = this._outerR;
    const rad = this._radians;
    if (rad < 0.001) return svg``;

    const largeArc = rad > Math.PI ? 1 : 0;
    const endX = Math.cos(rad) * r;
    const endY = -Math.sin(rad) * r;

    return svg`
      <path
        d="M 0 0 L ${r} 0 A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY} Z"
        class="arc-sector"
      />
    `;
  }

  private _renderIndicator() {
    const rad = this._radians;
    const x = Math.cos(rad) * this._outerR;
    const y = -Math.sin(rad) * this._outerR;
    return svg`
      <line x1="0" y1="0" x2=${x} y2=${y} class="indicator-line" />
      <circle
        cx=${x} cy=${y} r=${this._handleR}
        class="handle ${this._dragging ? "dragging" : ""}"
        @pointerdown=${this._startDragging}
      />
    `;
  }

  /* ──────────────── Styles ──────────────── */

  static override styles = css`
    :host {
      --accent-from: #7c3aed;
      --accent-to: #06b6d4;
      --bg-card: rgba(15, 15, 25, 0.85);
      --bg-surface: rgba(30, 30, 50, 0.6);
      --border-subtle: rgba(255, 255, 255, 0.08);
      --text-primary: #f0f0f5;
      --text-secondary: rgba(240, 240, 245, 0.6);
      --handle-glow: rgba(124, 58, 237, 0.5);

      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      font-family: "Inter", system-ui, -apple-system, sans-serif;
      color: var(--text-primary);
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border-radius: 20px;
      background: var(--bg-card);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border-subtle);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.04) inset;
    }

    /* ── SVG Cadran ── */
    .cadran-wrapper {
      cursor: crosshair;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }

    .cadran-bg {
      fill: var(--bg-surface);
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 1.5;
    }

    .tick-major {
      stroke: rgba(255, 255, 255, 0.35);
      stroke-width: 1.5;
      stroke-linecap: round;
    }

    .tick-minor {
      stroke: rgba(255, 255, 255, 0.15);
      stroke-width: 0.8;
      stroke-linecap: round;
    }

    .label {
      fill: var(--text-secondary);
      font-size: 11px;
      font-weight: 500;
      font-family: "Inter", system-ui, sans-serif;
    }

    .arc-sector {
      fill: url(#arcGradient);
      opacity: 0.3;
    }

    .indicator-line {
      stroke: url(#lineGradient);
      stroke-width: 2;
      stroke-linecap: round;
    }

    .handle {
      fill: var(--accent-from);
      stroke: white;
      stroke-width: 2;
      cursor: grab;
      filter: drop-shadow(0 0 6px var(--handle-glow));
      transition: filter 0.15s ease;
    }

    .handle:hover,
    .handle.dragging {
      filter: drop-shadow(0 0 12px var(--handle-glow));
      cursor: grabbing;
    }

    .center-dot {
      fill: rgba(255, 255, 255, 0.5);
    }

    .zero-line {
      stroke: rgba(255, 255, 255, 0.12);
      stroke-width: 0.8;
      stroke-dasharray: 4 3;
    }

    /* ── Mode Toggle ── */
    .toggle-row {
      display: flex;
      gap: 0;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }

    .toggle-btn {
      padding: 8px 20px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-family: "Inter", system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.25s ease;
      text-transform: uppercase;
    }

    .toggle-btn:hover {
      color: var(--text-primary);
    }

    .toggle-btn.active {
      background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
      color: white;
      box-shadow: 0 2px 12px rgba(124, 58, 237, 0.4);
    }

    /* ── Numeric Input ── */
    .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .angle-input {
      width: 110px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-primary);
      font-family: "Inter", system-ui, sans-serif;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      -moz-appearance: textfield;
    }

    .angle-input::-webkit-outer-spin-button,
    .angle-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .angle-input:focus {
      border-color: var(--accent-from);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
    }

    .unit-suffix {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      min-width: 28px;
    }

    /* ── Switch Toggle ── */
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 10px;
    }

    .switch-label {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.1);
      transition: .3s;
      border-radius: 24px;
      border: 1px solid var(--border-subtle);
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 2px;
      background-color: var(--text-primary);
      transition: .3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    input:checked + .slider {
      background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
      border-color: transparent;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px var(--accent-from);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
      background-color: white;
    }
  `;

  /* ──────────────── Template ──────────────── */

  override render() {
    const isIntMode = this.mode !== "radians" && this.integerOnly;
    const displayValue = this.mode === "radians"
        ? parseFloat(this.value.toFixed(4))
        : parseFloat(this.value.toFixed(isIntMode ? 0 : 2));

    const step = this.mode === "radians" ? 0.01 : 1;
    const suffix = this.mode === "degrees" ? "°" : (this.mode === "gradians" ? "grad" : "rad");
    const max = this.mode === "degrees" ? 360 : (this.mode === "gradians" ? 400 : 2 * Math.PI);

    return html`
      <div class="card">
        <!-- SVG Cadran -->
        <svg
          id="cadran"
          class="cadran-wrapper"
          width="${this.size}"
          height="${this.size}"
          viewBox="-100 -100 200 200"
          @pointerdown=${this._onCadranClick}
        >
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c3aed" />
              <stop offset="100%" stop-color="#06b6d4" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7c3aed" />
              <stop offset="100%" stop-color="#06b6d4" />
            </linearGradient>
          </defs>

          <!-- Background circle -->
          <circle cx="0" cy="0" r="${this._outerR}" class="cadran-bg" />

          <!-- Dashed zero-reference line (3 o'clock) -->
          <line x1="0" y1="0" x2="${this._outerR}" y2="0" class="zero-line" />

          <!-- Tick marks -->
          ${this._renderTicks(this.mode)}

          <!-- Labels -->
          ${this._renderLabels()}

          <!-- Arc sector -->
          ${this._renderArc()}

          <!-- Indicator line + handle -->
          ${this._renderIndicator()}

          <!-- Center dot -->
          <circle cx="0" cy="0" r="3" class="center-dot" />
        </svg>

        <!-- Mode Toggle -->
        <div class="toggle-row">
          <button
            class="toggle-btn ${this.mode === "degrees" ? "active" : ""}"
            @click=${() => this._setMode("degrees")}
          >
            DEG
          </button>
          <button
            class="toggle-btn ${this.mode === "radians" ? "active" : ""}"
            @click=${() => this._setMode("radians")}
          >
            RAD
          </button>
          <button
            class="toggle-btn ${this.mode === "gradians" ? "active" : ""}"
            @click=${() => this._setMode("gradians")}
          >
            GRAD
          </button>
        </div>

        <!-- Integer-Only Switch (Degrees/Gradians Mode Only) -->
        ${this.mode !== "radians" ? html`
          <div class="switch-row">
            <span class="switch-label">Integer values only</span>
            <label class="switch">
              <input type="checkbox" .checked=${this.integerOnly} @change=${this._toggleIntegerOnly} ?disabled=${this.disabled}>
              <span class="slider"></span>
            </label>
          </div>
        ` : ''}

        <!-- Numeric Input -->
        <div class="input-row">
          <input
            id="angle-value-input"
            class="angle-input"
            type="number"
            min="0"
            max="${max}"
            step="${step}"
            .value="${String(displayValue)}"
            @input=${this._onInputChange}
            ?disabled=${this.disabled}
          />
          <span class="unit-suffix">${suffix}</span>
        </div>
      </div>
    `;
  }
}

/* Register the custom element manually (no @customElement decorator) */
customElements.define("geom-angle-input", GeomAngleInput);

declare global {
  interface HTMLElementTagNameMap {
    "geom-angle-input": GeomAngleInput;
  }
}
