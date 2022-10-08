# ITC8190 Mathematics for Computer Science Personal project application

Based on your application, your task is to implement elliptic curve points over a finite field class. To get maximum points for this task you need:
1. Implement point addition operation.
2. Implement scalar multiplication for a given point.
3. Function that finds order of the elliptic curve group
4. Provide a basic documentation for the code or answer my questions about how code works in person.



## How program works:

When user loads the program 3 graphs are generated with (function plotter) which
have starting functions with initial values. When new elements are added to graph,
element (containing function) is started with random values. Function parameters are configurable
via UI which change variables that turn to math service for computation.

Program code is designed to be slightly "dumb" - to not use overly clever
syntax and keep code flow readable. Interesting part happens in math.service.ts,
rest of the code is just semantics and UI stuff.

UI controls should be intuitive, follow color coding for lines.
Graph can drag and zoomed. Hovering over functions shows cords.

```
Element(UI input) ─── functionPlot(Fn)
└─────────────┴─── variables <───> math.service.ts
```

## How math service works:

Each element on a graph is a function (solving for y or cords etc.).
Graph functions (lines, curves, points) ask computation from match service.

math.service.ts - 

Notes:

You may notice line thickening on graph that happens due to inaccuracy
in rendering with plotter e.g fn: 'y^2-((x^3)+(-7x)+7)' (but it's only visual glitch).
https://user-images.githubusercontent.com/20840114/194465045-e543f696-dc45-4aed-baea-cf2a5ad050b6.png

* Plotter - https://mauriciopoppe.github.io/function-plot/
* Source - https://medium.com/understanding-ecc/understanding-the-ellyptic-curve-cryptography-d91c11e4e331
* Source - https://bearworks.missouristate.edu/cgi/viewcontent.cgi?article=4697&context=theses
* Source - https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/


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
