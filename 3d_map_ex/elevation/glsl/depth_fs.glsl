varying float vDepth;

float shift_right (float v, float amt) {
    v = floor(v) + 0.5;
    return floor(v / exp2(amt));
}
float shift_left (float v, float amt) {
    return floor(v * exp2(amt) + 0.5);
}
float mask_last (float v, float bits) {
    return mod(v, shift_left(1.0, bits));
}
float extract_bits (float num, float from, float to) {
    from = floor(from + 0.5); to = floor(to + 0.5);
    return mask_last(shift_right(num, from), to - from);
}
vec4 encode_float (float val)
{
    if (val == 0.0) return vec4(0, 0, 0, 0);

    float sign = val > 0.0 ? 0.0 : 1.0;

    val = abs(val);

    float exponent = floor(log2(val));

    float biased_exponent = exponent + 127.0;

    float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0;

    float t = biased_exponent / 2.0;

    float last_bit_of_biased_exponent = fract(t) * 2.0;

    float remaining_bits_of_biased_exponent = floor(t);

    float byte4 = extract_bits(fraction, 0.0, 8.0) / 256.0;

    float byte3 = extract_bits(fraction, 8.0, 16.0) / 256.0;

    float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 256.0;

    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 256.0;

    return vec4(byte4, byte3, byte2, byte1);
}

const float pow_2_7 = pow( 2., 7. );
const float pow_2_23 = pow( 2., 23. );
const float pow_256_2 = pow( 256., 2. );

float decode_float( vec4 val ) {

	float a_256 =  val.a * 256.;
	float b_256 =  val.b * 256.;

	//float sign = ( val.a * 256. / pow_2_7 ) >= 1. ? -1. : 1.;
	//no branching
    float sign = 1. - step( 1., a_256 / pow_2_7 ) * 2.;

	//float s = a_256;
	//if( s > 127.5 ) s -= 127.5;
	//no branching
	float s = a_256 - step( 127.5, a_256 ) * 127.5;

	float exponent = s * 2. + floor( b_256 / pow_2_7 );
	float mantissa = ( val.r * 256. + val.g * pow_256_2 + clamp( b_256 - 128., 0., 256. ) * pow_256_2 );

	//float t = b_256;
	//if( t > 127.5 ) t -= 127.5;
	//no branching
	float t = b_256 - step( 127.5, b_256 ) * 127.5;

	mantissa = t * pow_256_2 + val.g * pow_256_2 + val.r * 256.;
	return sign * pow( 2., exponent - 127. ) * ( 1. + mantissa / pow_2_23 );

}

varying vec3 nor;
void main(){
    //gl_FragColor = vec4( vec3( decode_float( encode_float( vDepth ) ) ), 1. );
    gl_FragColor = vec4( vec3( vDepth, nor.x, nor.y ), 1. );
}
