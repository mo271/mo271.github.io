Clazz.declarePackage("JM");
(function(){
var c$ = Clazz.decorateAsClass(function(){
this.id = "";
this.type = ' ';
this.ticks = null;
this.tickLabelFormats = null;
this.scale = null;
this.first = 0;
this.signFactor = 1;
this.reference = null;
Clazz.instantialize(this, arguments);}, JM, "TickInfo", null);
Clazz.makeConstructor(c$, 
function(ticks){
this.ticks = ticks;
}, "JU.P3");
})();
;//5.0.1-v7 Thu Dec 18 09:19:10 CST 2025
