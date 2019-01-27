// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dolphin: require('../dolphin/dolphin')
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._startPos = cc.v2();
    },

    onEnable () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    onDisable () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    touchStart (event) {
        let touch = event.touch;
        this._startPos.set(touch._point);
    },

    touchEnd (event) {
        let touch = event.touch;
        // Touched
        if (touch._point.sub(this._startPos).mag() < 3) {
            this.dolphin.shootBB();
        }
    }

    // update (dt) {},
});
