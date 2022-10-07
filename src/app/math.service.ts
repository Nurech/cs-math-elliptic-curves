import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  /**
   * Build straight line function for P -> Q
   * Find the slope m (y1 - y2) / (x1 - x2)
   * Simplify to slope-intercept y = mx + b
   */
  fnPQ(x1: number, y1: number, x2: number, y2: number) {
    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - (m * x1);
    return m + '*x + ' + b;
  }

  /**
   * Weierstrass curve y²=x³+ax+b
   * To get rid of pow we sqrt right side
   */
  fnCurve(a: number, b: number) {
    return 'sqrt(x^3+' + a + 'x+' + b + ')';
  }


  /**
   * Find R from P -> Q on the curve, addition law
   * P=(x1,y1), Q=(y1,y2), R=(x,y3)
   */
  fnR() {

  }

}
