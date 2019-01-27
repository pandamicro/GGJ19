function lerp(from, to, ratio) {
    return from + (to - from) * ratio;
}

const addCallback = (fn) => {
    const cb = () => {
        if (fn()) cc.director.off(cc.Director.EVENT_AFTER_UPDATE, cb);
    };
    cc.director.on(cc.Director.EVENT_AFTER_UPDATE, cb);
}

cc.Class({
    extends: cc.Component,

    properties: {
        materials: [cc.Material],
        vignette: 2,
        postProcessing: require('postProcessing'),
    },

    start () {
        cc.WorldMgr = this;
        this.obstacleCBs = {};
        this.postProcessing.lerpVig(this.vignette, 1);
        this.mat = this.materials[0];
    },

    sonarDetect () {
        this.postProcessing.lerpVig(0.5, 1);
        setTimeout(() => this.postProcessing.lerpVig(this.vignette, 2), 1000);
    },

    brightenWorld () {
        // if (this.obstacleCBs[this.mat]) return;
        for (const m of this.materials)
            this.lerpObstableBrightness(m);
    },
    
    lerpObstableBrightness (mat, v = 1, time = 3) {
        const beg = cc.director._totalFrames;
        const dur = time * 60;
        const end = beg + dur;
        this.obstacleCBs[mat] = true;
        const ori = mat.getProperty('brightness');
        addCallback((() => {
            const now = cc.director._totalFrames;
            if (now > end) {
                mat.setProperty('brightness', ori);
                this.obstacleCBs[mat] = false;
                return true;
            }
            let c = ori, t = (now - beg) / dur;
            if (t < 0.2) c = lerp(ori, v, t / 0.2);
            else c = lerp(v, ori, (t - 0.2) / 0.8);
            mat.setProperty('brightness', Math.sqrt(c));
        }).bind(this));
    }
});
