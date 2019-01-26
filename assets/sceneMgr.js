
const addCallback = (fn) => {
    const cb = () => {
        if (fn()) cc.director.off(cc.Director.EVENT_AFTER_UPDATE, cb);
    };
    cc.director.on(cc.Director.EVENT_AFTER_UPDATE, cb);
}

cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera,
        boidsMaterial: cc.Material,
        postProcessing: require('postProcessing'),
    },

    start () {
        cc.SceneMgr = this;
        this.bright = cc.color('#F1882D');
        this.darkBG = cc.color('#012222');
        this.dark = cc.color('#337F7F');
        this.color = this.darkBG.clone();
        this.colorBG = this.darkBG.clone();
    },

    lerpCameraColor (c, time) {
        const beg = cc.director._totalFrames;
        const dur = time * 60;
        const end = beg + dur;
        const tmp = cc.color();
        addCallback((() => {
            const now = cc.director._totalFrames;
            if (now > end) {
                this.colorBG.set(tmp);
                this.camera.backgroundColor = tmp;
                return true;
            }
            this.colorBG.lerp(c, (now - beg) / dur, tmp);
            this.camera.backgroundColor = tmp;
        }).bind(this));
    },
    
    lerpBoidsColor (c, time) {
        const beg = cc.director._totalFrames;
        const dur = time * 60;
        const end = beg + dur;
        const tmp = cc.color();
        addCallback((() => {
            const now = cc.director._totalFrames;
            if (now > end) {
                this.color.set(tmp);
                this.boidsMaterial.setProperty('diffuseColor', tmp);
                return true;
            }
            this.color.lerp(c, (now - beg) / dur, tmp);
            this.boidsMaterial.setProperty('diffuseColor', tmp);
        }).bind(this));
    },

    lerpVignetteColor (c, time) {
        this.postProcessing.lerpVig(c, time);
    },

    brighten (time = 1) {
        this.lerpCameraColor(this.bright, time);
        this.lerpBoidsColor(this.bright, time);
        this.lerpVignetteColor(0, time);
    },

    darken (time = 1) {
        this.lerpCameraColor(this.darkBG, time);
        this.lerpBoidsColor(this.dark, time);
        this.lerpVignetteColor(0.5, time);
    },

    taichi (time = 1) {
        this.lerpCameraColor(cc.color('#FFFFFF'), time);
        this.lerpBoidsColor(cc.color(), time);
        this.lerpVignetteColor(0.2, time);
    },

    invTaichi (time = 1) {
        this.lerpCameraColor(cc.color(), time);
        this.lerpBoidsColor(cc.color('#FFFFFF'), time);
        this.lerpVignetteColor(0.2, time);
    },

    random (time = 1) {
        const c1 = cc.color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
        this.lerpCameraColor(c1, time);
        const c2 = cc.color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
        this.lerpBoidsColor(c2, time);
        this.lerpVignetteColor(Math.random() * 0.5, time);
    }
});
