cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    update: function () {
        var body = this.getComponent(cc.RigidBody);
        var list = body.getJointList();
        
        console.log('------------joint-list-----------');
        list.forEach(joint => {
            console.log(cc.js.getClassName(joint));
        });
    },
});
