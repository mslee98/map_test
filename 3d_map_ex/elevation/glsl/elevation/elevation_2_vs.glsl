
const highp float size = 0.00390625;// pixel size : 1 / tilesize = ( 1./256. )

uniform sampler2D ele;//elevation texture
uniform float scale;//meter per unit

varying vec2 vUv;
varying vec3 pos;
varying vec3 nor;

//the main method
float decodeElevation( vec2 uv ){

    vec3 c = texture2D( ele, ( uv / 256. * 254.) + size ).xyz;
    float e = (c.r * 256. * 256. + c.g * 256. + c.b / 256.) - 32768.;
    return e;
    //sample the elevation texture
    vec2 colorChannels = texture2D( ele, ( uv / 256. * 254.) + size ).xy;

    //decodes the R & G channels
    float meters = ( colorChannels.x * 256.0 + ( colorChannels.y * 256.0 * 256.0 ) );

    //meters:
    //Mariana trench : ~ -11000 m >= elevation <= Mount Everest: 8848 m
    return min( meters -11000.0, 8848.0 );

}

vec3 computeNormal( in vec3 normal ){

    vec3 norm = normal;
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
    norm.x += ( decodeElevation( luv ) - decodeElevation( ruv ) ) * .5;
    norm.y += ( decodeElevation( tuv ) - decodeElevation( buv ) ) * .5;
    norm = normalize( norm );
    return norm;

}

void main(void){

    //store uvs
    vUv = uv;

    //compute the normal and stores it into a varying
    nor = computeNormal( normal );

    //decode elevation from elevation texture
    float elevation = decodeElevation( uv );

    //adds elevation to original vertex position + stores as varying
    pos = position;
    pos.z += elevation * scale;

    //earth center ( -6371 km )
    vec3 center = vec3( 0.,0., -6371000. * scale );
    pos = center + normalize( pos - center ) * ( -center.z + elevation * scale );

    //projection
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );

}