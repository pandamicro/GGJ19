
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getPhysicsManager()._debugDrawer.node.group = '3d';
    }
});
