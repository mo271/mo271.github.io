Clazz.declarePackage("javajs.api");
(function(){
var c$ = Clazz.declareType(javajs.api, "Interface", null);
c$.getInterface = Clazz.defineMethod(c$, "getInterface", 
function(name){
try {
var x = Clazz._4Name(name);
return (x == null ? null : x.newInstance());
} catch (e) {
if (Clazz.exceptionOf(e, Exception)){
System.out.println("Interface.java Error creating instance for " + name + ": \n" + e);
return null;
} else {
throw e;
}
}
}, "~S");
})();
;//5.0.1-v7 Thu Dec 18 09:19:10 CST 2025
