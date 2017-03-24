const MOVE_LEFT = 1;
const MOVE_RIGHT = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 1200
    },

    // use this for initialization
    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        var canvas = cc.find('/Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.moveFlags = 0;
    },

    start: function () {
        this.body = this.getComponent(cc.RigidBody);
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.moveFlags |= MOVE_LEFT;
                this.updateMotorSpeed();
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.moveFlags |= MOVE_RIGHT;
                this.updateMotorSpeed();
                break;
        }
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.moveFlags &= ~MOVE_LEFT;
                // this.updateMotorSpeed();
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.moveFlags &= ~MOVE_RIGHT;
                // this.updateMotorSpeed();
                break;
        }
    },

    onTouchStart: function (event) {
        let touchLoc = event.touch.getLocation();
        if (touchLoc.x < cc.winSize.width/2) {
            this.moveFlags |= MOVE_LEFT;
        }
        else {
            this.moveFlags |= MOVE_RIGHT;
        }
        this.updateMotorSpeed();
    },

    onTouchEnd: function (event) {
        let touchLoc = event.touch.getLocation();
        if (touchLoc.x < cc.winSize.width/2) {
            this.moveFlags &= ~MOVE_LEFT;
        }
        else {
            this.moveFlags &= ~MOVE_RIGHT;
        }
        // this.updateMotorSpeed();
    },

    updateMotorSpeed () {
        if ( !this.body )
            return;
        var desiredSpeed = 0;
        if ( (this.moveFlags & MOVE_LEFT) == MOVE_LEFT )
            desiredSpeed = -this.maxSpeed;
        else if ( (this.moveFlags & MOVE_RIGHT) == MOVE_RIGHT )
            desiredSpeed = this.maxSpeed;
        this.body.angularVelocity = desiredSpeed;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.moveFlags) {
            this.updateMotorSpeed();
        }
    },
});
