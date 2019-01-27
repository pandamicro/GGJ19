
cc.Class({
    extends: cc.Component,

    properties: {
        debug: true
    },

    // use this for initialization
    onLoad: function () {
        if (!CC_EDITOR) {
            cc.director.getPhysicsManager().debugDrawFlags = 
                this.debug ? 
                (cc.PhysicsManager.DrawBits.e_aabbBit |
                cc.PhysicsManager.DrawBits.e_jointBit |
                cc.PhysicsManager.DrawBits.e_shapeBit) : 
                0;
        }
        cc.director.getPhysicsManager()._debugDrawer.node.group = '3d';
    }
});
