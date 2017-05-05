// http://www.iforce2d.net/b2dtut/sticky-projectiles
// http://www.emanueleferonato.com/2012/12/14/box2d-flying-arrow-engine-first-attempt/

cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this.weldJoint = this.getComponent(cc.WeldJoint);
    },

    onPostSolve: function (contact, selfCollider, otherCollider) {
        var impulse = contact.getImpulse();
        if (Math.abs(impulse.normalImpulses[0]) < cc.PhysicsManager.PTM_RATIO) return;

        let joint = this.weldJoint;

        if (joint.enabled) {
            joint.enabled = false;
            return;
        }

        if (otherCollider.node.name === 'arrow') {
            return;
        }

        let arrowBody = selfCollider.body;
        let targetBody = otherCollider.body;
        let worldCoordsAnchorPoint = arrowBody.getWorldPoint( cc.v2(0.6, 0) );
    
        joint.connectedBody = targetBody;
        joint.anchor = arrowBody.getLocalPoint( worldCoordsAnchorPoint );
        joint.connectedAnchor = targetBody.getLocalPoint( worldCoordsAnchorPoint );
        joint.referenceAngle = targetBody.node.rotation - arrowBody.node.rotation;

        joint.enabled = true;
    }
});
