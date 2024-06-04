uniform sampler2D map;
uniform float scale;
uniform float angle;

varying vec2 vUv;
varying vec3 pos;
varying vec3 nor;
void main(){

    //texture mapping
    vec4 color = texture2D( map, vUv );
    gl_FragColor = color;


    //light
    vec3 lightDirection = normalize( vec3( cos( angle) ,-sin( angle ) , 0. ) );

    float lightColor = max( 0.0, dot( nor, lightDirection) );

    gl_FragColor.rgb *= mix( vec3( .2 ), vec3( 1. ), smoothstep( .0, .25, lightColor ) );



}
