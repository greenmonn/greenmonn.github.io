(function () {
  var languageNames = {
    bash: "Bash",
    c: "C",
    cpp: "C++",
    css: "CSS",
    html: "HTML",
    java: "Java",
    javascript: "JavaScript",
    js: "JavaScript",
    json: "JSON",
    plaintext: "Text",
    python: "Python",
    ruby: "Ruby",
    shell: "Shell",
    sql: "SQL",
    typescript: "TypeScript",
    xml: "XML",
    yaml: "YAML"
  };
  var copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="1.5"></rect><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-10A1.5 1.5 0 0 0 3 5.5v10A1.5 1.5 0 0 0 4.5 17H8"></path></svg>';
  var checkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';

  function getLanguage(block) {
    var languageClass = Array.prototype.find.call(block.classList, function (className) {
      return className.indexOf("language-") === 0;
    });
    var language = languageClass ? languageClass.replace("language-", "") : "plaintext";

    return languageNames[language] || language.toUpperCase();
  }

  function copyWithFallback(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function copyCode(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        copyWithFallback(text);
      });
    }

    copyWithFallback(text);
    return Promise.resolve();
  }

  function addCodeScrollbar(snippet, pre) {
    var track = document.createElement("div");
    var thumb = document.createElement("div");
    var dragStartX = 0;
    var dragStartScroll = 0;
    var isDragging = false;

    track.className = "code-scrollbar";
    thumb.className = "code-scrollbar-thumb";
    track.setAttribute("aria-hidden", "true");
    track.appendChild(thumb);
    snippet.appendChild(track);

    function updateScrollbar() {
      var isScrollable = pre.scrollWidth > pre.clientWidth + 1;
      var trackWidth = track.clientWidth;
      var thumbWidth = isScrollable
        ? Math.max(36, trackWidth * (pre.clientWidth / pre.scrollWidth))
        : trackWidth;
      var maxThumbOffset = Math.max(0, trackWidth - thumbWidth);
      var maxScroll = Math.max(1, pre.scrollWidth - pre.clientWidth);
      var thumbOffset = maxThumbOffset * (pre.scrollLeft / maxScroll);

      track.classList.toggle("is-scrollable", isScrollable);
      thumb.style.width = thumbWidth + "px";
      thumb.style.transform = "translateX(" + thumbOffset + "px)";
    }

    pre.addEventListener("scroll", updateScrollbar, { passive: true });

    track.addEventListener("click", function (event) {
      if (event.target === thumb || !track.classList.contains("is-scrollable")) return;

      var rect = track.getBoundingClientRect();
      var ratio = (event.clientX - rect.left) / rect.width;
      pre.scrollLeft = ratio * (pre.scrollWidth - pre.clientWidth);
    });

    thumb.addEventListener("pointerdown", function (event) {
      isDragging = true;
      dragStartX = event.clientX;
      dragStartScroll = pre.scrollLeft;
      thumb.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    thumb.addEventListener("pointermove", function (event) {
      if (!isDragging) return;

      var availableTrack = track.clientWidth - thumb.offsetWidth;
      var availableScroll = pre.scrollWidth - pre.clientWidth;
      if (availableTrack > 0) {
        pre.scrollLeft = dragStartScroll +
          (event.clientX - dragStartX) * (availableScroll / availableTrack);
      }
    });

    thumb.addEventListener("pointerup", function () {
      isDragging = false;
    });

    if (window.ResizeObserver) {
      new ResizeObserver(updateScrollbar).observe(pre);
    } else {
      window.addEventListener("resize", updateScrollbar);
    }

    window.requestAnimationFrame(updateScrollbar);
  }

  document.querySelectorAll(".post-content .highlighter-rouge").forEach(function (block) {
    if (block.closest(".code-snippet")) return;

    var code = block.querySelector("code");
    if (!code) return;

    var snippet = document.createElement("div");
    var toolbar = document.createElement("div");
    var language = document.createElement("span");
    var copyButton = document.createElement("button");

    snippet.className = "code-snippet";
    toolbar.className = "code-snippet-toolbar";
    language.className = "code-snippet-language";
    language.textContent = getLanguage(block);

    copyButton.type = "button";
    copyButton.className = "button is-small code-copy-button";
    copyButton.innerHTML = copyIcon;
    copyButton.title = "Copy code";
    copyButton.setAttribute("aria-label", "Copy code to clipboard");

    block.parentNode.insertBefore(snippet, block);
    toolbar.appendChild(language);
    toolbar.appendChild(copyButton);
    snippet.appendChild(toolbar);
    snippet.appendChild(block);
    addCodeScrollbar(snippet, block.querySelector("pre"));

    copyButton.addEventListener("click", function () {
      copyCode(code.textContent).then(function () {
        copyButton.innerHTML = checkIcon;
        copyButton.title = "Copied";
        copyButton.setAttribute("aria-label", "Code copied");
        copyButton.classList.add("is-copied");

        window.setTimeout(function () {
          copyButton.innerHTML = copyIcon;
          copyButton.title = "Copy code";
          copyButton.setAttribute("aria-label", "Copy code to clipboard");
          copyButton.classList.remove("is-copied");
        }, 1500);
      });
    });
  });
})();
