varying vec3 pos;
varying vec2 vUv;
void main(void){

    vUv = uv;
    pos = position;

    vec4 projection = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
    gl_Position = projection;

}