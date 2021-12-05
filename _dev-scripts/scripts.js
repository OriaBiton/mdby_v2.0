function loadHTML(root){
  const targets = root.querySelectorAll('[data-html-src]');
  targets.forEach(async target => {
    const {tagName, dataset} = target;
    const autoSrc = tagName.toLowerCase();
    const src = `/assets/partials/${(dataset.htmlSrc || autoSrc)}.html`;
    const html = await (await fetch(src)).text();
    setInnerHTML(target, html);
    Loader.loadHTML(target);
  });

  function setInnerHTML(elm, html){
    elm.innerHTML = html;
    elm.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript)
    });
  }
}