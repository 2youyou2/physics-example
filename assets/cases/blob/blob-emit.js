var Blob = require('./blob');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        blob: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    },

    onTouchBegan: function (event) {
        var touchLoc = event.touch.getLocation();

        var node = cc.instantiate(this.blob);
        node.active = true;
        cc.director.getScene().addChild(node);

        node.getComponent(Blob).emitTo(touchLoc);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
