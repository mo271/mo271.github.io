'use strict';

const canvas1 = document.getElementById('colorcube');
const canvas2 = document.getElementById('cubecut');
const glsl1 = SwissGL(canvas1);
const glsl2 = SwissGL(canvas2);
let viewParams1 = {
        cameraYPD1: new Float32Array(3),
    };
let viewParams2 = {
        cameraYPD2: new Float32Array(3),
    };
function createInclude(camera_name) {
    const include = `
        uniform vec3 ${camera_name};
        vec3 cameraPos() {
            vec3 p = vec3(0, 0, ${camera_name}.z);
            p.yz *= rot2(-${camera_name}.y);
            p.xy *= rot2(-${camera_name}.x);
            return p;
        }
        vec4 wld2view(vec4 p) {
            p.xy *= rot2(${camera_name}.x);
            p.yz *= rot2(${camera_name}.y);
            p.z -= ${camera_name}.z;
            return p;
        }
        vec4 view2proj(vec4 p) {
            const float near = 0.1, far = 10.0, fov = 1.0;
            return vec4(p.xy/tan(fov/2.0),
                (p.z*(near+far)+2.0*near*far)/(near-far), -p.z);
        }
        vec4 wld2proj(vec4 p) {
            return view2proj(wld2view(p));
        }
        varying vec3 color;
    `;
    return include;
}
function render1(t) {
    // TODO: consider animating a default rotation
    t /= 1000; // ms to sec
    glsl1({...viewParams1, Grid:[10,10,10], Clear:[0.992156, 0.992156, 0.992156, 1.0],
            Aspect:'fit', DepthTest:1, AlphaCoverage:1}, createInclude('cameraYPD1') + `
    //VERT
    vec4 vertex() {
        vec3 p = color = vec3(ID)/vec3(Grid-1);
        vec4 pos = vec4(p-0.5, 1);
        pos = wld2view(pos);
        pos.xy += XY*0.03;  // offset quad corners in view space
        return view2proj(pos);
    }
    //FRAG
    void fragment() {
        float r = length(XY);
        float alpha = smoothstep(1.0, 1.0-fwidth(r), r);
        out0 = vec4(color, alpha);
    }`);
    requestAnimationFrame(render1);
}
function render2(t) {
    // TODO: consider animating a default rotation
    t /= 1000; // ms to sec
    const include = createInclude('cameraYPD2');
    function cube(glsl, params) {
        glsl({...params, Grid:[6,1], Blend:`d*(1-sa)+s*sa`,
        Aspect:'fit'}, include +`
        //VERT
        vec4 vertex() {
            color = cubeVert(XY, ID.x)*0.5+0.5;
            return wld2proj(vec4(color-0.5, 1.0));
        }
        //FRAG
        void fragment() {
            float edge = isoline(UV.x)+isoline(UV.y);
            out0 = mix(vec4(color, opacity), vec4(0,0,0,1), sqrt(edge));
        }`);
    }
    cube(glsl2, { ...viewParams2, Clear:1, opacity:0.25, Face:'back'});
    glsl2({...viewParams2, Aspect:'fit'}, include + `
        //VERT
        const vec3 Verts[4] = vec3[4](
            vec3(1.0, -0.3982102908, 1.0), vec3(1.0, -0.1963087248, -1.0),
            vec3(-1.0, 0.1963087248, 1.0), vec3(-1.0, 0.3982102908, -1.0));
        vec4 vertex() {
            color = Verts[VID.x+VID.y*2]*0.5+0.5;;
            return wld2proj(vec4(color-0.5, 1));
        }
        //FRAG
        void fragment() {
            out0 = vec4(color,1.0);
    }`);
    cube(glsl2, {...viewParams2, opacity:0.0, Face:'front'});
    requestAnimationFrame(render2);
}
let prevPos1 = { x: 0, y: 0 };
let prevPos2 = { x: 0, y: 0 };

function handlePointerMove(camera, prevPos,  e) {
    if (!e.isPrimary || e.buttons != 1) return;
    const { x: px, y: py } = prevPos;
    const { offsetX: x, offsetY: y } = e;
    prevPos.x = x;
    prevPos.y = y;
    let [yaw, pitch, dist] = camera;
    yaw -= (x-px)*0.01;
    pitch -= (y-py)*0.01;
    pitch = Math.min(Math.max(pitch, 0), Math.PI);
    camera.set([yaw, pitch, dist]);
}

canvas1.addEventListener('pointermove', e=>{handlePointerMove(viewParams1.cameraYPD1, prevPos1, e)});
canvas2.addEventListener('pointermove', e=>{handlePointerMove(viewParams2.cameraYPD2, prevPos2, e)});
canvas1.addEventListener('pointerdown', e=>{
        if (!e.isPrimary) return;
        prevPos1.x = e.offsetX;
        prevPos1.y = e.offsetY;
    });
canvas2.addEventListener('pointerdown', e=>{
        if (!e.isPrimary) return;
        prevPos2.x = e.offsetX;
        prevPos2.y = e.offsetY;
    });

viewParams1.cameraYPD1.set([3*Math.PI/4+.2, 1.2, 1.89]);
viewParams2.cameraYPD2.set([3*Math.PI/4+.2, 1.2, 1.89]);
render1(0.0);
render2(0.0);



