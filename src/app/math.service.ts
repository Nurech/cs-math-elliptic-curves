import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Log } from './decorators/logger';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor(private messageService: MessageService) {}

  /**
   * Straight line function for P -> Q
   * Find the slope m (y1 - y2) / (x1 - x2)
   * Simplify to slope-intercept y = mx + b
   */
  @Log()
  fnPQ(x1: number, y1: number, x2: number, y2: number, a: number) {
    let m = (y2 - y1) / (x2 - x1);
    if (x1 === x2 && y1 === y2) {
      m = (3 * Math.pow(x1, 2)) + a / 2 * y1;
    }
    let b = y1 - (m * x1);
    return m + '*x+' + b;
  }

  /**
   * fnPQi is where P and Q intersect the curve
   * Find R- from P -> Q on the curve, addition law
   * P=(x1,y1), Q=(x1,y2), R-=(x3,y3)
   */
  @Log()
  fnPQi(x1: number, y1: number, x2: number, y2: number, a: number): number[] {
    if (x1 === x2 && y1 === y2) {
      return this.fnR0(x1, y1, x2, a);
    } else {
      let m = (y2 - y1) / (x2 - x1);
      let x3 = m * m - x1 - x2;
      let y3 = y1 + m * (x3 - x1);
      return [x3, y3];
    }
  }

  /**
   * Find R. R = y3' is the invert of y3 from fnPQi.
   * So we just * -1 the y3.
   */
  @Log()
  fnR(x1: number, y1: number, x2: number, y2: number, a: number) {
    let fnPQi = this.fnPQi(x1, y1, x2, y2, a);
    return [fnPQi[0], fnPQi[1] * -1];
  }

  /**
   * This is the same as above but for plotter only
   * For drawing the vector (line) from PQi -> R. PQi is basically R-
   * Because plotter is using offset to draw vector we leave x = 0, and do * -2 for the y.
   */
  @Log()
  fnRv(x1: number, y1: number, x2: number, y2: number, a: number) {
    let fnPQi = this.fnPQi(x1, y1, x2, y2, a);
    return [0, fnPQi[1] * -2];
  }

  /**
   * Special case when P = Q. One might assume infinity but noooo......
   * Equation for R will be same, but we need to find slope m differently
   * R = 3 * x1² + a / 2 * y1
   */
  @Log()
  fnR0(x1: number, y1: number, x2: number, a: number) {
    let m = (3 * Math.pow(x1, 2)) + a / 2 * y1;
    let x3 = m * m - x1 - x2;
    let y3 = y1 + m * (x3 - x1);
    return [x3, y3];
  }

  /**
   * Weierstrass curve y²=x³+ax+b
   * To get rid of pow on y² we sqrt right side
   * functionPlot has trouble using implicit functions, so we simplify
   * For graph we just input the function, for fnY we calculate y
   */
  @Log()
  fnCurve(a: number, b: number): any {
    return 'sqrt(x^3+' + a + 'x+' + b + ')';
  }

  /**
   * Solve curve for fnY we calculate y directly (same as above fnCurve) but we input x for y
   * Conundrum here is a situation where N^0 should always be 1 but 0^N should always be 0 for N > 0
   */
  @Log()
  fnY(a: number, b: number, x: number): any {
    return Math.sqrt(Math.pow(x, 3) + a * x + b);
  }

  /**
   * On increment to P(x,y) or Q(x,y) we re-calculate cords so that points always stay on curve
   * This is for UX mostly but makes sense to do it...
   */
  @Log()
  reCalcPQy(a: number, b: number, x: number) {
    return this.fnY(a, b, x);
  }

  /**
   * At times, we need to check for special cases,
   * e.g. when user is trying to move P or Q out of bounds (this will result in NaN or infinity)
   * So we don't allow that to happen
   */
  @Log()
  reCalcPQx(a: number, b: number, x1: any, x2: any, y1: any, y2: any) {
    //TODO solve Infinty somewhere (when y1 === y2)
    let xMin = this.fnX0(a, b);
    if (x1 !== null && xMin - x1 >= 0) {
      console.warn('Px too small it cant go out of bounds ', xMin - x1);
      this.showWarn('Px too small! rounding to root...');
      return this.fnX(a, b, y1, x1);
    }

    if (x2 !== null && xMin - x2 >= 0) {
      console.warn('Qx too small it cant go out of bounds ', xMin - x2);
      this.showWarn('Qx too small! rounding to root...');
      return this.fnX(a, b, y2, x2);
    }

    // All good
    if (x1 !== null) {
      return this.fnX(a, b, y1, x1);
    } else {
      return this.fnX(a, b, y2, x2);
    }
  }

  /**
   * Calc for x cubic. We need to re-calculate x when user is moving y-cord where curve is y²=x³+ax+b
   * Calculate for x, quadratic equation in fnX3() and pick the right root.
   * http://www.math.utah.edu/~wortman/1060text-tcf.pdf
   * http://pi.math.cornell.edu/~dwh/courses/M403-S03/cubics.htm
   * https://en.wikipedia.org/wiki/Cubic_function#Roots_of_a_cubic_function
   */
  fnX(a: number, b: number, y: number, prevX: number) {
    let roots = this.fnX3(a, b - y * y);
    let distances = roots.map((x) => {
      return Math.abs(x - prevX);
    });
    let closest = Math.min.apply(null, distances);

    let newX = roots[distances.indexOf(closest)];
    let minX = this.fnX0(a, b);
    if (minX - newX >= 0) { // don't let x go out of bounds
      newX = minX;
    }
    return newX;
  }


  /**
   * We find x locations on curve. As y changes x could be in 3 or 1 places (either it's cubic or not)
   * So when y changes x could go +/- either root would be equally valid.
   * So we jump x to the nearest valid root relative to last location.
   * We solve x^3 + ax + b = 0
   * So this is much like fnX0() finds lowest - why have both?
   * Because fnX3() finds roots for the point with y, fnX0() just finds the absolute location of the curve on x=0;
   * x... is a complicated a.k.a. complex number.
   */
  fnX3(a: number, b: number) {
    let t;
    let s;
    let roots = []; // store results
    a = a / 3;
    b = -b / 2;
    let dComplex = Math.pow(a, 3) + Math.pow(b, 2);


    if (dComplex < 0) { // it's on 3 places
      s = Math.acos(b / Math.sqrt(-a * a * a));
      t = 2 * Math.sqrt(-a);
      roots = [
        t * Math.cos(s / 3),
        t * Math.cos((s + 2 * Math.PI) / 3),
        t * Math.cos((s + 4 * Math.PI) / 3)
      ];
    } else if (dComplex > 0) { // it's on one place
      s = Math.cbrt(b + Math.sqrt(dComplex));
      t = Math.cbrt(b - Math.sqrt(dComplex));
      roots = [s + t];
    } else { // should not happen by a long shot...
      roots = [
        2 * Math.cbrt(b),
        Math.cbrt(-b)
      ];
      console.error('x has two roots!?',roots)
      this.showError('x has two roots!?');
    }
    return roots;
  }

  /**
   * Curve left side x min - this is the point we can't let Q or P over, or it will go outside of domain;
   * Solution from WolframAlpha https://tinyurl.com/3mt5wvzh simplified by hand
   *
   * JavaScript can't handle more than 16 decimal places, so I round to 15 decimal places
   * Using more e.g. 1.1102230246251565E-16 will throw errors
   * https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type
   *
   * Also worth noting, that due this small rounding, eventually will throw cords offset,
   * but worry not, as are program basically self corrects so that cords still match up.
   *
   */
  @Log()
  fnX0(a: number, b: number) {
    let s = Math.sqrt(12 * a * a * a + 81 * b * b);
    let s2 = s - 9 * b;
    let xMin = Math.cbrt(s2 / 18) - Math.cbrt(2 / 3 / s2) * a;
    xMin = this.round(xMin, 15); //TODO make sure round is down
    return xMin;
  }

  round(value: number, decimals: number) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  showError(message: string) {
    this.messageService.add({severity: 'error', summary: 'Error', detail: message, sticky: false, life: 4000});
  }

  showInfo(message: string) {
    this.messageService.add({severity: 'info', summary: 'Info', detail: message, sticky: false, life: 4000});
  }

  showWarn(message: string) {
    this.messageService.add({severity: 'warn', summary: 'Warning', detail: message, sticky: false, life: 4000});
  }
}
