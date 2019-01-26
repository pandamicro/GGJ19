const random = (min, max) => Math.random() * (max - min) + min;

cc.Class({
    extends: cc.Component,

    properties: {
        minInterval: 10,
        maxInterval: 20,
    },

    start () {
        this.animation = this.getComponent(cc.Animation);
        this.nextWave = cc.director._totalFrames
            + random(this.minInterval, this.maxInterval) * 60;
        this.animation.play();
    },

    update (dt) {
        const t = cc.director._totalFrames;
        if (t < this.nextWave) return;
        this.nextWave = cc.director._totalFrames
            + random(this.minInterval, this.maxInterval) * 60;
        this.animation.play();
    },
});
