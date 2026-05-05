import "../src/geom-angle-input.ts";

const el = document.getElementById("angle1")!;
const outDeg = document.getElementById("out-deg")!;
const outRad = document.getElementById("out-rad")!;
const outGrad = document.getElementById("out-grad")!;
const outMode = document.getElementById("out-mode")!;

el.addEventListener("angle-change", ((e: CustomEvent) => {
  const { angle, mode } = e.detail;
  outDeg.textContent = angle.toDegrees().toFixed(2) + "°";
  outRad.textContent = angle.toRadians().toFixed(4) + " rad";
  outGrad.textContent = angle.toGradians().toFixed(2) + " grad";
  outMode.textContent = mode;
}) as EventListener);
