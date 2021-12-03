addEventListener('load', run);

function run(){
  var searchFilterArray;
  var trList = document.getElementsByTagName('tr');
  
  document.getElementById('search').addEventListener('focus', getSearchFilterObj);
  document.getElementById('search').addEventListener('keyup', filterBySearch);
  document.querySelector('form').addEventListener('submit', handleSubmit);
  
  function handleSubmit(e){
    e.preventDefault();
    let msg = this.querySelector('textarea').value;
    const num = '972548181024';
    msg = encodeURIComponent(msg);
    const url = `https://wa.me/${num}?text=${msg}`;
    window.open(url, '_blank');
  }
  function filterBySearch(e){
    if (e.target.value.length < 2) return unfilterBySearch();
    const searchTerm = e.target.value;
    const filtered = searchFilterArray.filter(obj => {
      for (const txt of obj.texts) {
        if (txt.includes(searchTerm)) return true;
      }
    });
    for (const tr of trList) {
      if (tr.cells[0].tagName == 'TH') continue;
      let toHide = true;
      for (const pair of filtered) {
        if (tr.isSameNode(pair.tr)) toHide = false;
      }
      if (toHide) hide(tr);
      else unhide(tr);
    }
  }
  
  function unfilterBySearch(){
    for (const tr of trList) unhide(tr);
  }
  
  function getSearchFilterObj(){
    if (searchFilterArray) return;
    searchFilterArray = [];
    for (const tr of trList) {
      let obj = {};
      let synagogueArray = [];
      for (const td of tr.cells) {
        const txt = td.innerText.trim();
        if (txt) synagogueArray.push(txt);
      }
      obj.texts = synagogueArray;
      obj.tr = tr;
      searchFilterArray.push(obj);
    }
  }
  function hide(e){
    e.classList.add('hidden');
  }
  function unhide(e){
    e.classList.remove('hidden');
  }
}
