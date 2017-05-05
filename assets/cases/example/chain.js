cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        let itemWidth = 30;
        let itemHeight = 8;
        let y = 250;
        let prevBody = this.getComponent(cc.RigidBody);
        for (let i = 0; i < 15; ++i) {
            let node = new cc.Node();
            node.position = cc.v2((0.5+i) * itemWidth, y);
            let body = node.addComponent(cc.RigidBody);

            let collider = node.addComponent(cc.PhysicsBoxCollider);
            collider.size = cc.size(itemWidth, itemHeight);
            collider.density = 20;

            let joint = node.addComponent(cc.RevoluteJoint);
            joint.collideConnected = false;
            joint.anchor = cc.v2(-itemWidth/2, 0);
            joint.connectedAnchor = i === 0 ? cc.v2(0, y) : cc.v2(itemWidth/2, 0);
            joint.connectedBody = prevBody;

            this.node.addChild(node);

            prevBody = body;
        }
    }
});
