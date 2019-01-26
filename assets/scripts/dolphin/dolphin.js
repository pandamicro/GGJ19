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
    },

    update (dt) {
        this._accum += dt;

        if (this._accum > 1) {
            let pt0 = this.pt0;
            let pt1 = this.pt1;
            let pt2 = this.pt2;
            this.pt.x = this.node.parent.x;
            this.pt.y = this.node.parent.y;

            let check = (pt0.x - pt2.x) * (pt1.y - pt2.y) - (pt0.y - pt2.y) * (pt1.x - pt2.x);
            if (this._turn !== 0 && Math.abs(check) <= 0.2) {
                if (this.pt.sub(pt2).mag() < 1) {
                    this.scheduleOnce(this.turnMove, 0.5);
                }
                else {
                    this.turnMove();
                }
                this._turn = 0;
            }
            else {
                if (this._turn === 0 && Math.abs(check) > 0.3) {
                    this.unscheduleAllCallbacks();
                    // Left
                    if (check > 0 && this._turn !== 1) {
                        this.ani.playAdditive('turnLeft');
                        this._turn = 1;
                    }
                    // Right
                    else if (check < 0 && this._turn !== -1) {
                        this.ani.playAdditive('turnRight');
                        this._turn = -1;
                    }
                }
            }

            pt0.set(pt1);
            pt1.set(pt2);
            pt2.set(this.pt);
        }
    },

    turnMove () {
        this.ani.playAdditive('move');
    }

    // update (dt) {},
});
