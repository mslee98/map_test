uniform sampler2D map;
uniform sampler2D ele;
uniform float scale;
uniform float time;

varying vec2 vUv;
varying vec3 pos;
varying vec3 nor;
varying float vDepth;

uniform float weight[5];
uniform float offset[5];
void main(){


    //depth map
	gl_FragColor =vec4(vec3( vDepth ),1. );

	//normal
	//gl_FragColor = vec4(vec3( nor ),1. );

    //texture mapping
    vec4 color = texture2D( map, vUv );
    gl_FragColor = color;


    //light
    vec3 lightDirection = normalize( vec3( sin( time ) , cos( time ) ,0. ) );
    float lightColor = max( 0.0, dot( nor, lightDirection) );
    vec3 shadow = vec3( 0.1 );
    vec3 light = vec3( .65,0.65,0.65 ) * 3.;
    //gl_FragColor.rgb *= mix( shadow, light, smoothstep( .0, .45, lightColor ) );


    /*
    vec4 blur = texture2D( map, vUv ) * weight[0];
    for ( int i = 1; i < 5; i++) {
        for( float j = 1.; j <= 8.; j += 1. ){
            float s = 1024. / j;
            blur += .125 * texture2D( map, vUv + ( vec2(0.0, offset[i]) / s ) ) * weight[i];
            blur += .125 * texture2D( map, vUv - ( vec2(0.0, offset[i]) / s ) ) * weight[i];

            blur += .125 * texture2D( map, vUv + ( vec2(offset[i]) / s, 0.0 ) ) * weight[i];
            blur += .125 * texture2D( map, vUv - ( vec2(offset[i]) / s, 0.0 ) ) * weight[i];
        }
    }
    gl_FragColor = mix( blur, color, vDepth );
    //*/

    //grid
    /*
    //X
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.x, 10. ) );
    //Y
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.y, 10. ) );
    //Z
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.z, 10. ) );

    //XY
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.x, 10. ) ) * step( .5, mod(pos.y, 20. ) ) );

    //ALL
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.x, 10. ) ) * step( .5, mod(pos.y, 20.) * step( .5, mod( pos.z, 10. ) ));


    //X
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.x, 10. ) );
    //Y
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.y, 10. ) );
    //Z
    gl_FragColor.rgb *= 1.-step( .5, mod( pos.z, 10. ) );

    //iso lines every 100 meter
    //gl_FragColor.rgb *= 1. - step( .2, mod( pos.z, 100. * scale ) );

    //*/

}
