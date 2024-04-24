import  './style/skeleton.css'
import './style/style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>    
    <h3>2dGeom</h3>
    <div class="card">
      <button id="counter" type="button">Add petals</button>
    </div>
    <p class="read-the-docs">
      Now let's create a nice 12 petal's flowers using this polar equation :<br> <strong>r = a sin 6θ </strong>
    </p>
  </div>
`

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)


