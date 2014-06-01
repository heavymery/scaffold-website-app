document.addEventListener('DOMContentLoaded', function(event){
  console.log(event.currentTarget + '.' +  event.type);
}, false);

window.addEventListener('load', function(){
  console.log(event.currentTarget + '.' +  event.type);
}, false);
