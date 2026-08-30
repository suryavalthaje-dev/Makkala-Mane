document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
    }));
  }
  const form = document.querySelector("form[onsubmit]");
  if (form) window.sendWhatsApp = function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const program = document.getElementById("program").value;
    const message = document.getElementById("message").value.trim();
    const text = `Hello Makkala Mane,%0A%0AParent/Guardian: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AProgram: ${encodeURIComponent(program)}%0AMessage: ${encodeURIComponent(message || "I would like to know more.")}`;
    window.open(`https://wa.me/919686940988?text=${text}`, "_blank", "noopener");
    return false;
  };
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  if (lightbox && lightboxImage) {
    const close = () => { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden","true"); document.body.classList.remove("no-scroll"); lightboxImage.src=""; };
    document.querySelectorAll(".gallery-page-item").forEach(item => item.addEventListener("click", () => {
      lightboxImage.src=item.dataset.full; lightboxImage.alt=item.querySelector("img").alt; lightboxCaption.textContent=item.dataset.caption||""; lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll");
    }));
    const closeBtn=document.querySelector(".lightbox-close"); if(closeBtn) closeBtn.addEventListener("click",close);
    lightbox.addEventListener("click",e=>{if(e.target===lightbox)close();}); document.addEventListener("keydown",e=>{if(e.key==="Escape"&&lightbox.classList.contains("open"))close();});
  }
});

// YouTube thumbnail: load the embedded player only after the visitor clicks.
document.querySelectorAll('.youtube-thumb[data-youtube-id]').forEach(function(button){
  button.addEventListener('click', function(){
    var id = button.getAttribute('data-youtube-id');

    // Stop any YouTube players that are already playing before starting
    // the newly selected video. The YouTube iframe API command is sent
    // directly to every existing embedded player on the page.
    document.querySelectorAll('.youtube-player').forEach(function(oldFrame){
      oldFrame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: []
      }), 'https://www.youtube-nocookie.com');
    });

    // A local file (file://) has no HTTP Referer, so YouTube blocks
    // embedded playback with Error 153. During local preview, open the
    // normal YouTube watch page. Once hosted on GitHub Pages,
    // the same click loads the video directly inside the website.
    if (window.location.protocol === 'file:') {
      window.open('https://www.youtube.com/watch?v=' + encodeURIComponent(id), '_blank', 'noopener');
      return;
    }

    var frame = document.createElement('iframe');
    frame.className = 'youtube-player';
    frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&enablejsapi=1';
    frame.title = button.getAttribute('aria-label') || 'Makkala Mane YouTube video';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.allowFullscreen = true;
    button.replaceWith(frame);
  });
});


// Team photographs: open the original supplied image at large size.
document.addEventListener('DOMContentLoaded', function(){
  var box=document.getElementById('teamPhotoLightbox');
  var image=document.getElementById('teamPhotoLightboxImage');
  var closeBtn=document.getElementById('teamPhotoClose');
  if(!box || !image) return;
  var photos=document.querySelectorAll('.principal-body img, .staff-body img');
  function close(){box.classList.remove('open');document.body.classList.remove('no-scroll');image.src='';}
  photos.forEach(function(photo){photo.addEventListener('click',function(){image.src=photo.currentSrc||photo.src;image.alt=photo.alt||'';box.classList.add('open');document.body.classList.add('no-scroll');if(closeBtn) closeBtn.focus();});});
  if(closeBtn) closeBtn.addEventListener('click',close);
  box.addEventListener('click',function(e){if(e.target===box) close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape' && box.classList.contains('open')) close();});
});
