<?php

    $remote = isset( $_GET[ "remote" ] ) ? $_GET[ 'remote' ] : "";

    $folder = isset( $_GET[ "folder" ] ) ? $_GET[ 'folder' ] : "";
    $file = isset( $_GET[ "file" ] ) ? $_GET[ 'file' ] : "";

    if ( !file_exists( $folder) ){

        mkdir($folder, 0777, true);
    }

    if ( !file_exists( $folder.$file ) ){

        file_put_contents( $folder.$file, fopen( $remote, 'r' ) );
    }
?>