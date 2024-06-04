uniform sampler2D map;
varying vec2 vUv;
void main(){

    //texture mapping
    vec4 color = texture2D( map, vUv );
    gl_FragColor = color;

}
