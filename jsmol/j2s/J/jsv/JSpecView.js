Clazz.declarePackage("J.jsv");
Clazz.load(["J.api.JmolJSpecView"], "J.jsv.JSpecView", ["java.util.Hashtable", "JU.BS", "$.Lst", "$.PT", "JU.Escape", "$.Logger", "JV.FileManager"], function(){
var c$ = Clazz.decorateAsClass(function(){
this.jmolViewer = null;
Clazz.instantialize(this, arguments);}, J.jsv, "JSpecView", null, J.api.JmolJSpecView);
Clazz.overrideMethod(c$, "setViewer", 
function(vwr){
this.jmolViewer = vwr;
}, "JV.Viewer");
Clazz.overrideMethod(c$, "atomPicked", 
function(atomIndex){
if (atomIndex < 0) return;
var peak = this.getPeakAtomRecord(atomIndex);
if (peak != null) this.sendJSpecView(peak + " src=\"JmolAtomSelect\"");
}, "~N");
Clazz.defineMethod(c$, "getPeakAtomRecord", 
function(atomIndex){
var atoms = this.jmolViewer.ms.at;
var iModel = atoms[atomIndex].mi;
var type = null;
switch (atoms[atomIndex].getElementNumber()) {
case 1:
type = "1HNMR";
break;
case 6:
type = "13CNMR";
break;
default:
return null;
}
var peaks = this.jmolViewer.ms.getInfo(iModel, "jdxAtomSelect_" + type);
if (peaks == null) return null;
this.jmolViewer.ms.htPeaks =  new java.util.Hashtable();
var htPeaks = this.jmolViewer.ms.htPeaks;
for (var i = 0; i < peaks.size(); i++) {
var peak = peaks.get(i);
System.out.println("Jmol JSpecView.java peak=" + peak);
var bsPeak = htPeaks.get(peak);
System.out.println("Jmol JSpecView.java bspeak=" + bsPeak);
if (bsPeak == null) {
htPeaks.put(peak, bsPeak =  new JU.BS());
var satoms = JU.PT.getQuotedAttribute(peak, "atoms");
var select = JU.PT.getQuotedAttribute(peak, "select");
System.out.println("Jmol JSpecView.java satoms select " + satoms + " " + select);
var script = "";
if (satoms != null) script += "visible & (atomno=" + JU.PT.rep(satoms, ",", " or atomno=") + ")";
 else if (select != null) script += "visible & (" + select + ")";
System.out.println("Jmol JSpecView.java script : " + script);
bsPeak.or(this.jmolViewer.getAtomBitSet(script));
}System.out.println("Jmol JSpecView bsPeak now : " + bsPeak + " " + atomIndex);
if (bsPeak.get(atomIndex)) return peak;
}
return null;
}, "~N");
Clazz.defineMethod(c$, "sendJSpecView", 
function(peak){
var msg = JU.PT.getQuotedAttribute(peak, "title");
if (msg != null) this.jmolViewer.scriptEcho(JU.Logger.debugging ? peak : msg);
peak = this.jmolViewer.fullName + "JSpecView: " + peak;
JU.Logger.info("Jmol.JSpecView.sendJSpecView Jmol>JSV " + peak);
this.jmolViewer.sm.syncSend(peak, ">", 0);
}, "~S");
Clazz.overrideMethod(c$, "setModel", 
function(modelIndex){
var syncMode = ("sync on".equals(this.jmolViewer.ms.getInfoM("jmolscript")) ? 1 : this.jmolViewer.sm.getSyncMode());
if (syncMode != 1) return;
var peak = this.jmolViewer.ms.getInfo(modelIndex, "jdxModelSelect");
if (peak != null) this.sendJSpecView(peak + " src=\"Jmol\"");
}, "~N");
Clazz.overrideMethod(c$, "getBaseModelIndex", 
function(modelIndex){
var baseModel = this.jmolViewer.ms.getInfo(modelIndex, "jdxBaseModel");
if (baseModel != null) for (var i = this.jmolViewer.ms.mc; --i >= 0; ) if (baseModel.equals(this.jmolViewer.ms.getInfo(i, "jdxModelID"))) return i;

return modelIndex;
}, "~N");
Clazz.overrideMethod(c$, "processSync", 
function(script, jsvMode){
if (JU.Logger.debugging) JU.Logger.info("J.jsv.JSpecView jsvMode=" + jsvMode + " script=" + script);
var msg = null;
switch (jsvMode) {
case 0:
msg = script.substring(10);
break;
case 77:
case 28:
case 35:
msg = script;
break;
}
if (msg != null) {
msg = this.jmolViewer.fullName + "JSpecView" + script;
this.jmolViewer.sm.syncSend(msg, ">", 0);
return null;
}switch (jsvMode) {
default:
return null;
case 21:
if (this.jmolViewer.isApplet) return null;
return null;
case 14:
var filename = JU.PT.getQuotedAttribute(script, "file");
var isSimulation = (filename != null && filename.startsWith(JV.FileManager.SIMULATION_PROTOCOL));
var id = (!isSimulation || this.jmolViewer.isApplet ? "" : JU.PT.getQuotedAttribute(filename.$replace('\'', '"'), "id"));
if (isSimulation && !this.jmolViewer.isApplet && (filename.startsWith(JV.FileManager.SIMULATION_PROTOCOL + "C13/MOL=") || filename.startsWith(JV.FileManager.SIMULATION_PROTOCOL + "H1/MOL="))) filename = null;
 else filename = JU.PT.rep(filename, "#molfile", "");
var modelID = (isSimulation ? "molfile" : JU.PT.getQuotedAttribute(script, "model"));
var baseModel = JU.PT.getQuotedAttribute(script, "baseModel");
var atoms = JU.PT.getQuotedAttribute(script, "atoms");
var select = JU.PT.getQuotedAttribute(script, "select");
var script2 = JU.PT.getQuotedAttribute(script, "script");
if (id == null || id.length == 0) id = (modelID == null ? null : (filename == null ? "" : filename + "#") + modelID);
if ("".equals(baseModel)) id += ".baseModel";
var modelIndex = (id == null ? -3 : this.jmolViewer.getModelIndexFromId(id));
if (modelIndex == -2) return null;
if (modelIndex != -1 || filename == null) {
script = "";
} else if (isSimulation && !this.jmolViewer.isApplet) {
return null;
} else {
if (isSimulation) filename += "#molfile";
script = "load " + JU.PT.esc(filename);
}if (id != null) script += ";model " + JU.PT.esc(id);
if (atoms != null) script += ";select visible & (@" + JU.PT.rep(atoms, ",", " or @") + ")";
 else if (select != null) script += ";select visible & (" + select + ")";
if (script2 != null) script += ";" + script2;
return script;
case 7:
var list = JU.Escape.unescapeStringArray(script.substring(7));
var peaks =  new JU.Lst();
var type = "1HNMR";
for (var i = 0; i < list.length; i++) {
if (i == 0 && list[i].indexOf(JV.FileManager.SIMULATION_PROTOCOL + "C13/") >= 0) type = "13CNMR";
peaks.addLast(list[i]);
}
this.jmolViewer.ms.setInfo(this.jmolViewer.am.cmi, "jdxAtomSelect_" + type, peaks);
return null;
}
}, "~S,~N");
});
;//5.0.1-v7 Wed Dec 31 19:17:46 CST 2025
