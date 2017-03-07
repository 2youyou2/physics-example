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
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onTouchStart: function (event) {

    },

    onTouchMove: function (event) {

    },

    onTouchEnd: function (event) {

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
