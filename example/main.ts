// @ts-ignore
import { setupDrawPetals } from "./drawPetals.tsx";
// @ts-ignore
import { setupDriverDemo } from "./driverDemo.tsx";
import {APP, BUILD_DATE, VERSION} from "../src";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>    
    <h3>simple 2d geometry</h3>

    <h4>🎨 RenderDriver Pattern Demo</h4>
    <p class="read-the-docs">
      SVG generated entirely from code using <code>Feature</code> + <code>DrawingBoard</code> + <code>SVGRenderDriver</code>
    </p>
    <div id="driver-demo"></div>

    <hr>

    <h4>🌸 Polar Equation Flower</h4>
    <p class="read-the-docs">
      Classic example using <code>Point.fromPolar()</code> and <code>Angle</code> math
    </p>
    <div id="flower-div"></div>
  </div>
`;

setupDriverDemo(document.querySelector("#driver-demo")!);
setupDrawPetals(document.querySelector("#flower-div")!);
console.log(`loaded ${APP} v${VERSION}, ${BUILD_DATE}`)
