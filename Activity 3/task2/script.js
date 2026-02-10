(function(){
  const STORAGE_KEY = 'task2-todos-v1';
  const endpoint = 'https://jsonplaceholder.typicode.com/todos';
  let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  const list = document.getElementById('todo-list');
  const addBtn = document.getElementById('add-btn');
  const newItem = document.getElementById('new-item');
  const remaining = document.getElementById('remaining');
  const clearCompleted = document.getElementById('clear-completed');
  const loadBtn = document.getElementById('load');
  const limitEl = document.getElementById('limit');

  function saveItems(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderItems();
  }

  function renderItems(){
    list.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.setAttribute('data-id', it.id);
      if (it.completed) li.classList.add('completed');

      const left = document.createElement('div');
      left.className = 'left';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'toggle';
      chk.checked = !!it.completed;
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = it.text;
      left.appendChild(chk);
      left.appendChild(label);

      const actions = document.createElement('div');
      actions.className = 'actions';
      const edit = document.createElement('button'); edit.className = 'edit-btn'; edit.textContent = 'Edit';
      const remove = document.createElement('button'); remove.className = 'remove-btn'; remove.textContent = 'Remove';
      actions.appendChild(edit);
      actions.appendChild(remove);

      li.appendChild(left);
      li.appendChild(actions);
      list.appendChild(li);
    });

    const rem = items.filter(i => !i.completed).length;
    remaining.textContent = rem;
  }

  addBtn.addEventListener('click', function(){
    const text = newItem.value.trim();
    if(!text) return;
    items.push({ id: Date.now().toString(), text: text, completed: false });
    newItem.value = '';
    saveItems();
  });

  newItem.addEventListener('keydown', function(e){ if(e.key === 'Enter') addBtn.click(); });

  list.addEventListener('change', function(e){
    if(!e.target.classList.contains('toggle')) return;
    const id = e.target.closest('li').getAttribute('data-id');
    const it = items.find(x=>x.id===id);
    if(it) it.completed = e.target.checked;
    saveItems();
  });

  list.addEventListener('click', function(e){
    const li = e.target.closest('li'); if(!li) return;
    const id = li.getAttribute('data-id');
    if(e.target.classList.contains('remove-btn')){
      items = items.filter(x=>x.id!==id); saveItems(); return;
    }
    if(e.target.classList.contains('edit-btn')){
      const index = items.findIndex(x=>x.id===id); if(index===-1) return;
      const label = li.querySelector('.label');
      const old = label.textContent;
      const input = document.createElement('input'); input.type='text'; input.className='edit-input'; input.value = old;
      label.replaceWith(input); input.focus();
      input.addEventListener('blur', function(){ const v = input.value.trim(); if(v) items[index].text = v; saveItems(); });
      input.addEventListener('keydown', function(ev){ if(ev.key==='Enter'){ input.blur(); } });
    }
  });

  clearCompleted.addEventListener('click', function(){ items = items.filter(x=>!x.completed); saveItems(); });

  loadBtn.addEventListener('click', async function(){
    list.innerHTML = '<li>Loading…</li>';
    try{
      const res = await fetch(endpoint);
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const data = await res.json();
      const n = Number(limitEl.value) || 20;
      // map to local item shape
      items = data.slice(0,n).map(d => ({ id: 'api-'+d.id, text: d.title, completed: !!d.completed, userId: d.userId }));
      saveItems();
    }catch(err){
      list.innerHTML = `<li class="error">Error: ${err.message}</li>`;
    }
  });

  // initial render
  renderItems();
})();
