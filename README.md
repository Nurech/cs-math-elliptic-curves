# ITC8190 Mathematics for Computer Science Personal project application

Based on your application, your task is to implement elliptic curve points over a finite field class. To get maximum points for this task you need:
1. Implement point addition operation.
2. Implement scalar multiplication for a given point.
3. Function that finds order of the elliptic curve group
4. Provide a basic documentation for the code or answer my questions about how code works in person.

## Live site

https://cs-math-elliptic-curve-points.web.app

## How program works:

When user loads the program 3 graphs are generated with (function plotter) which
have starting functions with initial values. Function parameters are configurable
via UI which change variables that turn to math service for computation. Variables can be copied to allow sharing of settings.

Program code is designed to be slightly "dumb" - to not use overly clever
syntax and keep code flow readable. Interesting part happens in math.service.ts,
rest of the code is just semantics and UI stuff.

UI controls should be intuitive, follow color coding for lines.
Graph can be dragged and zoomed. Hovering over functions shows cords.

Error level messages indicates errors that should not happen.
Warning levels indicate something went wrong, but was corrected for the user.
Information level messages are just informative that something special happened in background.
```
  Flow: Element(UI input) <───> functionPlot(Fn)
                └───────────────────┴─── variables <───> math.service.ts
```
## How math service works:

Each element on a graph is a function (solving for y or cords etc.).
Graph functions (lines, curves, points) ask computation from match service.
Calculation is relative, meaning change to P->Q will reflect on R.
Some edge cases are covered (stopping user going out of bounds for x, when Q=P, selecting closest x root etc.)
Calculations are here: 
* https://github.com/Nurech/cs-math-elliptic-curves/blob/master/src/app/math.service.ts

## Notes:

Due to limitations of calculating from geometric method to algebraic method
Accuracy on chart is around ~ > .0001
Computational and performance wise lower decimal points may be rounded for plotting which introduces errors.
Hence, you may notice line thickening on graph that happens due to inaccuracy.
Meaning R on the plotter is on Curve with 99.9999% accuracy (or better).


Cool implementation of custom method logger using decorator @Log()
* https://github.com/Nurech/cs-math-elliptic-curves/blob/master/src/app/decorators/logger.ts

## Sources:

* Plotter - https://mauriciopoppe.github.io/function-plot/
* Source - http://pi.math.cornell.edu/~dwh/courses/M403-S03/cubics.htm
* Source - http://www.math.utah.edu/~wortman/1060text-tcf.pdf
* Source - https://medium.com/understanding-ecc/understanding-the-ellyptic-curve-cryptography-d91c11e4e331
* Source - https://bearworks.missouristate.edu/cgi/viewcontent.cgi?article=4697&context=theses
* Source - https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/
* Funny - https://eprint.iacr.org/2013/635.pdf




### press F12 to inspect logging
```javascript
Logged inputs fnCurve: a:-7,b:10 Logged outputs fnCurve: sqrt(x^3+-7x+10)
logger.ts:38 Logged inputs fnCurve: a:-7,b:10 Logged outputs fnCurve: sqrt(x^3+-7x+10)
logger.ts:38 Logged inputs fnPQ: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnPQ: 1*x+1
logger.ts:38 Logged inputs fnPQi: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnPQi: (2) [-3, -2]
logger.ts:38 Logged inputs fnR: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnR: (2) [-3, 2]
logger.ts:38 Logged inputs fnPQi: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnPQi: (2) [-3, -2]
logger.ts:38 Logged inputs fnRv: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnRv: (2) [0, 4]
logger.ts:38 Logged inputs fnPQi: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnPQi: (2) [-3, -2]
logger.ts:38 Logged inputs fnPQi: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnPQi: (2) [-3, -2]
logger.ts:38 Logged inputs fnR: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnR: (2) [-3, 2]
logger.ts:38 Logged inputs fnPQi: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnPQi: (2) [-3, -2]
logger.ts:38 Logged inputs fnR: x1:1,y1:2, x2:3, y2:4, a:-7 Logged outputs fnR: (2) [-3, 2]
...
```

_________________

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
