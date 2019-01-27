
const { vec3, quat } = cc.vmath;
const random = (min, max) => Math.random() * (max - min) + min;
const randomV3 = (min, max) => cc.v3(random(min.x, max.x), random(min.y, max.y), random(min.z, max.z));
const wrapV3 = (v, min, max, range) => {
    if (v.x > max.x + 10) v.x -= range.x;
    else if (v.x < min.x - 10) v.x += range.x;
    if (v.y > max.y + 10) v.y -= range.y;
    else if (v.y < min.y - 10) v.y += range.y;
    if (v.z > max.z + 10) v.z -= range.z;
    else if (v.z < min.z - 10) v.z += range.z;
};
const truncateV3 = (v, max) => {
    const l = vec3.mag(v);
    if (l > max) vec3.scale(v, v, max / l);
};
const apply = (acc, vel, v, f, max) => {
    vec3.scale(v3_1, v, max / vec3.mag(v));
    truncateV3(vec3.sub(v3_1, v3_1, vel), f);
    vec3.add(acc, acc, v3_1);
    v.active = false;
};

const sonar = require('sonar');
const bb = require('DolphinPreb/BBBanim');

const v3_1 = cc.v3();
const v3_2 = cc.v3();
const v3_3 = cc.v3();
const quat_1 = cc.quat();
const _up = cc.v3(0, 1, 0);
const offset = cc.v3(0, 0, 2000);

const addCallback = (fn) => {
    const cb = () => {
        if (fn()) cc.director.off(cc.Director.EVENT_AFTER_UPDATE, cb);
    };
    cc.director.on(cc.Director.EVENT_AFTER_UPDATE, cb);
}

cc.Class({
    extends: cc.Component,

    properties: {
        model: cc.Prefab,
        modelCount: 30,
        flockmateRadius: 300, // [0, 500]
        separationDistance: 30, // [0, 100]
        maxVelocity: 2, // [0, 5]
        alignmentForce: 0.03, // [0, 0.25]
        cohesionForce: 0.03, // [0, 0.25]
        separationForce: 0.03, // [0, 0.25]
        guideForce: 0.09, // [0, 0.25]
        minPos: cc.v3(-800, -400, -1000),
        maxPos: cc.v3(-400,  400,  1000),
        camera: cc.Node,
    },

    initBoid () {
        const m = cc.instantiate(this.model);
        m.parent = this.node;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.5;
        const r = Math.random() * 800;
        m.setPosition(
            Math.cos(theta) * Math.sin(phi) * r,
            Math.sin(theta) * Math.sin(phi) * r,
            Math.cos(phi)) * r - 800;
        m.acc = cc.v3();
        m.vel = cc.v3(
            this.range.x ? random(-1, 1) : 0,
            this.range.y ? random(-1, 1) : 0,
            this.range.z ? random(-1, 1) : 0);
        vec3.scale(m.vel, m.vel, this.maxVelocity);
        const anim = m.getComponent(cc.SkeletonAnimation);
        setTimeout(() => anim.play(), Math.random() * 1000);
        // not working!
        // const t = anim.defaultClip.duration;
        // anim.setCurrentTime(Math.random() * t);
        this.nodes.push(m);
        return m;
    },

    onLoad () {
        this.range = vec3.sub(cc.v3(), this.maxPos, this.minPos);
        this.nodes = [], this.models = [];
        this.alignment = cc.v3(); this.alignment.active = false;
        this.cohesion = cc.v3(); this.cohesion.active = false;
        this.separation = cc.v3(); this.separation.active = false;
        this.guide = cc.v3(); this.guide.active = false;
        {
            const b = this.initBoid();
            b.vel = cc.v3(0.1, 1, 0); b.setPosition(0, 1200, 0);
            const s = b.getComponentInChildren(sonar);
            const bc = b.getComponentInChildren(bb);
            s.begin(); bc.begin();
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
                vec3.add(v3_1, b.getPosition(v3_2), offset);
                this.camera.setPosition(v3_1);
            });
        }
        setTimeout(() => {
            for (let i = 0; i < this.modelCount; i++)
                this.initBoid().vel = cc.v3(0, 1, 0);
            this.nodes.forEach((n) => {
                const s = n.getComponentInChildren(sonar);
                const b = n.getComponentInChildren(bb);
                s.begin(); b.begin();
            });
        }, 5000);
        setTimeout(() => {
            cc.SceneMgr.brighten(5);
        }, 15000);
        setTimeout(() => {
            cc.SceneMgr.taichi(5);
        }, 30000);
        setTimeout(() => {
            cc.SceneMgr.pitchBlack(5);
            this.nodes.forEach((n) => {
                const s = n.getComponentInChildren(sonar);
                const b = n.getComponentInChildren(bb);
                s.stop(); b.stop();
            })
        }, 45000);
    },

    update () {
        const {
            minPos, maxPos, range, maxVelocity,
            alignment, cohesion, separation, guide,
            alignmentForce, cohesionForce, separationForce, guideForce,
            separationDistance, flockmateRadius
        } = this;
        let distance = 0;
        
        for (const b1 of this.nodes) {
            vec3.set(alignment, 0, 0, 0);
            vec3.set(cohesion, 0, 0, 0);
            vec3.set(separation, 0, 0, 0);
            vec3.set(b1.acc, 0, 0, 0);
        
            for (const b2 of this.nodes) {
                if (b1 === b2) continue;
                b1.getPosition(v3_1);
                b2.getPosition(v3_2);
                vec3.sub(v3_1, v3_2, v3_1);
                distance = Math.max(0.1, vec3.mag(v3_1) - 200);
            
                if (distance < separationDistance) {
                    vec3.scale(v3_3, v3_1, -1 / distance);
                    vec3.add(separation, separation, v3_3);
                    separation.active = true;
                }
            
                if (distance < flockmateRadius) {
                    vec3.add(cohesion, cohesion, v3_1);
                    cohesion.active = true;
                    vec3.add(alignment, alignment, b2.vel);
                    alignment.active = true;
                }
            }

            if (alignment.active) apply(b1.acc, b1.vel, alignment, alignmentForce, maxVelocity);
            if (cohesion.active) apply(b1.acc, b1.vel, cohesion, cohesionForce, maxVelocity);
            if (separation.active) apply(b1.acc, b1.vel, separation, separationForce, maxVelocity);
            if (guide.active) { apply(b1.acc, b1.vel, guide, guideForce, maxVelocity); guide.active = true; }
        }

        for (const b of this.nodes) {
            b.getPosition(v3_1);
            truncateV3(vec3.add(b.vel, b.vel, b.acc), maxVelocity);
            vec3.add(v3_1, v3_1, b.vel);
            b.setPosition(v3_1);
            b.setRotation(quat.fromViewUp(quat_1, vec3.normalize(v3_1, b.vel), _up));
        }
    },
});
