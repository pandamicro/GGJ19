
const { vec3, quat } = cc.vmath;
const random = (min, max) => Math.random() * (max - min) + min;
const randomV3 = (min, max) => cc.v3(random(min.x, max.x), random(min.y, max.y), random(min.z, max.z));
const wrapV3 = (v, min, max, range) => {
    if (v.x > max.x) v.x -= range.x;
    else if (v.x < min.x) v.x += range.x;
    if (v.y > max.y) v.y -= range.y;
    else if (v.y < min.y) v.y += range.y;
    if (v.z > max.z) v.z -= range.z;
    else if (v.z < min.z) v.z += range.z;
};
const truncateV3 = (v, max) => {
    const l = vec3.mag(v);
    if (l > max) vec3.scale(v, v, max / l);
};
const apply = (acc, vel, v, f, max) => {
    vec3.scale(v, v, max / vec3.mag(v));
    truncateV3(vec3.sub(v, v, vel), f);
    vec3.add(acc, acc, v);
    v.active = false;
};

const v3_1 = cc.v3();
const v3_2 = cc.v3();
const quat_1 = cc.quat();
const _up = cc.v3(0, 1, 0);

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
        minPos: cc.v3(-800, -400, -1000),
        maxPos: cc.v3(-400,  400,  1000),
    },

    start () {
        this.nodes = [], this.models = [];
        this.color = cc.color('#F1882D');
        for (let i = 0; i < this.modelCount; i++) {
            const m = cc.instantiate(this.model);
            m.parent = this.node;
            m.setPosition(randomV3(this.minPos, this.maxPos));
            m.acc = cc.v3();
            m.vel = cc.v3(random(-1, 1), random(-1, 1), random(-1, 1));
            vec3.scale(m.vel, m.vel, this.maxVelocity);
            this.nodes.push(m);
            this.models.push(m.getComponentInChildren(cc.MeshRenderer));
        }
        this.material = this.models[0].sharedMaterials[0];

        this.alignment = cc.v3(); this.alignment.active = false;
        this.cohesion = cc.v3(); this.cohesion.active = false;
        this.separation = cc.v3(); this.separation.active = false;
        this.range = vec3.sub(cc.v3(), this.maxPos, this.minPos);
    },

    update (dt) {
        const {
            minPos, maxPos, range, maxVelocity,
            alignment, cohesion, separation,
            alignmentForce, cohesionForce, separationForce,
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
                vec3.sub(v3_1, v3_1, v3_2);
                distance = vec3.mag(v3_1);
            
                if (distance < separationDistance) {
                    vec3.scale(v3_2, v3_1, -1 / distance);
                    vec3.add(separation, separation, v3_2);
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
        }

        for (const b of this.nodes) {
            b.getPosition(v3_1);
            truncateV3(vec3.add(b.vel, b.vel, b.acc), maxVelocity);
            wrapV3(vec3.add(v3_1, v3_1, b.vel), minPos, maxPos, range);
            b.setPosition(v3_1);
            b.setRotation(quat.fromViewUp(quat_1, vec3.normalize(v3_1, b.vel), _up));
        }
    },

    lerpColor (c, time) {
        const beg = cc.director._totalFrames;
        const dur = time * 60;
        const end = beg + dur;
        const tmp = cc.color();
        addCallback((() => {
            const now = cc.director._totalFrames;
            if (now > end) {
                this.color.set(tmp);
                this.material.setProperty('diffuseColor', tmp);
                return true;
            }
            this.color.lerp(c, (now - beg) / dur, tmp);
            this.material.setProperty('diffuseColor', tmp);
        }).bind(this));
    },
});
