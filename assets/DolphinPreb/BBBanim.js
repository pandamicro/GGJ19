const random = (min, max) => Math.random() * (max - min) + min;

cc.Class({
    extends: cc.Component,

    properties: {
        minInterval: 10,
        maxInterval: 20,
        sprite: cc.Node,
    },

    start () {
        this.translate = new cc.MoveBy(2, cc.v3(0, 200, 0));
        this.scale = new cc.ScaleTo(2, 2);
        this.opacity = new cc.FadeOut(2);
        this.nextWave = cc.director._totalFrames
            + random(this.minInterval, this.maxInterval) * 60;
        this.play();
    },

    play () {
        this.sprite.setPosition(0, 0, 0);
        this.sprite.setScale(1, 1);
        this.sprite.opacity = 255;
        this.sprite.runAction(this.translate);
        this.sprite.runAction(this.scale);
        this.sprite.runAction(this.opacity);
    },

    update () {
        const t = cc.director._totalFrames;
        if (t < this.nextWave) return;
        this.nextWave = cc.director._totalFrames
            + random(this.minInterval, this.maxInterval) * 60;
        this.play();
    },
});
