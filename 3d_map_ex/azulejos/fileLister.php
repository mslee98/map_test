<?php


    $path = isset( $_GET['path'] ) ? $_GET['path'] : "./512/";
    $files = scandir( $path );

    $str = "'";
    foreach( $files as $name )
    {
        if( $name == "." || $name == ".." )continue;

        if ( strrpos( $name, ".zip" ) === false ) {
            $str .= $name."','";
            continue;
        }

    }
    echo $str."'";

?>