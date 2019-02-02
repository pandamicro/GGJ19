cc.macro.ENABLE_WEBGL_ANTIALIAS = true;

function lerp(from, to, ratio) {
    return from + (to - from) * ratio;
}

cc.Class({
    extends: cc.Component,

    properties: {
        sceneCamera: cc.Camera,
        camBloomCut: cc.Camera,
        camBloomBlurV: cc.Camera,
        camBloomBlurH: cc.Camera,
        spBloomCut: cc.Sprite,
        spBloomBlurV: cc.Sprite,
        spBloomBlurH: cc.Sprite,
        spBloomBlend: cc.Sprite,
    },

    onLoad () {
        const gl = cc.game._renderContext;
        this.spBloomCut.node.width = cc.visibleRect.width;
        this.spBloomCut.node.height = cc.visibleRect.height * 0.9; // HACK: amend for weird stretching
        this.spBloomBlurV.node.width = cc.visibleRect.width;
        this.spBloomBlurV.node.height = cc.visibleRect.height * 0.9;
        this.spBloomBlurH.node.width = cc.visibleRect.width;
        this.spBloomBlurH.node.height = cc.visibleRect.height * 0.9;
        this.spBloomBlend.node.width = cc.visibleRect.width;
        this.spBloomBlend.node.height = cc.visibleRect.height;

        const t1 = new cc.RenderTexture();
        t1.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.DEPTH_STENCIL);
        const t2 = new cc.RenderTexture();
        t2.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.DEPTH_STENCIL);
        const t3 = new cc.RenderTexture();
        t3.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.DEPTH_STENCIL);
        console.log(cc.visibleRect.width, cc.visibleRect.height);
        const tex_offset = cc.v2(1 / cc.visibleRect.width, 1 / cc.visibleRect.height);
        const resolution = cc.v3(cc.visibleRect.width, cc.visibleRect.height, cc.visibleRect.width / cc.visibleRect.height);
        const kernelHead = 0.227027;
        const kernel = cc.quat(0.1945946, 0.1216216, 0.054054, 0.016216);

        this.sceneCamera.targetTexture = t1;
        const m1 = this.spBloomCut.getMaterial(0);
        m1.setProperty('texture', t1.getImpl());

        this.camBloomCut.targetTexture = t2;
        const m2 = this.spBloomBlurV.getMaterial(0);
        m2.setProperty('texture', t2.getImpl());
        m2.setProperty('params', cc.quat(tex_offset.x, tex_offset.y, 1, kernelHead));
        m2.setProperty('weights', kernel);

        this.camBloomBlurV.targetTexture = t3;
        const m3 = this.spBloomBlurH.getMaterial(0);
        m3.setProperty('texture', t3.getImpl());
        m3.setProperty('params', cc.quat(tex_offset.x, tex_offset.y, 0, kernelHead));
        m3.setProperty('weights', kernel);

        this.camBloomBlurH.targetTexture = t2;
        const m4 = this.vigMat = this.spBloomBlend.getMaterial(0);
        m4.setProperty('origin', t1.getImpl());
        m4.setProperty('blurred', t2.getImpl());
        m4.setProperty('resolution', resolution);

        this.step = 0;
        this.targetTime = -1;
        this.currentValue = 0.5;
    },

    update () {
        const t = cc.director._totalFrames;
        if (t > this.targetTime) return;
        const value = this.currentValue + this.step;
        this.vigMat.setProperty('vignette', value);
        this.currentValue = value;
    },

    lerpVig (v, time) {
        const t = cc.director._totalFrames;
        this.targetTime = t + time * 60;
        this.targetValue = v;
        this.step = (v - this.currentValue) / (this.targetTime - t);
    }
});
