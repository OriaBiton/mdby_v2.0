export default class Loader {
  static init(){
    window.addEventListener('DOMContentLoaded', DOMLoaded);
    window.addEventListener('pageReplaced', resources);
    setLoaderDiv();
    resources();

    //FIX: hitting Back to homepage, update script wont run

    function resources(){
      firebase();
      setTitles();
      notyf();
    }
    function setTitles(){
      if (location.pathname == '/') return;
      const title = Loader.div?.dataset?.title;
      if (title) document.title = title;
      document.querySelector('header h1').innerText = document.title;
    }
    function needs(need){
      return Loader.div?.hasAttribute(`data-${need}`);
    }
    function setLoaderDiv(){
      Loader.div = document.getElementById('load');
    }
    function DOMLoaded(){
      recaptcha();
      setSwup();
    }
    function setSwup(){
      Loader.swup = new Swup({
        linkSelector: `a[href]:not([href^="#"]):not([data-no-swup]):not([href="/"]):not([target="_blank"])`,
        animateHistoryBrowsing: true
      });
      Loader.swup.on('contentReplaced', onContentReplaced);

      function onContentReplaced(){
        console.log('Content Replaced');
        setLoaderDiv();
        runScripts();
        window.scrollTo(0, 0);

        function runScripts(){
          document.querySelectorAll('[data-loaded]').forEach(s => s.remove());
          document.querySelectorAll(":is(main, header) script").forEach(oldScript => {
            const newScript = document.createElement("script");      
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.dataset.loaded = true;
            oldScript.parentNode.replaceChild(newScript, oldScript);
            newScript.onload = () => window.dispatchEvent(new Event('pageReplaced'));
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
      if (hasAuth) await import(dirURL + 'firebase-auth.js');
      if (hasFunctions) await import(dirURL + 'firebase-functions.js');
      if (hasDatabase) await import(dirURL + 'firebase-database.js');
      if (hasStorage) await import(dirURL + 'firebase-storage.js');
      window.dispatchEvent(new Event('firebaseLoaded'));
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
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = path;
    document.head.appendChild(l);
  }  

}
Loader.init();