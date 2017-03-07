
var smooth = require('smooth');

cc.Class({
    extends: cc.Component,

    properties: {
        particleNumber: 12,
        particleDistance: 32,
        sphereSize: 12
    },

    // use this for initialization
    onLoad: function () {
        this.ctx = this.getComponent(cc.Graphics);

        this.ctx.lineWidth = 6;
        this.ctx.strokeColor = cc.hexToColor('#495069');
        this.ctx.fillColor = cc.hexToColor('#ffde59');

        let x = this.node.x;
        let y = this.node.y;

        let particleNumber = this.particleNumber;
        let particleDistance = this.particleDistance;
        let sphereSize = this.sphereSize;

        let spheres = [];
        spheres.push( this._createSphere(0, 0, sphereSize, this.node) );

        for (let i=0; i<particleNumber; i++) {
            let angle = (2*Math.PI)/particleNumber*i;
            let posX = particleDistance * Math.cos(angle);
            let posY = particleDistance * Math.sin(angle);
            let sphere = this._createSphere(posX, posY, sphereSize, null, this.node);
            spheres.push( sphere );

            let joint = new cc.DistanceJoint();
            joint.connectedBody = spheres[0];
            joint.distance = particleDistance;
            joint.dampingRatio = 0.5;
            joint.frequency = 4;
            addComponent(spheres[spheres.length - 1].node, joint);

            if (i > 0) {
                let distanceX = posX - spheres[spheres.length - 2].node.x;
                let distanceY = posY - spheres[spheres.length - 2].node.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                joint = new cc.DistanceJoint();
                joint.connectedBody = spheres[spheres.length - 2];
                joint.distance = distance;
                joint.dampingRatio = 1;
                joint.frequency = 0;
                addComponent(spheres[spheres.length - 1].node, joint);
            }
            if (i === particleNumber - 1) {
                let distanceX = posX - spheres[1].node.x;
                let distanceY = posY - spheres[1].node.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                joint = new cc.DistanceJoint();
                joint.connectedBody = spheres[spheres.length - 1];
                joint.distance = distance;
                joint.dampingRatio = 1;
                joint.frequency = 0;
                addComponent(spheres[1].node, joint);
            }
        }

        this.spheres = spheres;
    },

    _createSphere (x, y, r, node, parent) {
        if (!node) {
            node = new cc.Node();
            node.x = x;
            node.y = y;
        }

        if (parent) {
            parent.addChild(node);
        }

        let body = new cc.RigidBody();
        body.type = b2.Body.b2_dynamicBody;
        addComponent(node, body);

        let collider = new cc.PhysicsCircleCollider();
        collider.density = 1;
        collider.restitution = 0.4;
        collider.friction = 0.5;
        collider.radius = r;
        addComponent(node, collider);

        return body;
    },

    emitTo (target) {
        var x = target.x;
        var y = target.y;

        var distance = Math.sqrt((x-2)*(x-2) + (y-200)*(y-200));
        var velocity = cc.v2(x-2, y-200);
        velocity.normalize();
        velocity.mul(distance*2);

        this.spheres.forEach(function (sphere) {
            sphere.linearVelocity = velocity;
        });
    },

    update (dt) {
        var ctx = this.ctx;

        var points = this.spheres.map(sphere => {
            return this.expandPosition( sphere.node.position );
        });

        points.shift();

        var result = smooth( points );
        var firstControlPoints = result[0];
        var secondControlPoints = result[1];

        var pos = points[0];

        ctx.clear();
        ctx.moveTo(pos.x, pos.y);

        for (var i = 1, len = points.length; i < len; i++) {
            var firstControlPoint = firstControlPoints[i - 1],
                secondControlPoint = secondControlPoints[i - 1];

            ctx.bezierCurveTo(
                firstControlPoint.x, firstControlPoint.y,
                secondControlPoint.x, secondControlPoint.y,
                points[i].x, points[i].y
            );
        }

        ctx.close();
        ctx.fill();
        ctx.stroke();
    },

    expandPosition (pos) {
        return pos.mul(1.3);
    }
});
