addEventListener('load', () => {
  const table = document.querySelector('table');
  sortTable();
  enumerate();
  document.querySelectorAll('button').forEach(b =>
    b.addEventListener('click', handleFilter));

  //Need to handle duplicate names... no unique ID
  function toJSON() {
    const obj = {};
    for (const tr of table.rows) {
      const tds = tr.cells;
      const name = tds[1].innerText;
      if (name in obj) console.log(name + ' exists!');
      const address = tds[2].innerText;
      const phone = tds[3].innerText;
      const category = tds[4].innerText;
      const kosherLevel = tds[5].innerText;
      const kosherType = tds[6].innerText;
      obj[name] = { address, phone, category, kosherLevel, kosherType };
    }
    console.log(obj);

  }
  function sortTable() {
    let arr = [];
    for (let i = 1, ln = table.rows.length; i < ln; i++) {
      let row = table.rows[i];
      let firstCell = row.cells[0].innerText;
      arr.push([firstCell, row]);  //temporary array
    }
    //sort by first column of inner arrays
    arr = arr.sort((a, b) => a[0].localeCompare(b[0]));
    for (let i = 0, ln = arr.length; i < ln; i++)
      table.appendChild(arr[i][1]);
  }
  // Remove restaurant
  function remove(names) {
    const removed = [];
    for (const name of names) {
      for (const tr of table.rows) {
        const nameCell = tr.cells[1];
        if (nameCell.innerText.includes(name)) {
          tr.remove();
          removed.push(name);
        }
      }
    }
    console.log('removed:', removed);
  }
  // Clear enumeration cells (to copy)
  function clearEnumeration() {
    for (const tr of table.rows) {
      const td = tr.cells[0];
      if (td.innerText == '#') continue;
      td.remove();
    }
  }
  function enumerate() {
    for (let i = 1; i < table.rows.length; i++) {
      const tr = table.rows[i];
      const td = document.createElement('td');
      td.innerText = i;
      tr.prepend(td);
    }
  }
  function handleFilter(e) {
    e.preventDefault();
    const categories = document.querySelectorAll('[data-filtered]');

    if (isActive(this)) {
      unfilter(this);
      deactivate(this);
    }
    else {
      handleIfSecondFilter(this);
      filterByText(this.value);
      this.closest('div').dataset.filtered = true;
      activate(this);
    }

    function handleIfSecondFilter(btn) {
      const btns = btn.closest('div').querySelectorAll('button');
      for (const b of btns) {
        if (isActive(b)) b.click();
      }
    }
    function unfilter(btn) {
      const trs = table.getElementsByTagName('tr');
      for (const tr of trs) unhide(tr);
      delete btn.closest('div').dataset.filtered;
      let shouldRefilter = false;
      for (const c of categories) {
        if (c.dataset.filtered) {
          c.querySelectorAll('button').forEach(btn => {
            if (isActive(btn))
              filterByText(btn.value);
          });
        }
      }
    }
    function filterByText(text) {
      const trs = table.getElementsByTagName('tr');
      for (const tr of trs) {
        let shouldHide = true;
        for (const td of tr.cells) {
          if (td.tagName == 'TH') {
            shouldHide = false;
            break;
          }
          if (td.innerText.includes(text)) {
            shouldHide = false;
            break;
          }
        }
        if (shouldHide) hide(tr);
      }
    }
  }

  function hide(e) {
    e.classList.add('hidden');
  }
  function unhide(e) {
    e.classList.remove('hidden');
  }
  function activate(e) {
    e.classList.add('active');
  }
  function deactivate(e) {
    e.classList.remove('active');
  }
  function isActive(e) {
    return e.classList.contains('active');
  }

});
