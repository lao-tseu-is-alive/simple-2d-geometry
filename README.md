# simple-2d-geometry

[![CI-Unit-Tests](https://github.com/lao-tseu-is-alive/simple-2d-geometry/actions/workflows/npm-test.yml/badge.svg)](https://github.com/lao-tseu-is-alive/simple-2d-geometry/actions/workflows/npm-test.yml)
[![codecov](https://codecov.io/gh/lao-tseu-is-alive/simple-2d-geometry/branch/main/graph/badge.svg)](https://codecov.io/gh/lao-tseu-is-alive/simple-2d-geometry)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=lao-tseu-is-alive_simple-2d-geometry&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=lao-tseu-is-alive_simple-2d-geometry)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=lao-tseu-is-alive_simple-2d-geometry&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=lao-tseu-is-alive_simple-2d-geometry)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=lao-tseu-is-alive_simple-2d-geometry&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=lao-tseu-is-alive_simple-2d-geometry)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=lao-tseu-is-alive_simple-2d-geometry&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=lao-tseu-is-alive_simple-2d-geometry)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=lao-tseu-is-alive_simple-2d-geometry&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=lao-tseu-is-alive_simple-2d-geometry)



A Simple 2D Geometry Library with Point and Line classes written with TypeScript

This projects code is licensed under the terms of the [GNU GPL-3.0 license](https://www.gnu.org/licenses/quick-guide-gplv3.html).


### to run the library in an example page:  
```bash
npm run dev
```

#### this will start a local server and open the example page in your default browser
here is an excerpt of the code in drawPetal.tsx that creates a 6 petals flower using the Point class from the library.
```typescript
    ...
    const myAngle = new Angle(angle, 'degrees')
    let radius =  petalLength * (2 + 2 * Math.cos(petalNumber * myAngle.toRadians()))
    let TempPoint = Point.fromPolar(radius, myAngle, `P-${angle}`)
    // and move the point so it's centered
    TempPoint.moveRel(offsetX,offsetY)
    ...
```

![alt text](https://raw.githubusercontent.com/lao-tseu-is-alive/simple-2d-geometry/main/images/simple-2d-geometry_example_polar_equation_flower.png "Using the Point class to create a nice 6 petal's flowers from a polar equation")
