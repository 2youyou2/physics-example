// http://www.iforce2d.net/b2dtut/sticky-projectiles
// http://www.emanueleferonato.com/2012/12/14/box2d-flying-arrow-engine-first-attempt/

cc.Class({
    extends: cc.Component,

    onPostSolve: function (contact, selfCollider, otherCollider) {
        var impulse = contact.getImpulse();
        if (impulse.normalImpulses[0] < cc.PhysicsManager.PTM_RATIO) return;
        
        let colliderA = contact.colliderA;
        let colliderB = contact.colliderB;

        let weldJoint = selfCollider.body.weldJoint;
        if (weldJoint) {
            weldJoint.destroy();
            selfCollider.body.weldJoint = null;
            return;
        }

        let arrowBody = selfCollider.body;
        let targetBody = otherCollider.body;
        let worldCoordsAnchorPoint = arrowBody.getWorldPoint( cc.v2(0.6, 0) );
    
        let joint = new cc.WeldJoint();
        joint.connectedBody = targetBody;
        joint.anchor = arrowBody.getLocalPoint( worldCoordsAnchorPoint );
        joint.connectedAnchor = targetBody.getLocalPoint( worldCoordsAnchorPoint );
        joint.referenceAngle = targetBody.node.rotation - arrowBody.node.rotation;

        addComponent(arrowBody.node, joint);

        arrowBody.weldJoint = joint;
    }
});
