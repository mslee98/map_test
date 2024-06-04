
const highp float size = 0.00390625;// pixel size : 1 / tilesize = ( 1./256. )

uniform sampler2D ele;//elevation texture
uniform float scale;//meter per unit

varying vec2 vUv;

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

void main(void){

    //store uvs
    vUv = uv;

    //decode elevation from elevation texture
    float elevation = decodeElevation( uv );

    //adds elevation to original vertex position
    vec3 pos = position;
    pos.z = scale * .5 - elevation * scale;

    //earth center ( -6371 km )
    vec3 center = vec3( 0.,0., -6371000. * scale );
    pos = center + normalize( pos - center ) * ( -center.z + elevation * scale );

    //projection
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1. );

}