var Section = function()
{
    function Section( points, edges, material, height, uvMin, uvMax ){


        var inc = 0;
        var vertices = new Float32Array( points.length * 3  );
        var uvs = new Float32Array( points.length * 2 );

        //uvs
        if( uvMin == null )uvMin = new THREE.Vector2(0,0);
        if( uvMax == null )uvMax = new THREE.Vector2(1,1);

        //get uv bounds
        var min = new THREE.Vector2( Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY );
        var max = new THREE.Vector2( Math.NEGATIVE_INFINITY, Math.NEGATIVE_INFINITY );
        inc = 0;
        for (var i = 0; i < points.length; i++ ){

            var p = points[ i ];

            vertices[inc++] = p[0];
            vertices[inc++] = height || 0;
            vertices[inc++] = p[1];

            min.x = Math.min( p[0], min.x );
            min.y = Math.min( p[1], min.y );
            max.x = Math.max( p[0], max.x );
            max.y = Math.max( p[1], max.y );
        }

        //map uvs
        var uDelta = uvMax.x - uvMin.x;
        var vDelta = uvMax.y - uvMin.y;
        inc = 0;
        for( i = 0; i < points.length; i++){
            p = points[ i ];
            uvs[ inc++ ] = uvMin.x + ( ( p[0] - min.x ) / ( max.x - min.x ) ) * uDelta;
            uvs[ inc++ ] = 1 - uvMin.y + ( ( p[1] - min.y ) / ( max.y - min.y ) ) * vDelta;
        }

        //tesselation;
        cleanPSLG( points, edges );
        var result = cdt2d( points, edges, {exterior: false} );

        var indices = new Uint32Array( result.length * 3 );
        inc = 0;
        for ( i = 0; i < result.length; i++) {
            indices[inc++] = result[i][ 0 ];
            indices[inc++] = result[i][ 1 ];
            indices[inc++] = result[i][ 2 ];
        }

        //build geometry
        var geom = new THREE.BufferGeometry();
        geom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
        geom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geom.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

        geom.needsUpdate = true;
        geom.computeBoundingSphere();
        geom.computeFaceNormals();
        THREE.Mesh.call( this, geom, material );

    }

    //utility to flip coordinates from one axis to another
    Section.switchAxis = function( section, a, b ){
        var i, p, t;
        for( i = 0; i < section.geometry.vertices.length; i++ )
        {
            p = section.geometry.vertices[ i ];
            t = p[ b ];
            p[ b ] = p[ a ];
            p[ a ] = t;
        }
        return section;
    };

    var _p = Section.prototype = Object.create( THREE.Mesh.prototype );
    _p.constructor = Section;
    return Section;
}();
