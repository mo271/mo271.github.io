---
layout: special
---
{% assign linkurl = site.baseurl | append: "/" | append: page.newtitlelink %}
<div class="game">
<h1 id="randomdate" title="{{ page.newdatehint }}"></h1>
<div id="date-table" role="group" aria-label="{{ page.dayslabel }}"></div>
<p id="score" class="score" aria-live="polite"></p>
</div>
<div class="noprint">
{{ page.howtoplay | replace: '!SITE_URL!', linkurl }}
</div>
<div class="noprint">
{{ content }}
</div>
<script>
(function () {
  var locale = "{{ page.language }}";
  var weekStart = {{ page.weekstart | default: 0 }}; // 0 = Sunday first, 1 = Monday first
  var scoreLabel = "{{ page.scorelabel }}";
  var dateEl = document.getElementById("randomdate");
  var table = document.getElementById("date-table");
  var scoreEl = document.getElementById("score");
  var buttons = [];
  var correctDay = -1;
  var revealed = false;
  var correct = 0;
  var total = 0;

  // One button per weekday, in the order the locale expects.
  var aSunday = new Date(1985, 10, 3);
  for (var i = 0; i < 7; i++) {
    var day = (weekStart + i) % 7;
    var d = new Date(aSunday);
    d.setDate(d.getDate() + day);
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("data-day", day);
    b.textContent = d.toLocaleDateString(locale, { weekday: "long" });
    b.addEventListener("click", onDayClick);
    table.appendChild(b);
    buttons.push(b);
  }

  function newDate() {
    var start = new Date(1900, 0, 1);
    var end = new Date(2050, 11, 31);
    var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    correctDay = randomDate.getDay();
    dateEl.textContent = randomDate.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
    buttons.forEach(function (b) {
      b.className = "";
    });
    revealed = false;
  }

  function reveal(guess) {
    revealed = true;
    total++;
    if (guess === correctDay) {
      correct++;
    }
    buttons.forEach(function (b) {
      var d = Number(b.getAttribute("data-day"));
      b.classList.toggle("correct", d === correctDay);
      b.classList.toggle("wrong", d === guess && guess !== correctDay);
      b.classList.toggle("hidden", d !== correctDay && d !== guess);
    });
    scoreEl.textContent = correct + " / " + total + " " + scoreLabel;
  }

  function onDayClick(event) {
    if (revealed) {
      newDate();
    } else {
      reveal(Number(event.currentTarget.getAttribute("data-day")));
    }
  }

  dateEl.addEventListener("click", newDate);
  table.addEventListener("click", function (event) {
    // A click on the list beside the buttons also fetches a new date.
    if (revealed && event.target === table) {
      newDate();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key >= "1" && event.key <= "7") {
      buttons[Number(event.key) - 1].click();
      event.preventDefault();
    } else if (event.key === "n" || ((event.key === "Enter" || event.key === " ") && document.activeElement.tagName !== "BUTTON")) {
      newDate();
      event.preventDefault();
    }
  });

  newDate();
})();
</script>
