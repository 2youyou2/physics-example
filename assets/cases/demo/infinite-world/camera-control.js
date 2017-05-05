cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);
    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        
        let ratio = targetPos.y / cc.winSize.height;
        this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },
});