const random = (min, max) => Math.random() * (max - min) + min;

cc.Class({
    extends: cc.Component,

    properties: {
        minInterval: 10,
        maxInterval: 20,
    },

    onLoad () {
        this.animation = this.getComponent(cc.Animation);
        this.animation.play();
        cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => this.animation.stop());
        this.nextWave = Number.MAX_SAFE_INTEGER;
    },

    begin () {
        this.nextWave = cc.director._totalFrames
            + random(this.minInterval, this.maxInterval) * 60;
    },

    update (dt) {
        const t = cc.director._totalFrames;
        if (t < this.nextWave) return;
        this.nextWave = cc.director._totalFrames
            + random(this.minInterval, this.maxInterval) * 60;
        this.animation.play();
    },

    stop () {
        this.nextWave = Number.MAX_SAFE_INTEGER;
    }
});
