import Angle from './Angle'
import Point from "./Point.ts";
export function setupDrawPetals(element: HTMLDivElement) {
  const drawPetals = (svgPolylineId:string, petalLengthInput:HTMLInputElement, petalNumberInput:HTMLInputElement) => {
    const petalLength = parseFloat(petalLengthInput.value)
    const petalNumber = parseInt(petalNumberInput.value)
    const svg = document.querySelector<SVGSVGElement>('svg')!
    const svgWidth = svg.clientWidth
    const svgHeight = svg.clientHeight
    const svgCenterX = svgWidth / 2
    const svgCenterY = svgHeight / 2
    const angleStep = 360 / petalNumber
    const points = []
    for (let i = 0; i < petalNumber; i++) {
      const angle = i * angleStep
      const x = svgCenterX + petalLength * Math.sin(angle * Math.PI / 180)
      const y = svgCenterY + petalLength * Math.cos(angle * Math.PI / 180)
      points.push(`${x},${y}`)
    }
    let coordinatesString = '' // to accumulate the points coordinates
    // let's center the drawing on the svg
    const offsetX = svgCenterX
    const offsetY = svgCenterY
    console.log(`PetalCount : ${petalNumber}`)
    // let's iterate over a full 360 degree circle
    for (let angle = 0; angle < 360; angle += 1) {
      const myAngle = new Angle(angle, 'degrees')
      let radius = petalLength * Math.sin(petalNumber * myAngle.toRadians())
      let TempPoint = Point.fromPolar(radius, myAngle, `P-${angle}`)
      // and move the point so it's centered
      TempPoint.moveRel(offsetX,offsetY)
      coordinatesString += TempPoint.toString(',', false)  + ' '
      //console.log(`angle : ${angle}, radius ${radius} : ${TempPoint.toString(',')}`)
    }

    const msg = document.querySelector<HTMLParagraphElement>('#petal-msg')!
    msg.innerHTML = `Here is a nice petal's flower, of length: ${petalLength}. <br>  Using this polar equation :<br>
                      <strong>r = ${petalLength} x sin( ${petalNumber} θ) </strong>`

    const polyline = document.querySelector<SVGPolylineElement>(`#${svgPolylineId}`)!
    polyline.setAttribute('points', coordinatesString)
  }

  element.innerHTML = `
  <button id="drawPetals" type="button">Draw petals</button>
  <input type="number" id="petals-number" min="1" max="30" value="6" placeholder="number of petals ">
  <input type="number" id="petals-length" min="50" max="300" value="250" placeholder="length of petals ">
  <p id="petal-msg" class="read-the-docs">
      
   </p>
  `

  const buttonDraw = document.querySelector<HTMLButtonElement>('#drawPetals')!
  const inputPetalNumber = document.querySelector<HTMLInputElement>('#petals-number')!
  const inputPetalLength = document.querySelector<HTMLInputElement>('#petals-length')!
  buttonDraw.addEventListener('click', () => drawPetals("my-polyline", inputPetalLength, inputPetalNumber))
}
