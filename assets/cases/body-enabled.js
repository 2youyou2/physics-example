cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        nodes: {
            default: () => { return []; },
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    onButtonClicked: function () {
        if (this.label.string === 'Disabled') {
            this.nodes.forEach(node => {
                node.active = false;  
            });
            this.label.string = 'Enabled';
        }
        else if (this.label.string === 'Enabled') {
            this.nodes.forEach(node => {
                node.active = true;  
            });
            this.label.string = 'Disabled';
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
