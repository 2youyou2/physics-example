cc.Class({
    extends: cc.Component,

    // use this for initialization
    onEnable: function () {
        let manager = cc.director.getPhysicsManager();

        this.bodies = [];
        this.body = this.getComponent(cc.RigidBody);
        this.originGravity = manager.gravity;
        manager.gravity = cc.v2();
    },

    onDisable: function () {
        cc.director.getPhysicsManager().gravity = this.originGravity;
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.bodies.push(otherCollider.body);
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        let index = this.bodies.indexOf(otherCollider.body);
        if (index !== -1) {
            this.bodies.splice(index, 1);
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.body) {
            return;
        }

        let bodies = this.bodies;
        for (let i = 0; i < bodies.length; i++) {
            this._applyForce(bodies[i]);
        }
    },

    _applyForce: function (body) {
    }
});
