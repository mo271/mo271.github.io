$(function() {
			$('#side-menu').metisMenu();	//side menu collapse
		});
		$.dynatableSetup({
					  dataset: {
							perPageDefault: 25,
							perPageOptions: [10,25,50,100,500,1000,1500],
					  },
		});
function hideprevnext(idnr) {
	if (idnr==1) {
		$('#einzelalarm .prev').addClass("disabled");
		
	}
	else if (idnr==1204) {
		$('#einzelalarm .next').addClass("disabled");
	}
	else{
		$('#einzelalarm .prev').removeClass("disabled");
		$('#einzelalarm .next').removeClass("disabled");
	}
	return false;
}
            
var updateeinzelwarnung=function(){
		if (typeof tabledata.settings.dataset.queries.frage != "undefined"){
			if (tabledata.settings.dataset.queries.frage.indexOf("id")>-1){
				idnr=tabledata.settings.dataset.queries.frage.split('-')[1];
				
				semstr=protokolle[idnr-1].sn;
				semstr=semstr%1 ? semstr : semstr+'.0';
				semstr='sn-'+semstr
				$('#einzelalarm').show();
				$('#einzelband').html("Band "+protokolle[idnr-1].band);
				$('#einzelband').attr("href", '#band-'+protokolle[idnr-1].band);
				$('#einzelsemester').html(titeldict[semstr].replace('<br>',''));
				$('#einzelsemester').attr("href", '#'+semstr);
				
				var idzahl = parseInt(tabledata.settings.dataset.queries.frage.split('-')[1])
				var prevint=parseInt(idzahl)-1
				var nextint=parseInt(prevint)+2
				
				hideprevnext(idnr);
				$('#einzelalarm a.controls.previous').attr("href",'#id-'+prevint)
				$('#einzelalarm a.controls.next').attr("href",'#id-'+nextint)

			}
			else{
				$('#einzelalarm').hide();
			}
		}
		else{
			$('#einzelalarm').hide();
		}
		
}
var updatesuchwarnung=function(){
		if (typeof tabledata.settings.dataset.queries.search != "undefined"){
			if (tabledata.settings.dataset.queries.search!=""){
				$('.suchalarm').show();
                if ((window.location.hash=='') || (window.location.hash=='#')) {
                    $('.suchealle').hide();
                }
                $('#suchwort').html(tabledata.settings.dataset.queries.search);
			}
			else{
				$('.suchalarm').hide();
			}
		}
		else{
			$('.suchalarm').hide();
		}
		
}
var updatetitel = function(){
		if (typeof tabledata.settings.dataset.queries.frage != "undefined"){
			var anfrage=tabledata.settings.dataset.queries.frage.split('-');
			if ((anfrage[0]=='band') || (anfrage[0]=='sn')){
				$('#seitentitel').show();
				$('#seitentitel').html(titeldict[tabledata.settings.dataset.queries.frage]);
			}
			else if (anfrage[0]=='id'){
				$('#seitentitel').hide();
				
			}
			else{
				$('#seitentitel').show();
				$('#seitentitel').html('Sämtliche Protokolle 1872–1912');
			}
		}
		else{
			$('#seitentitel').show();
			$('#seitentitel').html('Sämtliche Protokolle 1872–1912');
		}
		$('#seitentitel').find('.nonorigtitel').prepend('<i class="fa fa-info-circle"></i> ');
		
}


mytable = "";
tabledata =""; 
$.fn.bootstrapSwitch.defaults.offText= 'aus'; 
$.fn.bootstrapSwitch.defaults.onText= 'an';
$.fn.bootstrapSwitch.defaults.size="normal";

