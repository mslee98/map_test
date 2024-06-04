var TileBuffer = function() {

    //creates a single geometry from vertices buffers and edges informations ( and some extra shnizzle too )
    function TileBuffer( tile, bufferVertices, bufferEdges, material, bufferHeights, bufferUvs, bufferUIDs ){

        //might be useful ...
        this.tile = tile;

        var vertexCount = 0;
        bufferVertices.forEach( function(pts){ vertexCount += pts.length;});

        //vertex pool
        var vertices = new Float32Array( vertexCount * 3 * 2  );


        //uvs pool
        var uvs;
        var processUvs = bufferUvs == null ? false : true;
        if( processUvs ) uvs = new Float32Array( vertexCount * 2 * 2 );

        //creates a temp buffer for indices (as we don't know yet how many there will be)
        var indicesBuffer = [];

        //get all vertices, their associated uvs and performs triangulation + extrusion
        var inc = 0, p, i;

        var vertexInc = 0;
        var uvInc = 0;
        bufferVertices.forEach( function( points, k ){


            //uvs bounds
            if( processUvs ){
                var uvbounds = ( bufferUvs[ k ] == null ) ? new THREE.Vector4(0,0,1,1) : bufferUvs[ k ];

                //get uv min / max
                var min = new THREE.Vector2( Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY );
                var max = new THREE.Vector2( Math.NEGATIVE_INFINITY, Math.NEGATIVE_INFINITY );
            }

            //create vertx pool
            for ( i = 0; i < points.length * 2; i++ ) {

                //stores 2 versions of each point: the ground and the roof
                p = points[ i % points.length ];
                vertices[vertexInc++] = p[0];
                vertices[vertexInc++] = i >= points.length ? bufferHeights[ k ] : 0;//uses the extrusion height
                vertices[vertexInc++] = p[1];

                //check uv min / max
                if( processUvs ){
                    min.x = Math.min( p[0], min.x );
                    min.y = Math.min( p[1], min.y );
                    max.x = Math.max( p[0], max.x );
                    max.y = Math.max( p[1], max.y );
                }
            }

            //map uvs to uvBounds
            if( processUvs ){
                for( i = 0; i < points.length * 2; i++){
                    p = points[ i % points.length ];
                    uvs[ uvInc++ ] = uvbounds.x + ( ( p[0] - min.x ) / ( max.x - min.x ) ) * uvbounds.z;
                    uvs[ uvInc++ ] = uvbounds.y + ( ( p[1] - min.y ) / ( max.y - min.y ) ) * uvbounds.w;
                }
            }

            //retrieves edges corresponding to this vertices set
            var edges = bufferEdges[k];

            //tesselation: top
            var result = cdt2d( points, edges, {exterior: false} );

            var capIndices = new Uint32Array( result.length * 3 );
            var indicesInc = 0;
            for ( i = 0; i < result.length; i++) {
                capIndices[indicesInc++] = result[i][ 0 ] + points.length;
                capIndices[indicesInc++] = result[i][ 1 ] + points.length;
                capIndices[indicesInc++] = result[i][ 2 ] + points.length;
            }
            capIndices.reverse();

            //tesselation: sides ( extrusion )
            var sideIndices = new Uint32Array( points.length * 3 * 2 );
            var sides = points.length;
            var step = 0, back, j, i0, i1, i2, i3;
            indicesInc = 0;
            for ( i = 0; i < 2; i++ ){

                //create faces
                if ( step > 0 ){

                    back = step - sides;
                    for ( j = 0; j < sides; j++ ){

                        i0 = back + j;
                        i1 = back + ( j + 1 ) % sides;
                        i2 = step + j;
                        i3 = step + ( j + 1 ) % sides;

                        sideIndices[indicesInc++] = i1;
                        sideIndices[indicesInc++] = i0;
                        sideIndices[indicesInc++] = i2;

                        sideIndices[indicesInc++] = i1;
                        sideIndices[indicesInc++] = i2;
                        sideIndices[indicesInc++] = i3;

                    }
                }
                step += sides;
            }

            //merging faces indices, then we'll need to concatenate them
            var indices = new Uint32Array( sideIndices.length + capIndices.length );
            indices.set( sideIndices );
            indices.set( capIndices, sideIndices.length );

            indicesBuffer.push( indices );

        } );


        //per vertex attribute -> 1 float : vertex transparency
        var verticesRandom = new Float32Array( vertices.length );
        for( i = 0; i < vertices.length; i++ ){
            verticesRandom[ i ] = Math.random();
        }

        //merges all indices buffers into one
        var indicesCount = 0;
        indicesBuffer.forEach( function( ind ){ indicesCount += ind.length; });

        //final indices buffer
        var indices = new Uint32Array( indicesCount );

        //add custom attribute (uid)
        var height = new Float32Array( indicesCount );

        var indicesOffset = 0;
        inc = 0;

        indicesBuffer.forEach( function( ind, i ){

            //the indices offset is the length of the previous vertexbuffer * height 'slices' count ( default 2 for linear extrusion )
            if( i > 0 ) indicesOffset += bufferVertices[ ( i - 1 )].length * 2;

            //per face value
            var faceIdInc = 0;

            //recursively adds all the faces' indices
            for( var j = 0; j < ind.length; j++){

                //vid : indicesOffset + uidInc = the vertex index of all vertices belonging to this face
                var vid = indicesOffset + faceIdInc++;
                height[ vid ] = vertices[ vid * 3 + 1 ];//gets the Y value of this vertex

                indices[inc++] = indicesOffset + ind[ j ];
            }

        });

        //build geometry
        var geom = new THREE.BufferGeometry();
        geom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
        geom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geom.addAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
        if( processUvs )geom.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

        //custom attributes

            //per vertex
            geom.addAttribute( 'random',  new THREE.BufferAttribute( verticesRandom, 1 )  );

            //per face
            geom.addAttribute( 'height',  new THREE.BufferAttribute( height, 1 )  );


        //geom.needsUpdate = true;
        //geom.computeBoundingSphere();
        //geom.computeFaceNormals();

        THREE.Mesh.call( this, geom, material );

    }

    var _p = TileBuffer.prototype = Object.create( THREE.Mesh.prototype );
    _p.constructor = TileBuffer;
    return TileBuffer;
}();
