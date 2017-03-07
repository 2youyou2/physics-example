let Gravity = require('./gravity');

cc.Class({
    extends: Gravity,

    properties: {
        gravityForce: 500
    },
    
    _applyForce: function (body) {
        let position = body.getPosition();
        let center = this.body.getPosition();

        let f = center.sub( position ).normalize().mul(this.gravityForce * body.mass);

        body.applyForce(f, position, false);
    }
});
