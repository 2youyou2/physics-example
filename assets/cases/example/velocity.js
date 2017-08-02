cc.Class({
    extends: cc.Component,

    properties: {
        tmpNode: {
            default: null,
            type: cc.Node
        },
        label: {
            default: null,
            type: cc.Label
        },
        autoAllocTime: 0.5
    },

    // use this for initialization
    onLoad: function () {
        this.allocedNodes = 0;
        this.time = 0;
        
        cc.find('Canvas').on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    allocNode: function () {
        if (!this.node) return;

        var node = cc.instantiate(this.tmpNode);
        node.parent = this.node;
        node.active = true;

        var body = node.getComponent(cc.RigidBody);

        this.allocedNodes ++;
        
        if (this.label) {
            this.label.string = 'Nodes : ' + this.allocedNodes;
        }
    },

    onTouchStart: function () {
        // this.allocNode();
        this.stop = !this.stop;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.stop) return;
        
        this.time += dt;
        if (this.time < this.autoAllocTime) return;

        this.time = 0;
        this.allocNode();
    },
});
