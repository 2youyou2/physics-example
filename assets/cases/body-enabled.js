cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        body: {
            default: null,
            type: cc.RigidBody
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    onButtonClicked: function () {
        if (this.label.string === 'Disabled') {
            this.body.enabled = false;
            this.label.string = 'Enabled';
        }
        else if (this.label.string === 'Enabled') {
            this.body.enabled = true;
            this.label.string = 'Disabled';
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
