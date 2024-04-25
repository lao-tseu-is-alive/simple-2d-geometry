import  './style/skeleton.css'
import './style/style.css'

import {setupDrawPetals} from "./drawPetals.tsx";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>    
    <h3>simple 2d geometry</h3>
    <div id="petals-div" class="card">  
    </div>    
  </div>
`
setupDrawPetals(document.querySelector('#petals-div')!)


