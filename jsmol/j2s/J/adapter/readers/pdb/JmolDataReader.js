Clazz.declarePackage("J.adapter.readers.pdb");
Clazz.load(["J.adapter.readers.pdb.PdbReader"], "J.adapter.readers.pdb.JmolDataReader", ["java.util.Hashtable", "JU.P3", "$.PT", "JU.Logger", "$.Parser", "$.Vibration"], function(){
var c$ = Clazz.decorateAsClass(function(){
this.props = null;
this.residueNames = null;
this.atomNames = null;
this.isSpin = false;
this.spinFactor = 0;
this.originatingModel = -1;
this.jmolDataHeader = null;
this.jmolDataScaling = null;
Clazz.instantialize(this, arguments);}, J.adapter.readers.pdb, "JmolDataReader", J.adapter.readers.pdb.PdbReader);
Clazz.overrideMethod(c$, "checkRemark", 
function(){
while (true) {
if (this.line.length < 30 || this.line.indexOf("Jmol") != 11) break;
switch ("Ppard".indexOf(this.line.substring(16, 17))) {
case 0:
this.props =  new java.util.Hashtable();
this.isSpin = (this.line.indexOf(": spin;") >= 0);
this.originatingModel = -1;
var pt = this.line.indexOf("for model ");
if (pt > 0) this.originatingModel = JU.PT.parseInt(this.line.substring(pt + 10));
this.jmolDataHeader = this.line;
if (!this.line.endsWith("#noautobond")) this.line += "#noautobond";
break;
case 1:
var pt1 = this.line.indexOf("[");
var pt2 = this.line.indexOf("]");
if (pt1 < 25 || pt2 <= pt1) return;
var name = this.line.substring(25, pt1).trim();
this.line = this.line.substring(pt1 + 1, pt2).$replace(',', ' ');
var tokens = this.getTokens();
JU.Logger.info("reading " + name + " " + tokens.length);
var prop =  Clazz.newFloatArray (tokens.length, 0);
for (var i = prop.length; --i >= 0; ) prop[i] = this.parseFloatStr(tokens[i]);

this.props.put(name, prop);
break;
case 2:
this.line = this.line.substring(27);
this.atomNames = this.getTokens();
JU.Logger.info("reading atom names " + this.atomNames.length);
break;
case 3:
this.line = this.line.substring(30);
this.residueNames = this.getTokens();
JU.Logger.info("reading residue names " + this.residueNames.length);
break;
case 4:
JU.Logger.info(this.line);
var data =  Clazz.newFloatArray (15, 0);
JU.Parser.parseStringInfestedFloatArray(this.line.substring(10).$replace('=', ' ').$replace('{', ' ').$replace('}', ' '), null, data);
var minXYZ = JU.P3.new3(data[0], data[1], data[2]);
var maxXYZ = JU.P3.new3(data[3], data[4], data[5]);
this.fileScaling = JU.P3.new3(data[6], data[7], data[8]);
this.fileOffset = JU.P3.new3(data[9], data[10], data[11]);
var plotScale = JU.P3.new3(data[12], data[13], data[14]);
if (plotScale.x <= 0) plotScale.x = 100;
if (plotScale.y <= 0) plotScale.y = 100;
if (plotScale.z <= 0) plotScale.z = 100;
if (this.fileScaling.y == 0) this.fileScaling.y = 1;
if (this.fileScaling.z == 0) this.fileScaling.z = 1;
if (this.isSpin) {
this.spinFactor = plotScale.x / maxXYZ.x;
} else {
this.setFractionalCoordinates(true);
this.latticeCells =  Clazz.newIntArray (4, 0);
this.asc.xtalSymmetry = null;
this.setUnitCell(plotScale.x * 2 / (maxXYZ.x - minXYZ.x), plotScale.y * 2 / (maxXYZ.y - minXYZ.y), plotScale.z * 2 / (maxXYZ.z == minXYZ.z ? 1 : maxXYZ.z - minXYZ.z), 90, 90, 90);
this.unitCellOffset = JU.P3.newP(plotScale);
this.unitCellOffset.scale(-1);
this.getSymmetry();
this.symmetry.toFractional(this.unitCellOffset, false);
this.unitCellOffset.scaleAdd2(-1.0, minXYZ, this.unitCellOffset);
this.symmetry.setOffsetPt(this.unitCellOffset);
this.doApplySymmetry = true;
}this.jmolDataScaling =  Clazz.newArray(-1, [minXYZ, maxXYZ, plotScale]);
break;
}
break;
}
this.checkCurrentLineForScript();
});
Clazz.defineMethod(c$, "processAtom2", 
function(atom, serial, x, y, z, charge){
if (this.isSpin) {
var vib =  new JU.Vibration();
vib.set(x, y, z);
vib.isFrom000 = true;
atom.vib = vib;
x *= this.spinFactor;
y *= this.spinFactor;
z *= this.spinFactor;
}Clazz.superCall(this, J.adapter.readers.pdb.JmolDataReader, "processAtom2", [atom, serial, x, y, z, charge]);
}, "J.adapter.smarter.Atom,~N,~N,~N,~N,~N");
Clazz.overrideMethod(c$, "setAdditionalAtomParameters", 
function(atom){
if (this.residueNames != null && atom.index < this.residueNames.length) atom.group3 = this.residueNames[atom.index];
if (this.atomNames != null && atom.index < this.atomNames.length) atom.atomName = this.atomNames[atom.index];
}, "J.adapter.smarter.Atom");
Clazz.overrideMethod(c$, "finalizeSubclassReader", 
function(){
if (this.jmolDataHeader == null) return;
var info =  new java.util.Hashtable();
info.put("header", this.jmolDataHeader);
info.put("originatingModel", Integer.$valueOf(this.originatingModel));
info.put("properties", this.props);
info.put("jmolDataScaling", this.jmolDataScaling);
this.asc.setInfo("jmolData", info);
this.finalizeReaderPDB();
});
});
;//5.0.1-v7 Wed Dec 31 19:17:46 CST 2025
