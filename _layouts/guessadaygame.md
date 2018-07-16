---
layout: special

---
{% assign linkurl = site.baseurl | append: "/" | append: page.newtitlelink %}
<div id="outer_div" class="game">
<h1 id="randomdate"></h1>
<ul id="date-table"><li id="0"></li><li id="1"></li><li id="2"></li><li id="3"></li><li id="4"></li><li id="5"></li><li id="6"></li></ul>
</div>
<div class="noprint"><div>
{{ page.howtoplay | replace: '!SITE_URL!', linkurl  }}</div>
</div><div class="noprint">
{{ content }}
</div>
<script>
var correct_day = -1;
var state = 0;
function random_date() {
var start = new Date(1900,0,1);
var end = new Date(2050,11,31);
var sunday = new Date(1985,10,3);
var weekday = new Date(sunday);
for (var i = 0; i < childs.length; i++){
    childs[i].innerHTML = weekday.toLocaleDateString("{{ page.language }}", {weekday: 'long'});
    childs[i].style.textDecoration = "none";
    childs[i].style.color = "initial";
    weekday.setDate(weekday.getDate() + 1);
  }

var span = end.getTime() - start.getTime();
var randomdate = new Date(start.getTime()+Math.floor(Math.random()*span));
correct_day = randomdate.getDay();
var options = { year: 'numeric', month: 'long', day: 'numeric' };
console.log(randomdate);
console.log(correct_day);
document.getElementById("randomdate").innerHTML = randomdate.toLocaleDateString("{{ page.language }}", options);
state = 0;
}

function check_id(element) {
  var guessed_day = element.id;
  if (state == 0){
   if(guessed_day == correct_day){
    for (var i = 0; i < childs.length; i++){
     if (childs[i].id != correct_day){
       childs[i].style.color = "#{{ site.backgroundcolor }}";
     }
     else {
       childs[i].style.color = "#{{ site.brandcolor }}";
     }
    }
   }
   else {
     for (var i = 0; i < childs.length; i++){
      if (childs[i].id == correct_day){
        childs[i].style.color = "#{{ site.brandcolor }}"
      }
      else if (childs[i].id == guessed_day){
        childs[i].style.color = "#{{ site.greycolor }}";
        childs[i].style.textDecoration = "line-through";
      }
      else {
        childs[i].style.color = "#{{ site.backgroundcolor }}";
     }
    }
   }
  }
}


document.getElementById("randomdate").addEventListener('click', function(){
  {
    random_date();
    state = 0;
  }

}, true);

document.getElementById("date-table").addEventListener('click', function() {
  //console.log("außenstart"+state);
  if (state == 1){
    random_date();
    state = 0;
  }
  else {
    state = 1;
  }
  //console.log("außenend"+state);
}, false);

var childs = document.getElementById("date-table").childNodes;
for (var i = 0; i < childs.length; i++){
    childs[i].addEventListener('click', function() {
    //  console.log("innenstart"+state);
      check_id(this);
    //console.log("innenend"+state);
  }, true);
    childs[i].addEventListener("mouseover", function( event ) {
    // highlight the mouseover target
    event.target.style.background = "#e8e8e8";
  }, false);
  childs[i].addEventListener("mouseout", function( event ) {
  // highlight the mouseover target
  event.target.style.background = "none";
}, false);



  }
  random_date();


</script>
