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

    nav.querySelectorAll("a").forEach(link =>
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const form = document.querySelector("form[onsubmit]");

  if (form) {
    window.sendWhatsApp = function(event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const program = document.getElementById("program").value;
      const message = document.getElementById("message").value.trim();

      const text =
        `Hello Makkala Mane,%0A%0A` +
        `Parent/Guardian: ${encodeURIComponent(name)}%0A` +
        `Phone: ${encodeURIComponent(phone)}%0A` +
        `Program: ${encodeURIComponent(program)}%0A` +
        `Message: ${encodeURIComponent(message || "I would like to know more.")}`;

      window.open(
        `https://wa.me/919686940988?text=${text}`,
        "_blank",
        "noopener"
      );

      return false;
    };
  }

  /* Gallery lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");

  if (lightbox && lightboxImage) {
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      lightboxImage.src = "";
    };

    document.querySelectorAll(".gallery-page-item").forEach(item => {
      item.addEventListener("click", () => {
        lightboxImage.src = item.dataset.full;
        lightboxImage.alt = item.querySelector("img").alt;
        lightboxCaption.textContent = item.dataset.caption || "";

        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
      });
    });

    const closeBtn = document.querySelector(".lightbox-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", close);
    }

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", e => {
      if (
        e.key === "Escape" &&
        lightbox.classList.contains("open")
      ) {
        close();
      }
    });
  }
});


/* =========================================================
   YouTube Videos
   Only ONE YouTube video can play at a time.
   When another video is selected, the previous iframe is
   completely destroyed and its thumbnail is restored.
   ========================================================= */

var activeYouTubeFrame = null;


function restoreYouTubeThumbnail(frame) {
  if (!frame || !frame.parentNode) return;

  var id = frame.getAttribute("data-youtube-id");
  var title =
    frame.getAttribute("data-video-title") ||
    frame.title ||
    "Makkala Mane YouTube video";

  var button = document.createElement("button");

  button.className = "youtube-thumb";
  button.type = "button";
  button.setAttribute("aria-label", title);
  button.setAttribute("data-youtube-id", id);

  button.innerHTML =
    '<img src="https://i.ytimg.com/vi/' +
    encodeURIComponent(id) +
    '/hqdefault.jpg" alt="' +
    title.replace(/"/g, "&quot;") +
    ' video thumbnail">' +
    '<span class="youtube-play" aria-hidden="true">▶</span>';

  frame.replaceWith(button);

  attachYouTubeButton(button);
}


function stopActiveYouTube() {

  /*
   * Destroy the currently active iframe completely.
   * This is more reliable than sending pauseVideo commands
   * because removing the iframe terminates the YouTube player.
   */

  if (activeYouTubeFrame) {

    var oldFrame = activeYouTubeFrame;

    activeYouTubeFrame = null;

    restoreYouTubeThumbnail(oldFrame);
  }


  /*
   * Safety cleanup:
   * If any additional YouTube iframe exists for any reason,
   * destroy it as well.
   */

  document.querySelectorAll(".youtube-player").forEach(function(frame) {

    frame.src = "about:blank";

    if (frame.parentNode) {
      restoreYouTubeThumbnail(frame);
    }

  });
}


function attachYouTubeButton(button) {

  if (!button || button.dataset.youtubeBound === "true") {
    return;
  }

  button.dataset.youtubeBound = "true";


  button.addEventListener("click", function() {

    var id = button.getAttribute("data-youtube-id");

    var title =
      button.getAttribute("aria-label") ||
      "Makkala Mane YouTube video";


    /*
     * IMPORTANT:
     * Stop the previous video BEFORE creating the new iframe.
     */

    stopActiveYouTube();


    /*
     * Local file preview:
     * YouTube may block embedded playback when the page is
     * opened directly using file://.
     */

    if (window.location.protocol === "file:") {

      window.open(
        "https://www.youtube.com/watch?v=" +
        encodeURIComponent(id),
        "_blank",
        "noopener"
      );

      return;
    }


    /*
     * Create the new YouTube iframe.
     */

    var frame = document.createElement("iframe");

    frame.className = "youtube-player";

    frame.setAttribute("data-youtube-id", id);

    frame.setAttribute(
      "data-video-title",
      title
    );

    frame.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(id) +
      "?autoplay=1&rel=0";

    frame.title = title;

    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    frame.setAttribute(
      "referrerpolicy",
      "strict-origin-when-cross-origin"
    );

    frame.allowFullscreen = true;


    /*
     * Remember this as the only active player.
     */

    activeYouTubeFrame = frame;


    /*
     * Replace thumbnail with the playing iframe.
     */

    button.replaceWith(frame);

  });
}


/*
 * Attach the video click handler to all thumbnails
 * currently present on the page.
 */

document
  .querySelectorAll(".youtube-thumb[data-youtube-id]")
  .forEach(attachYouTubeButton);



/* =========================================================
   Team photographs
   Open the original supplied image at large size.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {

  var box =
    document.getElementById("teamPhotoLightbox");

  var image =
    document.getElementById("teamPhotoLightboxImage");

  var closeBtn =
    document.getElementById("teamPhotoClose");

  if (!box || !image) return;


  var photos =
    document.querySelectorAll(
      ".principal-body img, .staff-body img"
    );


  function close() {

    box.classList.remove("open");

    document.body.classList.remove("no-scroll");

    image.src = "";

  }


  photos.forEach(function(photo) {

    photo.addEventListener("click", function() {

      image.src =
        photo.currentSrc ||
        photo.src;

      image.alt =
        photo.alt || "";

      box.classList.add("open");

      document.body.classList.add("no-scroll");

      if (closeBtn) {
        closeBtn.focus();
      }

    });

  });


  if (closeBtn) {
    closeBtn.addEventListener("click", close);
  }


  box.addEventListener("click", function(e) {

    if (e.target === box) {
      close();
    }

  });


  document.addEventListener("keydown", function(e) {

    if (
      e.key === "Escape" &&
      box.classList.contains("open")
    ) {
      close();
    }

  });

});
