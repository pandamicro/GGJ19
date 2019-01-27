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
        bbb: require('../../DolphinPreb/BBBanim2'),
        sonar: require('../../sonar2'),
        root: cc.Node,
        target: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.ani = this.node.getComponent(cc.SkeletonAnimation);
        this.body = this.node.parent.getComponent(cc.RigidBody);
        this.pt0 = cc.v2();
        this.pt1 = cc.v2();
        this.pt2 = cc.v2();
        this.pt = cc.v2();
        this._accum = 0;
        this._turn = 0;
        this.ani.play('move');
        this.feedback = cc.find('sonar/feedback');
        this.vector = null;
    },

    update (dt) {
        this._accum += dt;

        if (this._accum > 1) {
            let pt0 = this.pt0;
            let pt1 = this.pt1;
            let pt2 = this.pt2;
            this.pt.x = this.node.parent.x;
            this.pt.y = this.node.parent.y;

            // let check = (pt0.x - pt2.x) * (pt1.y - pt2.y) - (pt0.y - pt2.y) * (pt1.x - pt2.x);
            // if (this._turn !== 0 && Math.abs(check) <= 0.2) {
            //     if (this.pt.sub(pt2).mag() < 1) {
            //         this.scheduleOnce(this.turnMove, 0.5);
            //     }
            //     else {
            //         this.turnMove();
            //     }
            //     this._turn = 0;
            // }
            // else {
            //     if (this._turn === 0 && Math.abs(check) > 0.3) {
            //         this.unscheduleAllCallbacks();
            //         // Left
            //         if (check > 0 && this._turn !== 1) {
            //             this.ani.playAdditive('turnLeft');
            //             this._turn = 1;
            //         }
            //         // Right
            //         else if (check < 0 && this._turn !== -1) {
            //             this.ani.playAdditive('turnRight');
            //             this._turn = -1;
            //         }
            //     }
            // }

            pt0.set(pt1);
            pt1.set(pt2);
            pt2.set(this.pt);

            let distanceFromCenter = this.pt.mag();
            if (distanceFromCenter > 1200 && this.root.z !== 20) {
                this.root.z = cc.misc.lerp(this.root.z, 40, 0.1);
            }
            else if (distanceFromCenter <= 1200 && this.root.z !== -40) {
                this.root.z = cc.misc.lerp(this.root.z, -40, 0.1);
            }
        }
    },

    turnMove () {
        this.ani.playAdditive('move');
    },

    showFeedback () {
        let pos = this.vector.normalizeSelf().mulSelf(450);
        this.feedback.setPosition(pos);
        this.feedback.angle = this.angle - 90;
        this.feedback.active = true;
        this.scheduleOnce(function () {
            this.feedback.active = false;
        }, 3);
    },

    shootBB () {
        let shoot = this.bbb.play();
        this.sonar.activate();
        if (shoot) {
            let dolphin = this.node.parent;
            let rotation = dolphin.eulerAngles.z;
            this.vector = this.target._position.sub(dolphin._position);
            this.angle = Math.atan2(this.vector.y, this.vector.x) * 180 / Math.PI;
            if (Math.abs(rotation - this.angle) < 30) {
                // Target Detected
                this.scheduleOnce(this.showFeedback, 5);
            }
        }
    }

    // update (dt) {},
});
