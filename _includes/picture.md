<div class="home-page-picture">
<a id="profile-link" href="{{ site.baseurl }}/assets/images/large_moritz.jpg" title="Click to view full resolution image" target="_blank" rel="noopener noreferrer">
  <picture>
      <source srcset="{{ site.baseurl }}/assets/images/small_moritz.jxl" type="image/jxl">
      <source srcset="{{ site.baseurl }}/assets/images/small_moritz.jpg" type="image/jpeg">
      <img id="profile-img" alt="Photo of Moritz" class="picture" src="{{ site.baseurl }}/assets/images/small_moritz.jpg" onload="updateProfileLink()">
  </picture>
</a>
</div>
<script>
function updateProfileLink() {
    var img = document.getElementById('profile-img');
    var link = document.getElementById('profile-link');
    if (img && img.currentSrc && link) {
        link.href = img.currentSrc.replace('small_', 'large_');
        if (img.currentSrc.indexOf('.jxl') !== -1) {
            link.title = 'Click to download full resolution image';
        }
    }
}
setTimeout(updateProfileLink, 100);
</script>
