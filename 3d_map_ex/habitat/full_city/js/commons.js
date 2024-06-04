var RAD = Math.PI / 180;
function lerp ( t, a, b ){ return a + t * ( b - a ); }
function norm( t, a, b ){return ( t - a ) / ( b - a );}
function getPositionAt( points, t ) {

    var length = points.length-1;
    var i0 = Math.floor( length * t );
    i0 = i0 < length - 1 ? i0 : length - 1;
    var i1 = Math.min( i0 + 1, length );

    var delta = 1 / length;
    var nt =  ( t - ( i0 * delta ) ) / delta;
    return {x:lerp( nt, points[i0].x, points[i1].x ),
        y:lerp( nt, points[i0].z, points[i1].z ) };
}

function distance( la0, ln0, la1, ln1){
    var dx = ln0-ln1;
    var dy = la0-la1;
    return ( dx*dx + dy*dy );
}