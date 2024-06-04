
const highp float size = 0.00390625;// ( 1./256. )

uniform sampler2D ele;//elevation texture
uniform vec2 nearFar;//camera depth
uniform float scale;//meter per unit
uniform float heroic;//apply distorsion

varying float vDepth;

float decodeElevation( vec2 uv ){

    vec2 colorChannels = texture2D( ele, ( uv / 256. * 254.) + size ).xy;
    //colorChannels = texture2D( ele, uv ).xy;

    float meters = ( colorChannels.x * 256.0 + ( colorChannels.y * 256.0 * 256.0 ) );

    //Mariana Trench:  - 11222 m > -11000m
    //everest: 8848 m > 8800m
    meters = min( meters -11000.0, 8800.0 );

    return meters;
}

void main(void){

    //compute elevation
    vec3 pos = position;
    float elevation = decodeElevation( uv );

    //earth center and adds earth curvature
    vec3 center = vec3( 0.,0., -6371000. * scale );
    pos = center + normalize( pos - center ) * ( -center.z + elevation * scale );

    //stretch the mesh as it goes away from the camera
    float d = distance( pos, cameraPosition );
    pos.xy *= 1. + d * ( 1. / nearFar.y  ) * .5;


    //computes the projection
    vec4 projection = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
    gl_Position = projection;

    //computes depth
    vDepth = smoothstep( nearFar.x, nearFar.y, ( ( projection.z - 1.0) * projection.w) / projection.w );

    //heroic fantasy
    if( heroic > 0. ){
        pos = center + normalize( pos - center ) * ( -center.z + elevation * scale * sin( vDepth * 3.14159 ) );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
        vDepth = smoothstep( nearFar.x, nearFar.y, ( ( projection.z - 1.0) * projection.w) / projection.w );
    }

}