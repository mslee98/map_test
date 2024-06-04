
#define PI 3.1415926535897932384626433832795

uniform float time;
varying vec2 vUv;

varying float vRandom;
varying float vHeight;
void main(){

    float st = abs( sin( ( vRandom * 10. + time * .5 )* PI) );
    float ct = abs( sin( ( vHeight + time * .5 )* PI) );
    vec3 color = vec3( smoothstep( 0.5,.51,st ) );
    gl_FragColor = vec4( color * ct, st );

}
