// http://www.emanueleferonato.com/2011/10/04/create-a-terrain-like-the-one-in-tiny-wings-with-flash-and-box2d-%E2%80%93-adding-more-bumps/

cc.Class({
    extends: cc.Component,

    properties: {
        pixelStep: 10,
        xOffset: 0,
        yOffset: 240,

        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.hills = [];
        this.pools = [];

        while (this.xOffset < 1200) {
            this.generateHill(10);
        }
    },

    generateHillPiece (xOffset, points) {
        let hills = this.hills;

        let first = hills[0];
        if (first && (this.target.x - first.node.x > 1000)) {
            first.node.x = xOffset;
            first.collider.points = points;
            first.collider.apply();
            hills.push( hills.shift() );
            return;
        }

        let node = new cc.Node();
        node.x = xOffset;

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        let collider = node.addComponent(cc.PhysicsPolygonCollider);
        collider.points = points;
        collider.friction = 1;

        node.parent = this.node;

        hills.push( {node: node, collider: collider} );
    },

    generateHill () {
        let pixelStep = this.pixelStep;
        let xOffset = this.xOffset;
        let yOffset = this.yOffset;

        let hillWidth = 120 + Math.ceil(Math.random()*26)*20;
        let numberOfSlices = hillWidth/pixelStep;

        let j;
        let points = [];

        // first step
        let randomHeight;
        if (xOffset === 0) {
            randomHeight = 0;
        }
        else {
            randomHeight = Math.min( Math.random() * hillWidth / 7.5,  600 - yOffset); // make sure yOffset < 600
        }
        
        yOffset += randomHeight;

        for (j = 0; j < numberOfSlices/2; j++) {
            points.length = 0;
            points.push( cc.v2( 0,     0) );
            points.push( cc.v2( 0,     yOffset - randomHeight*Math.cos(2*Math.PI/numberOfSlices*j)) );
            points.push( cc.v2( pixelStep, yOffset - randomHeight*Math.cos(2*Math.PI/numberOfSlices*(j+1))) );
            points.push( cc.v2( pixelStep, 0) );

            this.generateHillPiece(xOffset+ j*pixelStep, points);
        }
        
        yOffset += randomHeight;
        
        // second step
        if (xOffset === 0) {
            randomHeight = 0;
        }
        else {
            randomHeight = Math.min( Math.random()*hillWidth/5,  yOffset - 240); // make sure yOffset > 240
        }

        yOffset -= randomHeight;

        for (j = numberOfSlices/2; j < numberOfSlices; j++) {
            points.length = 0;
            points.push( cc.v2( 0,     0) );
            points.push( cc.v2( 0,     yOffset - randomHeight*Math.cos(2*Math.PI/numberOfSlices*j)) );
            points.push( cc.v2( pixelStep, yOffset - randomHeight*Math.cos(2*Math.PI/numberOfSlices*(j+1))) );
            points.push( cc.v2( pixelStep, 0) );

            this.generateHillPiece(xOffset+ j*pixelStep, points);
        }
        yOffset -= randomHeight;

        this.xOffset += hillWidth;
        this.yOffset = yOffset;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.target) return;

        while (this.target.x + 1200 > this.xOffset) {
            this.generateHill();
        }
    },
});
