---
layout: default
---
<div class="paper">

  <header class="paper-header">
    <h2 class="paper-title">{{ page.title }}</h2>
   {% if page.type=="thesis"%}
   <span class = "thesis-description">{{page.degree}}, {{page.almamater}}</span>
   {% endif %}
    <div class="paper-bibdata">
        <table>
            {% if page.authors %}
            <tr>
            {% assign numberofauthors = page.authors.size %}
                <td class="paper-authors">
                    Author{% if numberofauthors>1 %}s{% endif %}:
                </td>
                <td class="paper-authors">
                    {% for author in page.authors %}
                        {% assign author_h = site.data.authors[author] %}
                        {% if author_h.url %}
                            <a href="{{ author_h.url }}">{{ author_h.name }}</a>{% else %}{{ author_h.name }}{% endif %}{% if forloop.length == 2 %}{% if forloop.first %} and {% endif %}{% elsif forloop.length > 2 %}{% if forloop.rindex > 2 %}, {% elsif forloop.rindex == 2 %} and {% endif %}{% endif %}{% endfor %}
                </td>
            </tr>
            {% endif %}
            <tr>
                {% case page.type %}
                {% when "journal"%}
                    <td class="paper-journal-ref">
                        Journal:
                    </td>
                    <td class="paper-journal-ref">
                        {% assign journal = site.data.journals[page.journal] %}
                        {% if journal.url %}
                            <a class="journal-title"
                                href="{{journal.url}}">{{journal.title}}</a>{% else %}
                            <span class="journal-title">{{journal.title}}</a>{% endif %}{% if page.volume %}, <span class="journal-volume">{{page.volume}}</span>{% if page.issue %}<span class="journal-issue">{{page.issue}}</span>{% if page.pages %}<span class="journal-pages">{{page.pages}}</span>{% endif %}{% endif %}{% endif %}{% if page.year %}, <span class="journal-year">{{page.year}}</span>.
                        {% else %}, <span class="journal-to-appear">to appear</span>.
                        {% endif %}
                    </td>
                {% when "conference" %}
                    <td class="paper-conference-ref">
                        Proc. of:
                    </td>
                    <td class="paper-conference-ref">
                        {% assign conference = site.data.conferences[page.conference] %}
                        {% if conference.url %}
                            <a class="conference-name"
                                 href="{{conference.url}}">{{conference.name}}</a>{% else %}
                            <span class="conference-name">{{conference.name}}</span>{% endif %}{% if page.conferenceprocname %} <span class="conference-procname">{{page.conferenceprocname}}</span>{% endif %}{% if page.pages %}, <span class="conference-pages">{{page.pages}}</span>{% endif %}{% if page.year %}, <span class="conference-year">{{page.year}}</span>{% endif %}.
                    </td>
                {% when "preprint" %}
                <td class="paper-preprint-ref">
                    Preprint:
                </td>
                <td class="paper-preprint-ref">
                    {% if page.arxiv %}
                        <span class="preprint-arxiv-id">{{page.arxiv}}</span>{% endif %}{% if page.year %}{% if page.arxiv %}, {% endif %}
                        <span class="preprint-arxiv-year">{{page.year}}</span>
                    {% endif %}
                </td>
                {% when "thesis" %}
                <td class="advisor-ref">
                    Advisor:
                </td>
                <td class="advisor-ref">
                    {% assign advisor = site.data.authors[page.advisor] %}
                    <a class="advisor-name"
                         href="{{advisor.url}}">{{advisor.name}}</a>
                </td>
                {% endcase %}
            </tr>
            {% if page.arxiv or page.doi or page.localpdf or page.fulltexturl%}
            <tr>
                <td class="paper-text">
                    Full text:
                </td>
                <td class="paper-text">
                    {% if page.arxiv %}
                        <a href="http://arxiv.org/abs/{{page.arxiv}}">arXiv</a>
                    {% endif %}
                    {% if page.doi %}
                        {% if page.arxiv %}
                            <span class="paper-text-sep">•</span>
                        {% endif %}
                        <a href="http://dx.doi.org/{{page.doi}}">DOI</a>
                    {% endif %}
                    {% if page.fulltexturl %}
                        {% if page.arxiv or page.doi %}
                            <span class="paper-text-sep">•</span>
                        {% endif %}
                      <a href="{{page.fulltexturl}}">journal</a>
                      {% endif %}
                    {% if page.localpdf %}
                        {% if page.arxiv or page.doi or page.fulltexturl%}
                            <span class="paper-text-sep">•</span>
                        {% endif %}
                      <a href="{{site.baseurl}}/assets/pdfs/{{page.localpdf}}">PDF</a>
                    {% endif %}
                </td>
            </tr>
            {% endif %}
        </table>
    </div>
  </header>
{% if page.image %}
<div class="paper-image">
<img alt="Picture for paper 'page.title'" class="picture" src="{{ site.baseurl }}/assets/images/papers/{{page.image}}">
</div>
{% endif %}
{% assign lengthofcontent = content.size %}
{% if lengthofcontent>1 %}
  <div class="paper-abstract">
    {{ content }}
  </div>
{% endif %}
{% if page.type=="journal" %}
<div class="bibtex">
{% capture bibtex %}
    @{% if page.editors %}InProceedings{% else %}Article{% endif %}{ {% if page.latexname %}{{page.latexname}}{% else %}{% for author in page.authors %}{% assign author_h = site.data.authors[author] %}{% assign names = author_h.name | split:' ' %}{% for name in names %}{% if forloop.last %}{{ name }}{% endif %}{% endfor %}{% if forloop.length >= 2 %}_{% endif %}{% endfor %}{% assign titlewords = page.title | split: ' ' %}{% for word in titlewords %}{% if forloop.first %}{{ word }}{% endif %}{% endfor %}{% endif %}{{page.year}},
      author = "{% for author in page.authors %}{% assign author_h = site.data.authors[author] %}{{author_h.name}}{% unless forloop.last %} and {% endunless %}{% endfor %}",{% if page.editors %}
      editor = "{{ page.editors }}",{% endif %}
      title = "{{ page.title }}",{% if page.booktitle %}
      booktitle = "{{ page.booktitle }}",{% endif %}
      year = "{{page.year}}",
      journal = "{{journal.title}}",{% if page.volume %}
      volume = "{{page.volume}}",{% endif %}{% if page.issue %}
      number = "{{page.issue}}",{% endif %}{% if page.pages %}
      pages = "{{page.pages}}",{% endif %}
      doi = "{{page.doi}}"
    }
    {% endcapture %}{{ bibtex | markdownify }}
</div>
{% endif %}
</div>
