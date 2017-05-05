cc.Class({
    extends: cc.Component,

    properties: {
        radius: 1000
    },

    // use this for initialization
    onLoad: function () {
        this.ctx = this.getComponent(cc.Graphics);
        this.angle = 0;
        this.center = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.angle += Math.PI / 20 * dt;

        var p1 = this.center;
        var p2 = cc.v2(Math.cos(this.angle), Math.sin(this.angle)).mulSelf(this.radius).addSelf( this.center );

        this.ctx.clear();
    
        this.remainLength = this.radius;
        this.rayCast(p1, p2);
    },

    rayCast: function (p1, p2) {
        var manager = cc.director.getPhysicsManager();
        var result = manager.rayCast(p1, p2)[0];

        if (result) {
            p2 = result.point;
            this.ctx.circle(p2.x, p2.y, 5);
            this.ctx.fill();
        }

        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

        if (!result) return;

        this.remainLength = this.remainLength - p2.sub(p1).mag();
        if (this.remainLength < 1) return;

        result.normal.mul(this.remainLength);

        p1 = p2;
        p2 = result.normal.mul(this.remainLength).add(p1);
        this.rayCast(p1, p2);
    }
});
