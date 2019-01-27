const random = (min, max) => Math.random() * (max - min) + min;

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Node,
    },

    onLoad () {
        this.sprite.opacity = 0;
        this.lastPlay = 0;
    },

    start () {
        this.translate = new cc.MoveTo(6, cc.v3(0, -400, 0));
        // this.scale = new cc.ScaleTo(3, 2);
        this.opacity = new cc.FadeOut(1);
        // this.nextWave = cc.director._totalFrames
        //     + random(this.minInterval, this.maxInterval) * 60;
    },

    play () {
        let now = Date.now();
        if (now - this.lastPlay > 5000) {
            this.sprite.setPosition(0, 0, 0);
            // this.sprite.setScale(1, 0.04, 1);
            this.sprite.opacity = 255;
            this.sprite.runAction(this.translate);
            // this.sprite.runAction(this.scale);
            this.sprite.runAction(this.opacity);
            this.lastPlay = Date.now();
            return true;
        }
        return false;
    },

    // update () {
    //     const t = cc.director._totalFrames;
    //     if (t < this.nextWave) return;
    //     this.nextWave = cc.director._totalFrames
    //         + random(this.minInterval, this.maxInterval) * 60;
    //     this.play();
    // },
});
