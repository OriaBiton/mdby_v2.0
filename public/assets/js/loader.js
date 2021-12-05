export default class Loader {
  static init(){
    const loadDiv = document.getElementById('load');
    window.addEventListener('load', afterLoad);
    Loader.cssList = [];
    firebase();
    setTitles();
    notyf();
    
    function setTitles(){
      if (location.pathname == '/') return;
      const title = loadDiv?.dataset?.title;
      if (title) document.title = title;
      document.querySelector('header h1').innerText = document.title;
    }
    function needs(need){
      return loadDiv?.hasAttribute(`data-${need}`);
    }
    function afterLoad(){
      recaptcha();
      setSwup();      
    }
    function setSwup(){
      Loader.swup = new Swup({
        linkSelector: `a[href]:not([href^="#"]):not([data-no-swup]):not([href="/"])`
      });
      Loader.swup.on('contentReplaced', onContentReplaced);

      function onContentReplaced(){        
        Loader.init();
        reRunScripts();
        window.scrollTo(0, 0);
        closeSideNav();

        function closeSideNav(){
          const expanded = document.querySelector('nav.expanded');
          if (expanded) expanded.classList.remove('expanded');
        }
        function reRunScripts(){
          document.querySelectorAll("main script").forEach(oldScript => {
            const newScript = document.createElement("script");      
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });
        }
      }
    }
    async function notyf(){
      if (!needs('notyf')) return;
      Loader.loadCss('/assets/notyf/notyf.min.css');
      await import('/assets/notyf/notyf.min.js');
      window.notyf = new Notyf({
        duration: 7000,
        position: {x: 'right', y: 'top'},
        dismissible: true
      });
    }
    function recaptcha(){
      if (needs('recaptcha')) import('https://www.google.com/recaptcha/api.js');
    }
    async function firebase(){
      const hasAuth = needs('firebase-auth');
      const hasFunctions = needs('firebase-functions');
      const hasDatabase = needs('firebase-database');
      const hasStorage = needs('firebase-storage');
      const hasFirebase = hasAuth || hasStorage || hasFunctions || hasDatabase;
      if (!hasFirebase) return;
      const dirURL = 'https://www.gstatic.com/firebasejs/8.3.0/';
      await import(dirURL + 'firebase-app.js');
      await import('/assets/js/firebase-init.js');
      await import(dirURL + 'firebase-analytics.js');
      if (hasAuth) import(dirURL + 'firebase-auth.js');
      if (hasFunctions) import(dirURL + 'firebase-functions.js');
      if (hasDatabase) import(dirURL + 'firebase-database.js');
      if (hasStorage) import(dirURL + 'firebase-storage.js');
      window.firebase.analytics();
    }
  }
  static async appendScript(src, cb){
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    if (cb) script.onload = cb;
    document.head.appendChild(script);
  }
  static loadCss(path) {
    if (Loader.cssList.includes(path)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = path;
    document.head.appendChild(l);
    Loader.cssList.push(path);
  }  

}
Loader.init();