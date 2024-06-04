var Extrusion = function()
{
    function Extrusion( points, edges, material, height, uvMin, uvMax ){

        var inc = 0, p, i;

        //vertex pool
        var vertices = new Float32Array( points.length * 3 * 2  );
        for ( i = 0; i < points.length*2; i++ ) {
            p = points[ i % points.length ];
            vertices[inc++] = p[0];
            vertices[inc++] = i >= points.length ? height : 0;
            vertices[inc++] = p[1];
        }

        //uvs
        var uvs = new Float32Array( points.length * 2 * 2 );
        if( uvMin == null )uvMin = new THREE.Vector2(0,0);
        if( uvMax == null )uvMax = new THREE.Vector2(1,1);

        //get uv bounds
        var min = new THREE.Vector2( Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY );
        var max = new THREE.Vector2( Math.NEGATIVE_INFINITY, Math.NEGATIVE_INFINITY );
        inc = 0;
        for ( i = 0; i < points.length; i++ ){

            p = points[ i ];
            min.x = Math.min( p[0], min.x );
            min.y = Math.min( p[1], min.y );
            max.x = Math.max( p[0], max.x );
            max.y = Math.max( p[1], max.y );
        }

        //map uvs
        var uDelta = uvMax.x - uvMin.x;
        var vDelta = uvMax.y - uvMin.y;
        inc = 0;
        for( i = 0; i < points.length * 2; i++){
            p = points[ i % points.length ];
            uvs[ inc++ ] = uvMin.x + ( ( p[0] - min.x ) / ( max.x - min.x ) ) * uDelta;
            uvs[ inc++ ] = uvMin.y + ( ( p[1] - min.y ) / ( max.y - min.y ) ) * vDelta;
        }

        //tesselation: top
        cleanPSLG( points, edges );
        var result = cdt2d( points, edges, {exterior: false} );

        var capIndices = new Uint32Array( result.length * 3 );
        inc = 0;
        for ( i = 0; i < result.length; i++) {
            capIndices[inc++] = result[i][ 0 ] + points.length;
            capIndices[inc++] = result[i][ 1 ] + points.length;
            capIndices[inc++] = result[i][ 2 ] + points.length;
        }
        capIndices.reverse();

        //tesselation sides: extrusion
        var sideIndices = new Uint32Array( points.length * 3 * 2 );
        var sides = points.length;
        var step = 0, back, j, i0, i1, i2, i3;
        inc = 0;
        for ( i = 0; i < 2; i++ ){

            //create faces
            if ( step > 0 )
            {
                back = step - sides;
                for ( j = 0; j < sides; j++ ){

                    i0 = back + j;
                    i1 = back + ( j + 1 ) % sides;
                    i2 = step + j;
                    i3 = step + ( j + 1 ) % sides;

                    sideIndices[inc++] = i1;
                    sideIndices[inc++] = i0;
                    sideIndices[inc++] = i2;

                    sideIndices[inc++] = i1;
                    sideIndices[inc++] = i2;
                    sideIndices[inc++] = i3;

                }
            }
            step += sides;
        }

        //merging faces indices
        var indices = new Uint32Array( sideIndices.length + capIndices.length );
        indices.set( sideIndices );
        indices.set( capIndices, sideIndices.length );

        //build geometry
        var geom = new THREE.BufferGeometry();
        geom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
        geom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geom.addAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
        geom.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

        geom.needsUpdate = true;
        geom.computeBoundingSphere();
        geom.computeFaceNormals();

        THREE.Mesh.call( this, geom, material );
    }

    var _p = Extrusion.prototype = Object.create( THREE.Mesh.prototype );
    _p.constructor = Extrusion;
    return Extrusion;
}();