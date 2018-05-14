protokolle[0].titel=protokolle[0].titel.replace("[","<span class=\"hiddenkomm\">[").replace("]","]</span>");
var Monat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni",
                      "Juli", "August", "September", "Oktober", "November", "Dezember");
var RMonat = new Array("I", "II", "III", "IV", "V", "VI",
                      "VII", "VIII", "IX", "X", "XI", "XII");
var Wochentag = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch",
                          "Donnerstag", "Freitag", "Samstag");                      
for(var i=0;i<protokolle.length;i++){
	protokolle[i].titel=protokolle[i].titel.replace(/\\\[/g,"latexinlinelinks").replace(/\\\]/g,"latexinlinerechts").replace(/\[/g,"<span class=\"hiddenkomm\">[").replace(/\]/g,"]</span>").replace(/\\\\newline/g,"<br>").replace(/\\newline/g,"<br>").replace(/\\textsuperscript{(.*?)}/g,"<sup>$1</sup>").replace(/--/g,"—").replace(/\\foreignlanguage{(.*?)}{(.*?)}/g,"$1: $2").replace(/latexinlinelinks/g,"\\\[").replace(/latexinlinerechts/g,"\\\]").replace(/!eKl!/g,"\$\[\$").replace(/!eKr!/g,"\$\]\$");
	protokolle[i].ktitel=protokolle[i].ktitel.replace(/\\\[/g,"latexinlinelinks").replace(/\\\]/g,"latexinlinerechts").replace(/\[/g,"<span class=\"hiddenkomm\">[").replace(/\]/g,"]</span>").replace(/\\\\newline/g,"<br>").replace(/\\newline/g,"<br>").replace(/\\textsuperscript{(.*?)}/g,"<sup>$1</sup>").replace(/--/g,"—").replace(/\\foreignlanguage{(.*?)}{(.*?)}/g,"$1: $2").replace(/latexinlinelinks/g,"\\\[").replace(/latexinlinerechts/g,"\\\]").replace(/!eKl!/g,"\$\[\$").replace(/!eKr!/g,"\$\]\$");
	protokolle[i].name=protokolle[i].name.replace(/\[/g,"<span class=\"hiddenkomm\">[").replace(/\]/g,"]</span>").replace(/\\newline/g,"<br>").replace(/\\foreignlanguage{(.*?)}{(.*?)}/g,"$1: $2").replace(/\\begin\{CJK\}\{UTF8\}\{min\}吉江琢兒\\end\{CJK\}/,"japanisch: 吉江琢兒");
	
	if (protokolle[i].dok) {
		var dt = new Date(protokolle[i].datum);
		var TagInWoche = dt.getDay();
		var Jahresmonat = dt.getMonth();
    	protokolle[i].datum=Wochentag[TagInWoche]+', '+dt.getDate()+'.'+RMonat[Jahresmonat]+'.'+dt.getFullYear();
    }
    else{ protokolle[i].datum='<i class="fa fa-question-circle" data-toggle="tooltip" data-placement="left" title="Unklarheit beim Datum"></i> <span class="komm1">'+protokolle[i].datum+"</span>";}
		
    if (protokolle[i]['derror']) {
		if (protokolle[i]['derror']=='andere Quelle'){
			protokolle[i].datum='<i class="fa fa-question-circle" data-toggle="tooltip" data-placement="left" title="Datum der Niederschrift oder aus anderer Quelle"></i> '+protokolle[i].datum;
		}
		if (protokolle[i]['derror']=='unbekannt'){
			protokolle[i].datum='<i class="fa fa-question-circle"></i><span class="komm"> ohne Datum</span>';
		}
		if (protokolle[i]['derror']=='dito'){
			var olddate ='';
			olddate=protokolle[i-1].datum;
			protokolle[i].datum='<i class="fa fa-ellipsis-h" data-toggle="tooltip" data-placement="left" title="Datum vom vorigen Vortrag übernommen"></i> '+olddate;
		}
	}
	
	if (!(protokolle[i].sok)){
		protokolle[i].seite='<i class="fa fa-question-circle"></i> '+protokolle[i].seite;
	}
	if (protokolle[i].titel==""){
		if (protokolle[i].ktitel!=""){
			protokolle[i].titel='<i class="fa fa-info-circle" data-toggle="tooltip" data-placement="left" title="Titel aus Inhaltsverzeichnis von F. Klein"></i> '+protokolle[i].ktitel;
		}
		else {
			protokolle[i].titel='<i class="fa fa-question-circle"></i><span class="komm"> ohne Titel</span>';
		}
	}
    if (protokolle[i].name.indexOf('?')>-1) {
        protokolle[i].name='<i class="fa fa-question-circle" data-toggle="tooltip" data-placement="left" title="Unsicherheit beim Namen"></i> ' +protokolle[i].name.replace(/\?/g,'');
    }
}
