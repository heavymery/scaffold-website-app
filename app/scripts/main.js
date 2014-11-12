'use strict';

//------------------------------------------------------------------------------
//
//  Constants
//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//
//  Variables
//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//
//  Functions
//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//
//  Event handlers
//
//------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function(event){
  console.log(event.currentTarget + '.' +  event.type);
}, false);

window.addEventListener('load', function(event){
  console.log(event.currentTarget + '.' +  event.type);
}, false);


window.addEventListener('orientationchange', function(event) {
  console.log(event.currentTarget + '.' +  event.type);
  
  // Workarounds for iOS Safari landscape bug
  if(90 === window.orientation || -90 === window.orientation) {
    document.body.scrollTop = 0;
  }
  
}, false);
