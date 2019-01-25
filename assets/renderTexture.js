cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera,
        _canvas: null
    },

    start () {
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.DEPTH_STENCIL);
        this.camera.targetTexture = texture;
        this.texture = texture;
    },
});
