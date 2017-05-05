cc.Class({
    extends: cc.Component,

    properties: {
        tangentSpeed: 5
    },

    onPreSolve: function (contact) {
        contact.setTangentSpeed( this.tangentSpeed );
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
