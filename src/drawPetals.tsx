import Angle from './Angle'
import Point from "./Point.ts";
export function setupDrawPetals(element: HTMLDivElement) {

  function calcPetalsCoordinates(petalNumber: number, petalLength: number) {
    const svg = document.querySelector<SVGSVGElement>('svg')!
    const svgWidth = svg.clientWidth
    const svgHeight = svg.clientHeight
    const svgCenterX = svgWidth / 2
    const svgCenterY = svgHeight / 2
    let coordinatesString = '' // to accumulate the points coordinates
    // let's center the drawing on the svg
    const offsetX = svgCenterX
    const offsetY = svgCenterY
    console.log(`PetalCount : ${petalNumber}`)
    for (let angle = 0; angle <= 360; angle += 1) {
      const myAngle = new Angle(angle, 'degrees')
      let radius = petalLength * (2 + 2 * Math.cos(petalNumber * myAngle.toRadians()))
      let TempPoint = Point.fromPolar(radius, myAngle, `P-${angle}`)
      // and move the point so it's centered
      TempPoint.moveRel(offsetX, offsetY)
      coordinatesString += TempPoint.toString(',', false) + ' '
    }
    return coordinatesString;
  }

//draw an svg flower with then number of given petals
  const drawPetals = (svgPolylineId:string, petalLengthInput:HTMLInputElement, petalNumberInput:HTMLInputElement) => {
    const petalLength = parseFloat(petalLengthInput.value)
    const petalNumber = parseInt(petalNumberInput.value)
    let coordinatesString = calcPetalsCoordinates(petalNumber, petalLength);
    const msg = document.querySelector<HTMLParagraphElement>('#petal-msg')!
    msg.innerHTML = `Here is a nice petal's flower. <br>  Using this polar equation :<br>
                      <strong>r = ${petalLength} x (2 + 2 x cos( ${petalNumber} x θ)) </strong>`
    const polyline = document.querySelector<SVGPolylineElement>(`#${svgPolylineId}`)!
    polyline.setAttribute('points', coordinatesString)
  }

  // main html content for the flower component
  element.innerHTML = `
  <button id="drawPetals" type="button">re-draw the flower</button>
  <input type="number" id="petals-number" min="1" max="30" value="6" placeholder="number of petals ">
  <input type="number" id="petals-length" min="50" max="60" value="45" placeholder="length of petals ">
  <p id="petal-msg" class="read-the-docs"></p>
  <div id="svgcontainer" class="svg-container">
    <svg height="500" width="500" >
      <line id='xaxis' x1="250" y1="0" x2="250" y2="500" class="svgaxis"/>
      <line id='yaxis' x1="0" y1="250" x2="500" y2="250" class="svgaxis"/>
      <polyline id='my-polyline' points="0,0 " class="svg-flower-petal"/>
      <circle cx="250" cy="250" r="40" class="svg-flower-center"/>
    </svg>
  `

  const buttonDraw = document.querySelector<HTMLButtonElement>('#drawPetals')!
  const inputPetalNumber = document.querySelector<HTMLInputElement>('#petals-number')!
  const inputPetalLength = document.querySelector<HTMLInputElement>('#petals-length')!
  // draw the flower when the button is clicked
  buttonDraw.addEventListener('click', () => drawPetals("my-polyline", inputPetalLength, inputPetalNumber))
  // draw the flower when the page is loaded
    drawPetals("my-polyline", inputPetalLength, inputPetalNumber)
}
