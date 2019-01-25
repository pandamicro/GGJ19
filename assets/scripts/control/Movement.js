// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const XAXI = cc.v2(1, 0);

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 1,
        target: cc.Node,
        skeleton: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._prevPos = cc.v2();
        this._dir = cc.v2();
        this._eulerAngles = cc.v3();
        this._currRot = cc.quat();
        this._prevRot = cc.quat();
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
        this._prevRot.set(this.skeleton.quat);
    },

    touchMove (event) {
        let touch = event.touch;

        this._dir.set(touch._point);
        this._dir.subSelf(this._prevPos);

        this._prevPos.set(touch._point);
        this._moving = true;
    },

    touchEnd (event) {
        this._moving = false;
    },

    update (dt) {
        if (this._moving) {
            let dx = this._dir.x * this.speed;
            let dy = this._dir.y * this.speed;
            this.target.x += dx;
            this.target.y += dy;

            let distance = this._dir.mag();
            if (distance > 3) {
                let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                this._eulerAngles.y = angle;
                this._currRot.fromEuler(this._eulerAngles);
                this._prevRot.lerp(this._currRot, dt / 0.33, this._currRot);

                this.skeleton.quat = this._currRot;

                this._prevRot.set(this._currRot);
            }
        }
    },
});
