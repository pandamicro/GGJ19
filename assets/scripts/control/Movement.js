// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const TORQUE = 40;

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 1,
        target: cc.Node,
        skeleton: cc.Node,
        camera: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    start () {
        this._body = this.target.getComponent(cc.RigidBody);
        this._headPos = cc.v2();

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
        this._prevRot.set(this.target.quat);
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
            let body = this._body;

            let currAngle = body.getWorldRotation();
            let desireAngle = Math.atan2(this._dir.y, this._dir.x) * 180 / Math.PI;
            let angle = cc.misc.degreesToRadians(currAngle + (desireAngle - currAngle % 360) * 0.1);
            let xdir = Math.cos(angle);
            let ydir = Math.sin(angle);
            let dx = this._dir.x * xdir;
            let dy = this._dir.y * ydir;
            if (dx * xdir < 0) dx = 0;
            if (dy * ydir < 0) dy = 0;
            let dir = cc.v2(dx, dy).mulSelf(this.speed * 60);
            // body.linearVelocity = dir;
            body.applyForceToCenter(dir);

            // let distance = this._dir.mag();
            // if (distance > 2) {
            //     let desireAngle = Math.atan2(this._dir.y, this._dir.x) * 180 / Math.PI;
            //     let angularVelocity = -currAngle % 360 - (360 + desireAngle) % 360;
            //     // let angularVelocity = Math.atan2(this._dir.y, this._dir.x) * 180 / Math.PI;
            //     // let pos = body.getWorldPosition();
            //     // pos.x += TORQUE * xdir;
            //     // pos.y += TORQUE * ydir;
            //     body.applyTorque(angularVelocity > 0 ? -50 : 50);
            // }

            // let currAngle = this.target.eulerAngles.z;
            // let currDir = cc.v2(Math.cos(currAngle), Math.sin(currAngle));
            // let dir = this._dir.mul(this.speed * dt).project(currDir);
            // // Direction correction
            // if (dir.x * currDir.x < 0) dir.x = 0;
            // if (dir.y * currDir.y < 0) dir.y = 0;
            // this.target.x += dir.x;
            // this.target.y += dir.y;
            this.camera.x = this.target.x;
            this.camera.y = this.target.y;

            // let distance = this._dir.mag();
            // if (distance > 2) {
            //     let angle = Math.atan2(this._dir.y, this._dir.x) * 180 / Math.PI;
            //     this._eulerAngles.z = angle;
            //     this._currRot.fromEuler(this._eulerAngles);
            //     this._prevRot.lerp(this._currRot, dt / 0.33, this._currRot);
            //     this._currRot.toEuler(this._eulerAngles);
            //     angle = this._eulerAngles.z;

            //     let b2body = this._body._b2Body;
            //     b2body.SetTransformVec(b2body.GetPosition(), cc.misc.degreesToRadians(angle));

            //     this._prevRot.set(this._currRot);
            // }
        }
    },
});
