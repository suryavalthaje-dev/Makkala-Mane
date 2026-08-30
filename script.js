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

  /* =========================================================
     Gallery lightbox
     ========================================================= */

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
      if (e.target === lightbox) {
        close();
      }
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


  /* =========================================================
     YouTube videos

     IMPORTANT:
     Only ONE YouTube iframe is allowed to exist at a time.

     When another thumbnail is clicked:
       1. Stop every existing YouTube player.
       2. Destroy every existing iframe.
       3. Restore the thumbnails.
       4. Create ONLY the newly selected player.

     Event delegation is used so restored thumbnails work again.
     ========================================================= */

  function createYouTubeThumbnail(id, title) {
    const button = document.createElement("button");

    button.className = "youtube-thumb";
    button.type = "button";

    button.setAttribute("aria-label", title);
    button.setAttribute("data-youtube-id", id);

    const img = document.createElement("img");

    img.src =
      "https://i.ytimg.com/vi/" +
      encodeURIComponent(id) +
      "/hqdefault.jpg";

    img.alt = title + " video thumbnail";

    const play = document.createElement("span");

    play.className = "youtube-play";
    play.setAttribute("aria-hidden", "true");
    play.textContent = "▶";

    button.appendChild(img);
    button.appendChild(play);

    return button;
  }


  function destroyAllYouTubePlayers() {

    const frames =
      Array.from(
        document.querySelectorAll(".youtube-player")
      );

    frames.forEach(frame => {

      const id =
        frame.getAttribute("data-youtube-id");

      const title =
        frame.getAttribute("data-video-title") ||
        frame.title ||
        "Makkala Mane YouTube video";


      /*
       * Ask YouTube to stop playback.
       */

      try {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: "stopVideo",
              args: []
            }),
            "*"
          );
        }
      } catch (error) {
        // Ignore messaging errors.
      }


      /*
       * Immediately navigate the iframe away from YouTube.
       * This terminates the old player.
       */

      try {
        frame.src = "about:blank";
      } catch (error) {
        // Ignore iframe errors.
      }


      /*
       * Restore the thumbnail in the same location.
       */

      if (frame.parentNode) {

        const thumbnail =
          createYouTubeThumbnail(id, title);

        frame.parentNode.replaceChild(
          thumbnail,
          frame
        );
      }

    });

  }


  /*
   * Use ONE document-level click handler.
   *
   * This is important because thumbnails are recreated after
   * stopping a video. A normal per-button event listener would
   * not reliably work for those newly recreated buttons.
   */

  document.addEventListener("click", function(event) {

    const button =
      event.target.closest(
        ".youtube-thumb[data-youtube-id]"
      );

    if (!button) {
      return;
    }


    const id =
      button.getAttribute("data-youtube-id");

    const title =
      button.getAttribute("aria-label") ||
      "Makkala Mane YouTube video";


    /*
     * ALWAYS destroy ALL existing players first.
     */

    destroyAllYouTubePlayers();


    /*
     * Local file preview.
     *
     * YouTube may block embedded playback when opened
     * directly using file://.
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
     * Create the new player.
     */

    const frame =
      document.createElement("iframe");

    frame.className = "youtube-player";

    frame.setAttribute(
      "data-youtube-id",
      id
    );

    frame.setAttribute(
      "data-video-title",
      title
    );

    frame.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(id) +
      "?autoplay=1&rel=0&enablejsapi=1";

    frame.title = title;

    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    frame.setAttribute(
      "referrerpolicy",
      "strict-origin-when-cross-origin"
    );

    frame.allowFullscreen = true;


    /*
     * Replace the clicked thumbnail with the new player.
     */

    button.replaceWith(frame);

  });


  /* =========================================================
     Team photographs
     Open original image at large size.
     ========================================================= */

  const teamBox =
    document.getElementById("teamPhotoLightbox");

  const teamImage =
    document.getElementById("teamPhotoLightboxImage");

  const teamClose =
    document.getElementById("teamPhotoClose");

  if (teamBox && teamImage) {

    const photos =
      document.querySelectorAll(
        ".principal-body img, .staff-body img"
      );

    function closeTeamPhoto() {

      teamBox.classList.remove("open");

      document.body.classList.remove("no-scroll");

      teamImage.src = "";

    }

    photos.forEach(photo => {

      photo.addEventListener("click", function() {

        teamImage.src =
          photo.currentSrc ||
          photo.src;

        teamImage.alt =
          photo.alt || "";

        teamBox.classList.add("open");

        document.body.classList.add("no-scroll");

        if (teamClose) {
          teamClose.focus();
        }

      });

    });

    if (teamClose) {
      teamClose.addEventListener(
        "click",
        closeTeamPhoto
      );
    }

    teamBox.addEventListener(
      "click",
      function(event) {

        if (event.target === teamBox) {
          closeTeamPhoto();
        }

      }
    );

    document.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Escape" &&
          teamBox.classList.contains("open")
        ) {
          closeTeamPhoto();
        }

      }
    );

  }

});
