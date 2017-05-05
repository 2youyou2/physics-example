cc.Class({
    extends: cc.Component,

    properties: {
        pointTemp: {
            type: cc.Node,
            default: null
        }
    },

    onPreSolve: function (contact) {
        let worldManifold = contact.getWorldManifold();
        let points = worldManifold.points;
        let scene = cc.director.getScene();

        function removeSelf () {
            this.parent = null;
        }

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            
            let node = cc.instantiate(this.pointTemp);
            node.active = true;

            let fadeOut = cc.fadeOut(0.2);
            let remove = cc.callFunc(removeSelf, node);
            let action = cc.sequence(fadeOut, remove);

            node.runAction(action);
            node.x = p.x;
            node.y = p.y;

            node.parent = scene;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
        
    // },
});
