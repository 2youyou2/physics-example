// http://www.iforce2d.net/b2dtut/sticky-projectiles
// http://www.emanueleferonato.com/2012/12/14/box2d-flying-arrow-engine-first-attempt/

cc.Class({
    extends: cc.Component,

    properties: {
        arrow: {
            type: cc.Node,
            default: null
        }
    },

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
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.arrowBodies = [];
    },

    onTouchBegan: function (event) {
        let touchLoc = event.touch.getLocation();

        let node = cc.instantiate(this.arrow);
        node.active = true;

        let vec = cc.v2(touchLoc).sub(node.position);
        node.rotation = -Math.atan2(vec.y, vec.x) * 180 / Math.PI;

        cc.director.getScene().addChild(node);

        let distance =  vec.mag();
        let velocity =  vec.normalize().mulSelf(800);

        let arrowBody = node.getComponent(cc.RigidBody);
        arrowBody.linearVelocity = velocity;

        this.arrowBodies.push(arrowBody);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        let dragConstant = 0.1;
        let arrowBodies = this.arrowBodies;
        for (let i = 0; i < arrowBodies.length; i++) {
            let arrowBody = arrowBodies[i];
            let velocity = arrowBody.linearVelocity;
            let speed = velocity.mag();
            if (speed === 0) continue;
            let direction = velocity.normalize();

            let pointingDirection = arrowBody.getWorldVector( cc.v2( 1, 0 ) );
            let flightDirection = arrowBody.linearVelocity;
            let flightSpeed = flightDirection.mag();
            flightDirection.normalizeSelf();
            
            let dot = cc.pDot( flightDirection, pointingDirection );
            let dragForceMagnitude = (1 - Math.abs(dot)) * flightSpeed * flightSpeed * dragConstant * arrowBody.getMass();
            
            let arrowTailPosition = arrowBody.getWorldPoint( cc.v2( -80, 0 ) );
            arrowBody.applyForce( flightDirection.mul(-dragForceMagnitude), arrowTailPosition, false );
        }
    },
});
