// http://www.emanueleferonato.com/2011/08/05/slicing-splitting-and-cutting-objects-with-box2d-part-4-using-real-graphics/

const EPSILON = 0.1;
const POINT_SQR_EPSILON = 5;

function compare(a, b) {
    if (a.fraction > b.fraction) {
        return 1;
    } else if (a.fraction < b.fraction) {
        return -1;

    }
    return 0;
}

function equals (a, b, epsilon) {
    epsilon = epsilon === undefined ? EPSILON : epsilon;
    return Math.abs(a-b) < epsilon;
}

function equalsVec2(a,b, epsilon) {
    return equals(a.x, b.x, epsilon) && equals(a.y, b.y, epsilon);
}

function pointInLine (point, a, b) {
    return cc.Intersection.pointLineDistance(point, a, b, true) < 1;
}

cc.Class({
    extends: cc.Component,

    onEnable: function () {
        this.debugDrawFlags = cc.director.getPhysicsManager().debugDrawFlags;
        cc.director.getPhysicsManager().debugDrawFlags = 
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
            ;
    },

    onDisable: function () {
        cc.director.getPhysicsManager().debugDrawFlags = this.debugDrawFlags;
    },

    // use this for initialization
    onLoad: function () {
        var canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.ctx = this.getComponent(cc.Graphics);
    },

    onTouchStart: function (event) {
        this.touching = true;
        this.r1 = this.r2 = this.results = null;
        this.touchStartPoint = this.touchPoint = cc.v2( event.touch.getLocation() );
    },

    onTouchMove: function (event) {
        this.touchPoint = cc.v2( event.touch.getLocation() );
    },

    onTouchEnd: function (event) {
        this.touchPoint = cc.v2( event.touch.getLocation() );
        this.recalcResults();
        this.touching = false;

        let point = cc.v2( event.touch.getLocation() );
        if ( equals(this.touchStartPoint.sub(point).magSqr(), 0) ) return;

        // recalculate fraction, make fraction from one direction
        this.r2.forEach(r => {
            r.fraction = 1 - r.fraction;
        });

        let results = this.results;

        let pairs = [];
        
        for (let i = 0; i < results.length; i++) {
            let find = false;
            let result = results[i];

            for (let j = 0; j < pairs.length; j++) {
                let pair = pairs[j];
                if (pair[0] && result.collider === pair[0].collider) {
                    find = true;

                    // one collider may contains several fixtures, so raycast may through the inner fixture side
                    // we need remove them from the result
                    let r = pair.find((r) => {
                        return r.point.sub(result.point).magSqr() <= POINT_SQR_EPSILON;
                    });

                    if (r) {
                        pair.splice(pair.indexOf(r), 1);
                    }
                    else { 
                        pair.push(result);
                    }

                    break;
                }
            }

            if (!find) {
                pairs.push([result]);
            }
        }

        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            if (pair.length < 2) {
                continue;
            }

            // sort pair with fraction
            pair = pair.sort(compare);

            let splitResults = [];

            // first calculate all results, not split collider right now
            for (let j = 0; j < (pair.length - 1); j +=2) {
                let r1 = pair[j];
                let r2 = pair[j+1];

                if (r1 && r2) {
                    this.split(r1.collider, r1.point, r2.point, splitResults);
                }
            }

            if (splitResults.length <= 0) {
                continue;
            }

            let collider = pair[0].collider;

            let maxPointsResult;
            for (let j = 0; j < splitResults.length; j++) {
                let splitResult = splitResults[j];

                for (let k = 0; k < splitResult.length; k++) {
                    if (typeof splitResult[k] === 'number') {
                        splitResult[k] = collider.points[splitResult[k]];
                    }
                }

                if (!maxPointsResult || splitResult.length > maxPointsResult.length) {
                    maxPointsResult = splitResult;
                }
            }

            if (maxPointsResult.length < 3) {
                continue;
            }

            // keep max length points to origin collider
            collider.points = maxPointsResult;
            collider.apply();

            let body = collider.body;

            for (let j = 0; j < splitResults.length; j++) {
                let splitResult = splitResults[j];

                if (splitResult.length < 3) continue;
                if (splitResult == maxPointsResult) continue;

                // create new body
                let node = new cc.Node();
                node.position = body.getWorldPosition();
                node.rotation = body.getWorldRotation();
                node.parent = cc.director.getScene();
                
                node.addComponent(cc.RigidBody);
                
                let newCollider = node.addComponent(cc.PhysicsPolygonCollider);
                newCollider.points = splitResult;
                newCollider.apply();
            }
            
        }
    },

    split: function (collider, p1, p2, splitResults) {
        let body = collider.body;
        let points = collider.points;


        // The manager.rayCast() method returns points in world coordinates, so use the body.getLocalPoint() to convert them to local coordinates.
        p1 = body.getLocalPoint(p1);
        p2 = body.getLocalPoint(p2);


        let newSplitResult1 = [p1, p2];
        let newSplitResult2 = [p2, p1];

        let index1, index2;
        for (let i = 0; i < points.length; i++) {
            let pp1 = points[i];
            let pp2 = i === points.length - 1 ? points[0] : points[i+1];
          
            if (index1 === undefined && pointInLine(p1, pp1, pp2)) {
                index1 = i;
            }
            else if (index2 === undefined && pointInLine(p2, pp1, pp2)) {
                index2 = i;
            }

            if (index1 !== undefined && index2 !== undefined) {
                break;
            }
        }

        // console.log(index1 + ' : ' + index2);

        if (index1 === undefined || index2 === undefined) {
            debugger
            return;
        }

        let splitResult, indiceIndex1 = index1, indiceIndex2 = index2;
        if (splitResults.length > 0) {
            for (let i = 0; i < splitResults.length; i++) {
                let indices = splitResults[i];
                indiceIndex1 = indices.indexOf(index1);
                indiceIndex2 = indices.indexOf(index2);

                if (indiceIndex1 !== -1 && indiceIndex1 !== -1) {
                    splitResult = splitResults.splice(i, 1)[0];
                    break;
                }
            }
        }

        if (!splitResult) {
            splitResult = points.map((p, i) => {
                return i;
            });
        }

        for (let i = indiceIndex1 + 1; i !== (indiceIndex2+1); i++) {
            if (i >= splitResult.length) {
                i = 0;
            }

            let p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;
            
            if (p.sub(p1).magSqr() < POINT_SQR_EPSILON || p.sub(p2).magSqr() < POINT_SQR_EPSILON) {
                continue;
            }

            newSplitResult2.push(splitResult[i]);
        }

        for (let i = indiceIndex2 + 1; i !== indiceIndex1+1; i++) {
            if (i >= splitResult.length) {
                i = 0;
            }

            let p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;
            
            if (p.sub(p1).magSqr() < POINT_SQR_EPSILON || p.sub(p2).magSqr() < POINT_SQR_EPSILON) {
                continue;
            }

            newSplitResult1.push(splitResult[i]);
        }

        splitResults.push(newSplitResult1);
        splitResults.push(newSplitResult2);
    },

    recalcResults: function () {
        if (!this.touching) return;

        let startPoint = this.touchStartPoint;
        let point = this.touchPoint;

        this.ctx.clear();
        this.ctx.moveTo(this.touchStartPoint.x, this.touchStartPoint.y);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();

        let manager = cc.director.getPhysicsManager();

        // manager.rayCast() method calls this function only when it sees that a given line gets into the body - it doesnt see when the line gets out of it.
        // I must have 2 intersection points with a body so that it can be sliced, thats why I use manager.rayCast() again, but this time from B to A - that way the point, at which BA enters the body is the point at which AB leaves it!
        let r1 = manager.rayCast(this.touchStartPoint, point, cc.RayCastType.All);
        let r2 = manager.rayCast(point, this.touchStartPoint, cc.RayCastType.All);

        let results = r1.concat(r2);

        for (let i = 0; i < results.length; i++) {
            let p = results[i].point;
            this.ctx.circle(p.x, p.y, 5);
        }  
        this.ctx.fill();

        this.r1 = r1;
        this.r2 = r2;
        this.results = results;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // body maybe moving, need calc raycast results in update
        this.recalcResults();
    },
});