var processingComplete = function(){
            $(function () {
                $("[data-toggle='tooltip']").tooltip();
            });
			updatetitel();	
			if ($('#check').is(':checked')){
							 $('#seitentitel').find('.hiddenkomm').show();
							 $( ".hiddenkomm" ).show();
														 }
					 else{	 
							 $('#seitentitel').find('.hiddenkomm').hide();
							 $( ".hiddenkomm" ).hide();
					 }
			
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"my-final-table"]);
			updatesuchwarnung();
            updateeinzelwarnung();
            $(function () {
                $("[data-toggle='tooltip']").tooltip();
            });
            
	}
		function meinsemestersort(record, queryValue) {
				if (queryValue == record.sn){
						return true;                    
				}
				return false;
	   }
	   function meinbandsort(record, queryValue)  {
		if (queryValue == record.band){
				return true;                    
		}
		return false;
		}
		function meinsort(record, queryValue)  {
			anfrage=queryValue.split('-');
			return (anfrage[1]==record[anfrage[0]]) ?  true : false;
		 }
		
		 
	   function pad(n) {
			return (n < 10) ? ("00" + n) : (n<100) ? ("0"+n) : n;
		}
		function genseitenlink(record){
			var prefix= htmlprefixbaende[record.band-1];
			var teil='';
			var teil2='';
			if (record.band==1 || record.band==16){
				if (record.sn>=1878 && record.sn!=1900){
					var teil='-part2';
					var teil2='.2';
				}
				else{
					var teil='-part1';
					var teil2='.1';
				}
			}
		return '<a class="oeffneModal" href="#"  band="'+record.band+'" seite="'+record.seite.toString().replace(/\D/g, '')+'" prefix="'+prefix+ '" teil="'+teil+'" ><i data-toggle="tooltip" data-placement="left" title="Öffne in Viewer" class="fa fa-file-text-o"></i> Band '+record.band+teil2+', Seite '+record.seite+'</a>'
		}	
		function meinRowWriter(rowIndex, record, columns, cellWriter) {
			  var cssClass = "list-group-item", li, seitenzahllink;
			  seitenzahllink=genseitenlink(record)
			  li = '<li class="' + cssClass + '"<div><p class="datump"><span class="datumspan">' + record.datum + '</span></p><h4>' + record.titel + '</h4><p class="namep"><span id="namespan">'+record.name+'</span></p><p class="linkp">'+seitenzahllink+' <a href="#id-'+record.id+'" data-toggle="tooltip" data-placement="right" title="Einzelansicht"><i class="fa fa-link"></i></a></p></div></li>';
			  return li;
		}
		$('.englisch').toggle();
