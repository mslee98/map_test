
const highp float size = 0.00390625;// ( 1./256. )

uniform sampler2D ele;//elevation texture
uniform vec2 nearFar;//camera depth
uniform float scale;//meter per unit
uniform float heroic;//apply distorsion

varying vec2 vUv;
varying vec3 pos;
varying vec3 nor;
varying float vDepth;

float decodeElevation( vec2 uv ){

    vec3 c = texture2D( ele, ( uv / 256. * 254.) + size ).xyz;
    float e = (c.r * 256. * 256. + c.g * 256. + c.b / 256.) - 32768.;
    return min( e -11000.0, 8848.0 );


    vec2 colorChannels = texture2D( ele, ( uv / 256. * 254.) + size ).xy;
    //colorChannels = texture2D( ele, uv ).xy;

    float meters = ( colorChannels.x * 256.0 + ( colorChannels.y * 256.0 * 256.0 ) );

    //Mariana Trench
    //everest
    meters = min( meters -11000.0, 8848.0 );

    return meters;
}

void main(void){

    vUv = uv;
    pos = position;

    nor = normal;
    //left pixel
    vec2 luv = uv;
    luv.x = max( uv.x - size, uv.x );

    //right pixel
    vec2 ruv = uv;
    ruv.x = max( uv.x + size, uv.x );

    //top pixel
    vec2 tuv = uv;
    tuv.y = max( uv.y, uv.y - size );

    //bottom pixel
    vec2 buv = uv;
    buv.y = max( uv.y, uv.y + size );

    //difference XY
    nor.x += ( decodeElevation( luv ) - decodeElevation( ruv ) ) * .5;
    nor.y += ( decodeElevation( tuv ) - decodeElevation( buv ) ) * .5;
    nor = normalize( nor );

    float elevation = decodeElevation( uv );
    pos.z += elevation * scale;


    vec3 center = vec3( 0.,0., -6371000. * scale );
    pos = center + normalize( pos - center ) * ( -center.z + elevation * scale );

    //stretch the mesh as it goes away from the camera
    float d = distance( pos, cameraPosition );
    pos.xy *= 1. + d * ( 1. / nearFar.y );


    vec4 projection = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
    gl_Position = projection;
    vDepth = smoothstep( nearFar.x, nearFar.y, (( projection.z - 1.0) * projection.w) / projection.w );

    //TODO stretch corners
    /*
    pos.x *= 1. + abs( smoothstep( -1.0, 1., ( 256. - pos.x ) / 512. ) );
    pos.y *= 1. + abs( smoothstep( -1.0, 1., ( 256. - pos.y ) / 512. ) );
    //*/

    //heroic fantasy
    if( heroic > 0. ){
        pos = center + normalize( pos - center ) * ( -center.z + elevation * scale * vDepth );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );
    }
}