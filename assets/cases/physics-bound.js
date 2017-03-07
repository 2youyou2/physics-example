
window.addComponent = function (node, component) {
    component.node = node;
    node._components.push(component);

    if (node._activeInHierarchy) {
        if (typeof component.__preload === 'function') {
            cc.director._compScheduler.doPreloadComp(component);
        }
        // call onLoad/onEnable
        cc.director._compScheduler.activateComp(component);
    }

    return component;
};

cc.Class({
    extends: cc.Component,

    properties: {
        size: cc.size(0, 0)
    },

    // use this for initialization
    onLoad: function () {
        let width   = this.size.width || this.node.width;
        let height  = this.size.height || this.node.height;

        let body = new cc.RigidBody();
        body.type = b2.Body.b2_staticBody;
        addComponent(this.node, body);

        this.addComponent(cc.MouseJoint);
        
        this._addBound(0, height/2, width, 20);
        this._addBound(0, -height/2, width, 20);
        this._addBound(-width/2, 0, 20, height);
        this._addBound(width/2, 0, 20, height);
    },

    _addBound (x, y, width, height) {
        let collider = new cc.PhysicsBoxCollider();
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
        addComponent(this.node, collider);
    }
});
