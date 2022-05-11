"use strict";

var canvas;
var gl;
var bufferName,bufferSurname, nameVertices, surnameVertices;
var vPosition;
var transformationMatrix, transformationMatrixLoc;

var rot = 0;
var pos = vec2(0,0);
var scale = vec2(1,1);
var color = [1.0, 0, 0, 1];
var colorLoc;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the letters
    nameVertices = [
    vec2(  -0.1,  0.3 ),
    vec2(  -0.1,  0.4 ),
    vec2(   -0.5,  0.3 ),
    vec2(  -0.5,  0.4 ),

    vec2(  -0.4,  0.4 ),
    vec2(  -0.5,  0.4 ),
    vec2(  -0.4,  -0.4 ),
    vec2(  -0.5 ,  -0.4 ),

    vec2( -0.5,  -0.3 ),
    vec2(  -0.5,  -0.4 ),
    vec2(  -0.1,  -0.3 ),
    vec2(  -0.1,  -0.4 ),

    vec2( -0.175,  -0.4 ),
    vec2(  -0.225,  -0.4 ),
    vec2(  -0.175,  -0.5 ),
    vec2(  -0.225,  -0.5 )

    ];

    surnameVertices = [
    vec2(  0.5,  0.4 ),
    vec2(  0.5,  0.3 ),
    vec2(  0.1,  0.4 ),
    vec2(  0.1,  0.3 ),

    vec2(  0.1,  0.4 ),
    vec2(  0.2,  0.4 ),
    vec2(  0.1,  -0.08 ),
    vec2(  0.2,  -0.08 ),

    vec2(  0.1,  0.08 ),
    vec2(  0.1,  -0.08 ),
    vec2(  0.5,  0.08 ),
    vec2(  0.5,  -0.08 ),

    vec2(  0.4,  0.08 ),
    vec2(  0.5,  0.08 ),
    vec2(  0.4,  -0.4 ),
    vec2(  0.5,  -0.4 ),

    vec2(  0.5,  -0.3 ),
    vec2(  0.5,  -0.4 ),
    vec2(  0.1,  -0.3 ),
    vec2(  0.1,  -0.4 ),

    vec2( 0.3,  -0.4 ),
    vec2(  0.35,  -0.4 ),
    vec2(  0.3,  -0.5 ),
    vec2(  0.35,  -0.5 )

    ];

    // Load the data into the GPU
    bufferName = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferName );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nameVertices), gl.STATIC_DRAW );


    // Load the data into the GPU
    bufferSurname = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSurname );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(surnameVertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
    colorLoc = gl.getUniformLocation(program,"u_color");
    document.getElementById("inp_objX").oninput = function(event) {
        pos[0] = event.target.value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        pos[1] = event.target.value;
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
        scale[0] = event.target.value;
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
        scale[1] = event.target.value;
    };
    document.getElementById("inp_rotation").oninput = function(event) {
        rot = event.target.value;
    };
    document.getElementById("redSlider").oninput = function(event) {
        color[0] = event.target.value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        color[1] = event.target.value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        color[2] = event.target.value;
    };

    render();

};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    transformationMatrix = mat4();
    transformationMatrix = mult(transformationMatrix, translate(pos[0], pos[1], 0));
    transformationMatrix = mult(transformationMatrix, rotateZ(rot));
    transformationMatrix = mult(transformationMatrix, scalem(scale[0], scale[1], 1));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv(colorLoc, flatten(color) );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferName);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0,16);




    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSurname );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 24);

    window.requestAnimFrame(render);
}