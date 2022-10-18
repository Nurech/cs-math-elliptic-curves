import { Injectable } from '@angular/core';
import { isNaN, isPrime } from 'mathjs';
import { UtilsService } from './utils.service';
import { Log } from './decorators/logger';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor(private utils: UtilsService) {}

  /**
   * Builds alternating 2d cords for lines representing the curve.
   * Because we are on a finite field we can't use implicit function for curve (limitation of plotter library)
   * Start building lines from left most edge. Cut line when reaches plotter xMax, invert
   * and continue.
   */
  @Log()
  fnLinePoints(p: number[], q: number[], a: number, plotterDims: PlotDims, k: number) {
    let m = (p[1] - q[1]) * this.fnInvertCord(p[0] - q[0], k); // Slope

    if (isNaN(m)) {
      if (p[1] === q[1]) { // When p is on top of q (this is not infinity actually, we still get intersection for R)
        m = (3 * p[0] * p[0] + a) * this.fnInvertCord(2 * p[1], k);
      } else { // This is a vertical line, py and qy on same y we get vertical line
        this.utils.showInfo('You found infinity for R! Vertical line on x: ' + p[0]);
        return [
          [p[0], plotterDims.yMin],
          [p[0], plotterDims.yMax]
        ];
      }
    }

    if (m === 0) { // If there is no slope, line is horizontal, though this should not happen
      return [
        [plotterDims.xMin, p[1]],
        [plotterDims.xMax, p[1]]
      ];
    }

    m = mod(m, k);

    if (m < 0 && -m > m + k) { // Slope is neg and neg slope is greater than slope with prime (increase slope)
      m += k;
    } else if (m > 0 && -m < m - k) { // Slope is pos and neg slope is smaller than slope without prime (decrease slope)
      m -= k;
    }

    let y;
    let x;
    let Q = p[1] - m * p[0]; // Not q that was passed in, it's a new q were getting
    let points = [];

    while (Q >= k) { // y = m * x + q, x = 0 is 0 <= y < k
      Q -= k;
    }
    while (Q < 0) {
      Q += k;
    }

    points.push([plotterDims.xMin, m * plotterDims.xMin + Q]);

    do {
      if (m > 0) { // If slope is positive line is y = m * x + q, while point is k = m * x + q
        y = k;
      } else { // Slope is negative for line  y = m * x + q then point is 0 = m * x + q
        y = 0;
      }
      x = (y - Q) / m;
      points.push([x, y]); // new point x
      points.push([x, y ? 0 : k]); // new point y
      if (m > 0) { // Slope pos
        Q -= k;
      } else { // Slope neg
        Q += k;
      }
    } while (x < k); // Make points until k number of points have been generated

    points.push([plotterDims.xMax, m * plotterDims.xMax + Q]);

    return points;
  }

  /**
   * When parameters change we recalculate points such that they would be on the curve
   * Otherwise points and curve is changes but Q, P are no-longer on it
   * So first we get all curve points[] again and apply delta change on all of them
   * and then choose the closest to out point change
   * E.g. user pressed -1 on x-axis. Closest -x is -3 away, but closest change is actually -1x, -1y to we jump on that.
   */
  @Log()
  fnRecalculatePQ(change: number[], prev: number[], curvePoints: number[][]) { // Either P or Q is passed in (just P for scalar)
    if (prev === undefined) {
      return change;
    }

    let xVal = change[0]; // new user input
    let yVal = change[1]; // new user input
    let prevX = prev[0];  // what it was before
    let prevY = prev[1];  // what it was before

    if (isNaN(xVal) || isNaN(yVal)) { // Input error
      this.utils.showError('Please enter a valid number');
      return [prevX, prevY];
    }

    let points: any[] = [];

    for (const p of curvePoints) { // Check validity if point depending on case
      if (xVal > prevX) {
        if (p[0] > prevX) { // x
          points.push(p);
        }
      } else if (xVal < prevX) {
        if (p[0] < prevX) { // x
          points.push(p);
        }
      } else if (yVal > prevY) {
        if (p[1] > prevY) { // y
          points.push(p);
        }
      } else if (yVal < prevY) {
        if (p[1] < prevY) { // y
          points.push(p);
        }
      } else { // a, b or k changed
        points.push(p);
      }
    }

    if (points.length === 0) {
      if (this.fnIsPointOnCurve(prevX, prevY, curvePoints)) { // No nearby points, prev point stays
        xVal = prevX;
        yVal = prevY;
        return [prevX, prevY];
      }

      points = curvePoints; // No points but the parameters might have changed

      if (points.length === 0) { // Should not happen, return
        return [prevX, prevY];
      }
    }

    let distances = points.map((p) => {
      const dX = xVal - p[0]; // Delta change on x
      let dY = yVal - p[1]; // Delta change on y
      return dX * dX + dY * dY;
    });
    const lowest = Math.min.apply(null, distances);
    let p = points[distances.indexOf(lowest)]; // Assign p to lowest of possible distances

    xVal = p[0];
    yVal = p[1];

    return [p[0], p[1]];
  }

  /**
   * Returns array of cords to represent points (P) on the curve.
   * Yellow diagonal lines running over plotter
   */
  @Log()
  gnCurvePoints(a: number, b: number, k: number) {
    const points = [];
    for (let i = 0; i < k; i += 1) {
      for (let y = 0; y < k; y += 1) {
        if (mod((y * y - pow(i, 3) - a * i - b), k) === 0) { // Curve Fn
          points.push([i, y]);
        }
      }
    }
    return points;
  }


  /**
   * Returns boolean if given point resides on the curve.
   * Used when data changes. If is still on curve nothing changes.
   */
  @Log()
  fnIsPointOnCurve(x: number, y: number, curvePoints: number[][]): boolean {
    for (const p of curvePoints) {
      if (p[0] === x && p[1] === y) {
        return true;
      }
    }
    return false;
  }


  /**
   * Adds one point to another point, returns the added result
   * P * P = nP ...
   * or P * Q = R
   */
  @Log()
  fnAddPoint(p: number[], q: number[], k: number, a: number) {

    if (p === null || p.includes(NaN)) {
      return q;
    }
    if (q === null || q.includes(NaN)) {
      return p;
    }

    let m;

    if (p[0] !== q[0]) { // Points are distinct
      m = (p[1] - q[1]) * this.fnInvertCord(p[0] - q[0], k);
    } else {
      if (p[1] === 0 && q[1] === 0) { // But when the line is vertical, R goes to infinity
        return [NaN, NaN];
      } else if (p[1] === q[1]) { // When points are same the curve does not produce infinity
        m = (3 * p[0] * p[0] + a) * this.fnInvertCord(2 * p[1], k);
      } else { // But when the line is vertical, R goes to infinity
        return [NaN, NaN];
      }
    }
    m = mod(m, k);
    let x3 = mod((m * m - p[0] - q[0]), k);
    let y3 = mod((m * (p[0] - x3) - p[1]), k);
    if (x3 < 0) {
      x3 += k;
    }
    if (y3 < 0) {
      y3 += k;
    }

    return [x3, y3];
  }

  /**
   * Inverts single cord within the bounds of k.
   */
  @Log()
  fnInvertCord(n: number, k: number) {
    n = mod(+n, k); // Increment n after
    if (n < 0) {
      n = n + k;
    }
    for (let m = 0; m < k; m += 1) {
      if (mod(n * m, k) === 1) {
        return m;
      }
    }
    return NaN;
  }


  /**
   * Is the order of P * P (n-times) until Pn == 0
   * Creates a cyclic group known as the suborder.
   */
  @Log()
  fnGetSubgroupOrder(k: number, a: number, p: number[]) {
    let prime = isPrime(k);
    if (!prime) {
      return 0;
    }
    let N = 2; // prime numbers start from 2
    let Q = this.fnAddPoint(p, p, k, a); // first Q
    while (!Q.includes(NaN)) { // NaN == 0
      Q = this.fnAddPoint(p, Q, k, a); // next Q
      N += 1;
    }
    return N;
  }

  /**
   * Returns PQ point cords
   */
  @Log()
  fnGetAllPQPoints(point: number[], k: number, a: number) {
    let points = [[0, 0]];
    for (let i = 0; i < k; i++) {
      points.push(this.fnAddPoint(points[points.length - 1], point, k, a));
    }
    return points;
  }

  /**
   * We get scalar multiplication Q = (n*P) = P+P+...
   * Adding a point P to itself k times is called scalar multiplication
   * or point multiplication, and is denoted as Q = kP
   */
  @Log()
  fnGetScalarQ(n: number, p: number[], k: number, a: number): number[] {

    if (n === 0 || p === null) {
      this.utils.showInfo('R is at Infinity');
      return [NaN, NaN];
    }

    if (n < 0) {
      n = -n; // Negate to pos
      p = this.reverse(p, k);
    } else {
      n -= 1; // Decrease by 1
    }

    let q = p;

    while (n) { // Till the bit n is not 0
      if (n & 1) { // Bitwise AND with 1
        q = this.fnAddPoint(p, q, k, a);
      }

      p = this.fnAddPoint(p, p, k, a);
      n >>= 1; // Bitwise shift right by 1 (right most falls off)
    }
    if (q.includes(NaN)) {
      this.utils.showInfo('R is at Infinity');
    }

    return q;
  }

  /**
   * Helper function
   * Negative of Py is Py = prime - Py
   */
  reverse(p: number[], k: number) {
    return [p[0], k - p[1]];
  }

}

/**
 * Helper function
 * Applies mod (b) to a
 */
export function mod(a: number, b: number): number {
  const result = a % b;
  return result >= 0 ? result : b + result;
}


/**
 * Helper function
 * Applies pow (b) to a
 */
export function pow(a: number, b: number): number {
  return Math.pow(a, b);
}

/**
 * Helper function
 * Rounds value to decimal places. Javascript limitation is 16 decimals
 * Most useful when dealing with reals not used with finite field, we deal with full integers
 */
export function round(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}


export interface PlotDims {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
