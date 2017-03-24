// http://www.iforce2d.net/b2dtut/one-way-walls

cc.Class({
    extends: cc.Component,

    properties: {    },

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

    onBeginContact: function (contact, selfCollider, otherCollider) {
        let otherBody = otherCollider.body;
        let platformBody = selfCollider.body;

        let worldManifold = contact.getWorldManifold();
        let points = worldManifold.points;

        //check if contact points are moving into platform
        for (let i = 0; i < points.length; i++) {
            let pointVelPlatform = platformBody.getLinearVelocityFromWorldPoint( points[i] );
            let pointVelOther = otherBody.getLinearVelocityFromWorldPoint( points[i] );
            let relativeVel = platformBody.getLocalVector( pointVelOther.sub(pointVelPlatform) );
            
            if ( relativeVel.y < -32 ) //if moving down faster than 32 pixel/s (1m/s), handle as before
                return;  //point is moving into platform, leave contact solid and exit
            else if ( relativeVel.y < 32 ) { //if moving slower than 32 pixel/s (1m/s)
                //borderline case, moving only slightly out of platform
                let relativePoint = platformBody.getLocalPoint( points[i] );
                let platformFaceY = selfCollider.getAABB().height / 2;  //front of platform, should only used on a box collider
                if ( relativePoint.y > platformFaceY - 0.1*32 )
                    return;  //contact point is less than 3.2pixel (10cm) inside front face of platfrom
            }
            else {
                //moving up faster than 1 m/s
            }
        }
        
        // store disabled state to contact
        contact.disabled = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
