
uniform sampler2D texture;
uniform sampler2D depth;
uniform vec2 resolution;
uniform float time;
const float blurSteps = 6.;

void main(){

    vec2 uv = gl_FragCoord.xy/resolution;

    vec4 t_color = texture2D( texture, uv );
    vec4 t_depth = texture2D( depth, uv );

    float bin = .5;
    float bout = bin + .5;
    float f_d = smoothstep( bin, bout, t_depth.r );

    vec4 blur = vec4(1.);
    for ( float i = 0.; i < blurSteps; i+=1.) {
        for ( float j = 0.; j < blurSteps; j+=1.) {
            blur += ( 1. / blurSteps )*texture2D( texture, uv + ( vec2( i-blurSteps*.5, j-blurSteps*.5 ) / 1024. ) );
        }
    }
    blur /= blurSteps;


    //DOF
    gl_FragColor = mix( t_color, blur, f_d );

    vec4 bg = vec4( vec3(length(uv-vec2(0.5,0.) ) ), 1. );
    vec4 color0 = vec4( 1., 1., 0.9, 1. );
    vec4 color1 = vec4( 0.65, 0.85, 0.8, 1. );

    bg = mix( color0, color1, sin(bg.r) );

    gl_FragColor += ( 1. - gl_FragColor.a ) * bg;


}
