uniform sampler2D map;
uniform sampler2D env;

uniform float scale;
uniform float time;

uniform float brightness;
uniform float saturation;
uniform float contrast;

varying vec2 vUv;
varying vec2 vN;
varying vec3 pos;
varying vec3 nor;
varying float height;

vec3 bsc( vec3 color, float brt, float sat, float con){

    vec3 brtColor       = color * brt;
    float intensityf    = dot( brtColor, vec3(0.2125,0.7154,0.0721) );
    vec3 satColor       = mix( vec3(intensityf), brtColor, sat );
    return mix( vec3( .5 ), satColor, con);
}

void main(){

    vec3 cola = texture2D( env, vN ).rgb;
    vec3 colb = texture2D( map, vN ).rgb;
    vec3 final = mix( cola, colb, min( 1., max( 0., height ) * 6. ) );


    if( step( 0., height ) == 0. ) {
        final -= final * 0.45;
    }else{
        final += final*.15;
    }

    gl_FragColor = vec4( bsc( final, brightness, saturation, contrast ), 1. );

}
