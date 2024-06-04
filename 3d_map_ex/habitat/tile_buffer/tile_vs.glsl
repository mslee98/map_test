
#define PI 3.1415926535897932384626433832795


attribute float random;//per vertex
attribute float height;//per face

uniform float scale;//meter per unit
uniform float time;//time

varying vec3 pos;
varying vec2 vUv;
varying float vRandom;
varying float vHeight;
void main(void){

    vUv = uv;

    vRandom = random;
    vHeight = height;

    pos = position;
    pos.y = 1. + step( 0., height ) * ( height * .5 + .5 * height * abs( sin( ( random + time * .1 ) * PI ) ) );

    vec4 projection = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
    gl_Position = projection;

	//if it's a point cloud
	gl_PointSize = 3.;


}