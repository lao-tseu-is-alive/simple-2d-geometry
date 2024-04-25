import  './style/skeleton.css'
import './style/style.css'

// @ts-ignore
import {setupDrawPetals} from './drawPetals';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>    
    <h3>simple 2d geometry</h3>
    <div id="flower-div">  
    </div>    
  </div>
`
setupDrawPetals(document.querySelector('#flower-div')!)


