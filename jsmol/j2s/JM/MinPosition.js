Clazz.declarePackage("JM");
Clazz.load(["JM.MinObject"], "JM.MinPosition", null, function(){
var c$ = Clazz.declareType(JM, "MinPosition", JM.MinObject);
Clazz.makeConstructor(c$, 
function(data, ddata){
Clazz.superConstructor (this, JM.MinPosition, []);
this.data = data;
this.ddata = ddata;
}, "~A,~A");
});
;//5.0.1-v7 Thu Dec 18 09:19:10 CST 2025
