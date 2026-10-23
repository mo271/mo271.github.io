<style>
  #profile-img {
    border-radius: 24px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  #profile-link:hover #profile-img {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
  /* On a dark page a black shadow is invisible; use a faint light rim and a
     stronger shadow so the photo still lifts off the background. */
  @media (prefers-color-scheme: dark) {
    #profile-img {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35), 0 8px 24px rgba(0, 0, 0, 0.9);
    }
    #profile-link:hover #profile-img {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 14px 32px rgba(0, 0, 0, 0.9);
    }
  }
</style>
<div class="home-page-picture">
<a id="profile-link" href="{{ site.baseurl }}/assets/images/large_moritz.jpg" title="Click to view full resolution image" target="_blank" rel="noopener noreferrer">
  <picture>
      {% assign img = site.baseurl | append: "/assets/images/" %}
      {% assign sizes = "(max-width: 600px) 30vw, (max-width: 800px) 25vw, 185px" %}
      <source srcset="{{ img }}small_moritz-240.jxl 240w, {{ img }}small_moritz.jxl 480w" sizes="{{ sizes }}" type="image/jxl">
      <source srcset="{{ img }}small_moritz-240.jpg 240w, {{ img }}small_moritz.jpg 480w" sizes="{{ sizes }}" type="image/jpeg">
      <img id="profile-img" alt="Photo of Moritz" class="picture" width="480" height="600" src="{{ img }}small_moritz.jpg" onload="updateProfileLink()">
  </picture>
</a>
</div>
<script>
function updateProfileLink() {
    var img = document.getElementById('profile-img');
    var link = document.getElementById('profile-link');
    if (img && img.currentSrc && link) {
        var ext = img.currentSrc.split('.').pop();
        link.href = '{{ site.baseurl }}/assets/images/large_moritz.' + ext;
        if (ext === 'jxl') {
            link.title = 'Click to download full resolution image';
        }
    }
}
setTimeout(updateProfileLink, 100);
</script>
