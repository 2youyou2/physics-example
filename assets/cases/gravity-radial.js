let Gravity = require('./gravity');

cc.Class({
    extends: Gravity,

    properties: {
        gravityForce: 500
    },
    
    _applyForce: function (body) {
        let position = body.getWorldPosition();
        let center = this.body.getWorldPosition();

        let f = center.sub( position ).normalize().mul(this.gravityForce * body.mass);

        body.applyForce(f, position, false);
    }
});
