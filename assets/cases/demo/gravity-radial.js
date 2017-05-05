let Gravity = require('gravity');

cc.Class({
    extends: Gravity,

    properties: {
        gravityForce: 500,
    },

    onLoad: function () {
        this._position = cc.v2();
        this._center = cc.v2();
    },
    
    _applyForce: function (body) {
        let position = this._position;
        let center = this._center;

        body.getWorldPosition(position);
        this.body.getWorldPosition(center);

        let f = center.subSelf( position ).normalizeSelf().mulSelf(this.gravityForce * body.getMass());

        body.applyForce(f, position, false);
    }
});
