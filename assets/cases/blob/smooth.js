'use strict';

// smooth helper
function getFirstControlPoints(rhs) {
    var n = rhs.length,
        x = [],     // Solution vector.
        tmp = [],   // Temp workspace.
        b = 2.0,
        i;

    x[0] = rhs[0] / b;

    for (i = 1; i < n; i++) { // Decomposition and forward substitution.
        tmp[i] = 1 / b;
        b = (i < n - 1 ? 4.0 : 2.0) - tmp[i];
        x[i] = (rhs[i] - x[i - 1]) / b;
    }

    for (i = 1; i < n; i++) {
        x[n - i - 1] -= tmp[n - i] * x[n - i]; // Backsubstitution.
    }
    return x;
}

function getCubicBezierCurvePoints(points, firstControlPoints, secondControlPoints) {
    var size = points.length,
        closed = points[size-1].x === points[0].x && points[size-1].y === points[0].y,
        n = size,
        // Add overlapping ends for averaging handles in closed paths
        overlap = 0;

    if (closed) {
        size = n = size-1;
    }

    if (size <= 2)
        return;
    if (closed) {
        // Overlap up to 4 points since averaging beziers affect the 4
        // neighboring points
        overlap = Math.min(size, 4);
        n += Math.min(size, overlap) * 2;
    }

    var knots = [];
    for (var i = 0; i < size; i++)
        knots[i + overlap] = points[i];
    if (closed) {
        // If we're averaging, add the 4 last points again at the
        // beginning, and the 4 first ones at the end.
        for (var i = 0; i < overlap; i++) {
            knots[i] = points[i + size - overlap];
            knots[i + size + overlap] = points[i];
        }
    } else {
        n--;
    }
    // Calculate first Bezier control points
    // Right hand side vector
    var rhs = [];

    // Set right hand side X values
    for (var i = 1; i < n - 1; i++)
        rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
    rhs[0] = knots[0].x + 2 * knots[1].x;
    rhs[n - 1] = 3 * knots[n - 1].x;
    // Get first control points X-values
    var x = getFirstControlPoints(rhs);

    // Set right hand side Y values
    for (var i = 1; i < n - 1; i++)
        rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
    rhs[0] = knots[0].y + 2 * knots[1].y;
    rhs[n - 1] = 3 * knots[n - 1].y;
    // Get first control points Y-values
    var y = getFirstControlPoints(rhs);

    if (closed) {
        // Do the actual averaging simply by linearly fading between the
        // overlapping values.
        for (var i = 0, j = size; i < overlap; i++, j++) {
            var f1 = i / overlap,
                f2 = 1 - f1,
                ie = i + overlap,
                je = j + overlap;
            // Beginning
            x[j] = x[i] * f1 + x[j] * f2;
            y[j] = y[i] * f1 + y[j] * f2;
            // End
            x[je] = x[ie] * f2 + x[je] * f1;
            y[je] = y[ie] * f2 + y[je] * f1;
        }
        n--;
    }

    // Now set the calculated handles
    for (var i = overlap; i <= n - overlap; i++) {

        firstControlPoints[i - overlap] = {
            x: x[i],
            y: y[i]
        };

        if (i < n - 1) {
            secondControlPoints[i - overlap] = {
                x: 2 * knots[i + 1].x - x[i + 1],
                y: 2 * knots[i + 1].y - y[i + 1]
            };
        }
        else {
            secondControlPoints[i - overlap] = {
                x: (knots[n].x + x[n - 1]) / 2,
                y: (knots[n].y + y[n - 1]) / 2
            };
        }
    }
}

function getCubicBezierCurvePath(knots) {
    var firstControlPoints = [],
        secondControlPoints = [];

    getCubicBezierCurvePoints(knots, firstControlPoints, secondControlPoints);

    return [firstControlPoints, secondControlPoints];
}

module.exports = getCubicBezierCurvePath;
