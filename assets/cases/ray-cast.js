cc.Class({
    extends: cc.Component,

    properties: {
        rayCastType: {
            default: cc.RayCastType.Closest,
            type: cc.RayCastType
        },

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
        this.angle += Math.PI / 10 * dt;

        var p1 = this.center;
        var p2 = cc.v2(Math.cos(this.angle), Math.sin(this.angle)).mulSelf(this.radius).addSelf( this.center );

        var manager = cc.director.getPhysicsManager();
        var results = manager.rayCast(p1, p2, this.rayCastType);

        this.ctx.clear();

        if (this.rayCastType === cc.RayCastType.Closest ||
            this.rayCastType === cc.RayCastType.Any) {
            if (results[0]) {
                p2 = results[0].point;
            }
        }

        results.forEach(result => {
            this.ctx.circle(result.point.x, result.point.y, 5);
        });    
        
        this.ctx.fill();

        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    },

    onClosestBtnClick: function () {
        this.rayCastType = cc.RayCastType.Closest;
    },

    onAnyBtnClick: function () {
        this.rayCastType = cc.RayCastType.Any;
    },

    onAllClosestBtnClick: function () {
        this.rayCastType = cc.RayCastType.AllClosest;
    },

    onAllBtnClick: function () {
        this.rayCastType = cc.RayCastType.All;
    }
});
