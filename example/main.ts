import "../src/style/skeleton.css";
import "../src/style/style.css";

// @ts-ignore
import { setupDrawPetals } from "./drawPetals.tsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>    
    <h3>simple 2d geometry !</h3>
    <div id="flower-div">  
    </div>    
  </div>
`;
setupDrawPetals(document.querySelector("#flower-div")!);
