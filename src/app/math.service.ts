import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  /**
   * How program works:
   *
   * When user loads the program 3 graphs are generated with (function plotter) which
   * have starting functions with initial values. When new elements are added to graph,
   * element (containing function) is started with random values. Function parameters are configurable
   * via UI which change variables that turn to math service for computation.
   *
   * Program code is designed to be slightly "dumb" - to not use overly clever
   * syntax and keep code flow readable. Interesting part happens in math.service.ts,
   * rest of the code is just semantics and UI stuff.
   *
   * UI controls should be intuitive, follow color coding for lines.
   * Graph can be dragged and zoomed. Hovering over functions shows cords.
   *
   * Flow: Element(UI input) <───> functionPlot(Fn)
   *               └───────────────────┴─── variables <───> math.service.ts
   *
   * How math service works:
   *
   * Each element on a graph is a function (solving for y or cords etc.).
   * Graph functions (lines, curves, points) ask computation from match service.
   * Calculation is interchangeable, meaning change to P->Q will do R as R will for P->Q
   *
   * Notes:
   *
   * Due to limitations of calculating from geometric method to algebraic method
   * Accuracy on chart is around ~ > .0001
   * Computational and performance wise lower decimal points may be rounded for plotting which introduces errors.
   * Hence, you may notice line thickening on graph that happens due to inaccuracy.
   * https://user-images.githubusercontent.com/20840114/194465045-e543f696-dc45-4aed-baea-cf2a5ad050b6.png
   *
   * Plotter - https://mauriciopoppe.github.io/function-plot/
   * Source - https://medium.com/understanding-ecc/understanding-the-ellyptic-curve-cryptography-d91c11e4e331
   * Source - https://bearworks.missouristate.edu/cgi/viewcontent.cgi?article=4697&context=theses
   * Source - https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/
   * Funny - https://eprint.iacr.org/2013/635.pdf
   */

  /**
   * Straight line function for P -> Q
   * Find the slope m (y1 - y2) / (x1 - x2)
   * Simplify to slope-intercept y = mx + b
   */
  fnPQ(x1: number, y1: number, x2: number, y2: number, a: number) {
    let m = (y2 - y1) / (x2 - x1);
    if (x1 === x2 && y1 === y2) {
      m = (3 * Math.pow(x1, 2)) + a / 2 * y1;
    }
    let b = y1 - (m * x1);
    let fnPQ = m + '*x + ' + b;
    console.log('fnPQ: ', fnPQ);
    return fnPQ;
  }

  /**
   * fnPQi is where P and Q intersect the curve
   * Find R from P -> Q on the curve, addition law
   * P=(x1,y1), Q=(x1,y2), R=(x3,y3)
   */
  fnPQi(x1: number, y1: number, x2: number, y2: number, a: number): number[] {
    if (x1 === x2 && y1 === y2) {
      return this.fnR0(x1, y1, x2, a);
    } else {
      let m = (y2 - y1) / (x2 - x1);
      let x3 = m * m - x1 - x2;
      let y3 = y1 + m * (x3 - x1);
      let fnPQi = [x3, y3];
      console.log('fnPQi: ', fnPQi);
      return fnPQi;
    }
  }

  /**
   * Find R. R = y3' is the invert of y3 from fnPQi.
   * So we just * -1 the y3.
   */
  fnR(x1: number, y1: number, x2: number, y2: number, a: number) {
    let fnPQi = this.fnPQi(x1, y1, x2, y2, a);
    let fnR = [fnPQi[0], fnPQi[1] * -1];
    console.log('fnR: ', fnR);
    return fnR;
  }

  /**
   * This is the same as above but for plotter only
   * For drawing the vector (line) from PQi -> R. PQi is basically R-
   * Because plotter is using offset to draw vector we leave x = 0, and do * -2 for the y.
   */
  fnRv(x1: number, y1: number, x2: number, y2: number, a: number) {
    let fnPQi = this.fnPQi(x1, y1, x2, y2, a);
    let fnRv = [0, fnPQi[1] * -2];
    console.log('fnRv: ', fnRv);
    return fnRv;
  }

  /**
   * Special case when P = Q. One might assume infinity but noooo......
   * Equation for R will be same, but we need to find slope m differently
   * R = 3 * x1² + a / 2 * y1
   */
  fnR0(x1: number, y1: number, x2: number, a: number) {
    let m = (3 * Math.pow(x1, 2)) + a / 2 * y1;
    let x3 = m * m - x1 - x2;
    let y3 = y1 + m * (x3 - x1);
    let fnR0 = [x3, y3];
    console.log('fnR0: ', fnR0);
    return fnR0;
  }

  /**
   * Weierstrass curve y²=x³+ax+b
   * To get rid of pow on y² we sqrt right side
   * functionPlot has trouble using implicit functions, so we simplify
   * For graph we just input the function, for fnY we calculate y
   */
  fnCurve(a: number, b: number): any {
    console.log('fnCurve is asked by plotter');
    return 'sqrt(x^3+' + a + 'x+' + b + ')';
  }

  /**
   * Solve curve for fnY we calculate y directly (same as above fnCurve) but we input x for y
   * Conundrum here is a situation where N^0 should always be 1 but 0^N should always be 0 for N > 0
   */
  fnY(a: number, b: number, x: number): any {
    // let hasError = this.checkForCaseWhen(a, b, x)
    // if (hasError) {
    //   return;
    // }
    if (x && a && b) {
      let fnY = Math.sqrt(Math.pow(x, 3) + a * x + b);
      console.log('fnY: ', fnY);
      return fnY;
    }
  }

  /**
   * On increment to P(x,y) or Q(x,y) we re-calculate cords so that points always stay on curve
   * This is for UX mostly but makes sense to do it...
   */
  reCalcPQy(a: number, b: number, x: number) {
    console.log('recalculating P,Q with reCalcPQy');
    return this.fnY(a, b, x);
  }
  // reCalcPQx(a: number, b: number, y: number) {
  //   console.log('recalculating P,Q with reCalcPQy');
  //   return this.fnY(a, b, y);
  // }

  /**
   * At times, we need to check for special cases,
   * e.g when user is trying to move P or Q out of bounds (this will result in NaN or infinity)
   * So we don't allow that to happen
   */
  checkForCaseWhen(a: number, b: number, x: number) {
    if (x >= a) {
      x = a-1;
      console.error('error x >= a')
      return false;
    }
    return true;
  }

  /**
   * Curve left side x
   */
  xMin() {
    // let min = sqrt(x^3+-7x+10)
  }
}
