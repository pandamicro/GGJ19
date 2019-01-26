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
        speed: 1,
        target: require('../dolphin/pilot'),
        camera: require('./CenterCamera'),
    },

    // LIFE-CYCLE CALLBACKS:

    start () {
        this._prevPos = cc.v2();
        this._dir = cc.v2();
        this._moving = false;
    },

    onEnable () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    onDisable () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    touchStart (event) {
        let touch = event.touch;
        this._prevPos.set(touch._point);
    },

    touchMove (event) {
        let touch = event.touch;

        this._dir.set(touch._point);
        this._dir.subSelf(this._prevPos);

        this._prevPos.set(touch._point);
        let distance = this._dir.mag();
        if (distance <= 1) {
            this._dir.x = 0;
            this._dir.y = 0;
        }
        this._dir.mulSelf(this.speed);
        this._moving = true;
    },

    touchEnd (event) {
        this._moving = false;
    },

    update (dt) {
        if (this._moving) {
            this.target.move(this._dir);
            this.camera.updatePos();
        }
    },
});