$( document ).ready(  function() {
	$('.englisch').toggle();
	$('[data-toggle=offcanvas]').click(function () {
		$('.row-offcanvas').toggleClass('active')
	});
	$('#aboutlink a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
	});
	$('.heimlink').click(function (e) {
        $( "#homelink" ).trigger( "click" );
        });
	$('.heimlink #homelink a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
          return false;
	});
	$('#homelink').hide();
	$('.navbar-brand').click( function() {
		if ($('#fkp').hasClass('active')) {
            $("a#allebaende")[0].click();
        }
        $( "#homelink" ).trigger( "click" );
        return false;
	});
	$("[name='my-checkbox']").bootstrapSwitch('state',true);
	$('.switchsprache').click( function(e) {
			e.preventDefault();
			$('.englisch').toggle();
			$('.deutsch').toggle();
		}); 			
		mytable = $('#my-final-table').dynatable({
				dataset: {
					records:protokolle
				},
				table: {
					bodyRowSelector: 'li'
				},
				features: { 
					pushState: false,
					search: false
				},
				inputs: {
					queries: $('#search'),
					paginationClass: 'pagination',
					paginationActiveClass: 'active',
					paginationDisabledClass: 'disabled',
					paginationPrev: '«',
					paginationNext: '»',
					perPageText: 'Zeige: ',
					recordCountText: '',
					perPagePlacement: 'after'
				},
				params: {
					records: 'Protokollen'
				},
				writers: {_rowWriter: meinRowWriter},
		});
		
		$('#dynatable-record-count-my-final-table').appendTo('#erstercontainer');
		$('#dynatable-pagination-links-my-final-table').appendTo('#zweitercontainer');
		$('.dynatable-per-page').appendTo('#drittercontainer');
		tabledata=mytable.data("dynatable");
		mytable.bind('dynatable:afterProcess', processingComplete);
		tabledata.queries.functions['frage'] = meinsort;
		
		function tabelleanfrage (){
			if ((window.location.hash=='') || (window.location.hash=='#')) {
				tabledata.queries.remove("frage");
                tabledata.process();
            }
            if (window.location.hash.indexOf('-')>-1) {
                if (window.location.hash.indexOf('suche')>-1) {
                    tabledata.queries.remove("frage");
                    tabledata.queries.remove("search");
                    tabledata.queries.add("search", window.location.hash.split('-')[1]);
                    tabledata.process();
                }
                else {
                    tabledata.queries.remove("frage");
                    tabledata.queries.add("frage",window.location.hash.replace('#',''));
                    tabledata.process();
                    }
			}
		return false;
		}
		tabelleanfrage();
		$(window).on('hashchange', function() { 
			tabelleanfrage();                    
		});
		processingComplete();
		$("#dynatable-per-page-my-final-table").select2({
			minimumResultsForSearch: -1
		});
		$( "#kommentarlabel").click(function(e) {
			e.preventDefault();
			
			$("[name='my-checkbox']").bootstrapSwitch('toggleState');
			processingComplete();                   
		});
		$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
			processingComplete();
		}); 
		
		
		$('#my-final-table').delegate("a.oeffneModal", "click",  function(event) {
			e=$(event.target)
			var prefix=$(event.target).attr("prefix")
			var band=e.attr("band")
			var teil=e.attr("teil")
			var seite=e.attr("seite")
			var bildurl='http:\/\/www.uni-math.gwdg.de\/aufzeichnungen\/klein-scans\/klein\/'+prefix+'/V'+band+teil+'-p'+pad(seite)+'_low.jpg'
			var longprefix='http:\/\/www.uni-math.gwdg.de\/aufzeichnungen\/klein-scans\/klein\/'+prefix+'/V'+band+teil+'-p'
			hideprev(seite);
			
			processbild="ico/proc.gif";
			$('#hauptbild').attr("src", processbild);
			$('.magnify-large').css("background","url('" + processbild + "') no-repeat");
			
			$('#myModal').modal({
				"backdrop" : "true",
				"show":true
			})
            $('#hauptbild').attr("band",band);
			$('#hauptbild').attr("src", bildurl);
			$('#hauptbild').attr("longprefix", longprefix);
			$('#hauptbild').attr("seite", seite);
			$('.magnify-large').css("background","url('" + bildurl + "') no-repeat");
			fuellelowmedhigh();
			
			return false;
		});
		$('#myModal').on('hidden.bs.modal', function () {
			processbild="ico/proc.gif";
			$('#hauptbild').attr("src", processbild);
			$('.magnify-large').css("background","url('" + processbild + "') no-repeat");
			})	
			
		$('#myModal .controls').click( function(event) {
			var seite = parseInt($('#hauptbild').attr("seite"));
			var prevint=parseInt(seite)-1
			var nextint=parseInt(prevint)+2
			var neuseite
			$('#hauptbild').hide()
			processbild="ico/proc.gif";
			$('#hauptbild').attr("src", processbild);
			$('.magnify-large').css("background","url('" + processbild + "') no-repeat");
			$('#hauptbild').show()
			$('#myModal').modal({
				"backdrop" : "true",
				"show":true
			})
			if($(this).hasClass('previous')){ 
				neuseite=prevint;
			}
			else{
				neuseite=nextint;
			}	
			hideprev(neuseite);
			
			
			var bildurl=$('#hauptbild').attr("longprefix")+pad(neuseite)+'_low.jpg';  
			$('#hauptbild').attr("src", bildurl);
			$('#hauptbild').attr("seite", neuseite);
			$('.magnify-large').css("background","url('" + bildurl + "') no-repeat");
			fuellelowmedhigh();
			return false;
		});
		function hideprev(seite) {
			if (seite==1) {
				$('#myModal .prev').addClass("disabled");
				
			}
			else {
				$('#myModal .prev').removeClass("disabled");
			}
			return false;
		}
		function fuellelowmedhigh(){
			var longprefix=$('#hauptbild').attr("longprefix");
			var seite = $('#hauptbild').attr("seite");
            var band = $('#hauptbild').attr("band");
			$('#kleinpic').attr("href",longprefix+pad(seite)+'_low.jpg');
			$('#mittelpic').attr("href",longprefix+pad(seite)+'_normal.jpg');
			$('#grosspic').attr("href",longprefix+pad(seite)+'_high.jpg');
            $('#myModalLabel').html("Band "+band+", Seite "+seite);
			return false;
		}
        
		$('.sucheloeschen').click( function(e){
            e.preventDefault();
			tabledata.queries.remove('search');
            tabledata.process();
		});
		$('.einzelloeschen').click( function(e){
            //e.preventDefault();
			tabledata.queries.remove('frage');
			tabledata.process();
		});
        $('#search').bind('keypress', function(e) {
            if (e.which == 13) {
              $("#homelink").trigger( "click" );
            }
        });
		$('#searchbutton').on("click",  function(event){
            $("#homelink").trigger( "click" );
        });
        
});
