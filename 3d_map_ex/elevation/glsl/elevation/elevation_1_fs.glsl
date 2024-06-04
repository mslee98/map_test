uniform sampler2D map;
uniform float scale;

uniform vec3 grid;
uniform vec3 gridSpacing;
uniform vec3 strokeWidth;
uniform float useWorldScale;

varying vec2 vUv;
varying vec3 pos;
void main(){

    //texture mapping
    vec4 color = texture2D( map, vUv );
    gl_FragColor = color;

    //grid values

    float gx, gy, gz;
    if( useWorldScale == 1. ){

        gx = step( strokeWidth.x, mod( pos.x, gridSpacing.x * scale * 100. ) ) * grid.x;
        gy = step( strokeWidth.y, mod( pos.y, gridSpacing.y * scale * 100. ) ) * grid.y;
        gz = step( strokeWidth.z, mod( pos.z, gridSpacing.z * scale * 100. ) ) * grid.z;

    }else{

        gx = step( strokeWidth.x, mod( pos.x, gridSpacing.x ) ) * grid.x;
        gy = step( strokeWidth.y, mod( pos.y, gridSpacing.y ) ) * grid.y;
        gz = step( strokeWidth.z, mod( pos.z, gridSpacing.z ) ) * grid.z;

    }

    float sum = grid.x + grid.y + grid.z;

    float acc = gx + gy + gz;

    gl_FragColor *= step( sum, acc );


}
