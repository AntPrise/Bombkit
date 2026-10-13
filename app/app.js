(() => {
  'use strict';
  const KEY = 'bombkit.library.v1';
  const $ = (id) => document.getElementById(id);
  let scripts = [];
  let activeId = null;
  let categoryFilter = '';
  const safeString = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
  const normalize = (raw) => {
    if (!Array.isArray(raw)) throw new Error('Expected a JSON array of scripts.');
    if (raw.length > 5000) throw new Error('Too many scripts in import.');
    return raw.map((item) => ({
      id: crypto.randomUUID(),
      name: safeString(item?.name, 120) || 'Untitled script',
      category: safeString(item?.category, 60) || 'General',
      description: safeString(item?.description, 500),
      code: safeString(item?.code, 1000000),
    }));
  };
  try { scripts = normalize(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { scripts = []; }
  const persist = () => { localStorage.setItem(KEY, JSON.stringify(scripts)); };
  const selected = () => scripts.find((item) => item.id === activeId);
  const make = (tag, cls, content) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  function render() {
    const query = $('search').value.trim().toLowerCase();
    const visible = scripts.filter((s) => (!categoryFilter || s.category === categoryFilter) && `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(query));
    $('total').textContent = String(scripts.length);
    $('count').textContent = `(${visible.length})`;
    const list = $('scriptList'); list.replaceChildren();
    if (!visible.length) list.append(make('p','item-desc','No scripts here yet.'));
    for (const script of visible) {
      const item = make('button', `item ${script.id === activeId ? 'selected' : ''}`);
      item.append(make('div','item-title',script.name),make('div','item-desc',script.description || 'No description'),make('div','tag',script.category.toUpperCase()));
      item.onclick = () => { activeId = script.id; render(); };
      list.append(item);
    }
    const categories = $('categories'); categories.replaceChildren();
    for (const category of [...new Set(scripts.map((s) => s.category))].sort()) {
      const button = make('button',`nav ${categoryFilter === category ? 'active' : ''}`,`◦  ${category}`);
      button.onclick = () => { categoryFilter = category; render(); };
      categories.append(button);
    }
    $('allNav').classList.toggle('active', !categoryFilter);
    const current = selected();
    $('editorPanel').hidden = !current;
    $('emptyState').hidden = Boolean(current);
    if (current) {
      for (const field of ['name','category','description','code']) $(field).value = current[field];
      $('lines').textContent = `${current.code.split('\n').length} lines`;
      $('status').textContent = 'Changes are saved locally';
    }
  }
  $('allNav').onclick = () => { categoryFilter = ''; render(); };
  $('search').oninput = render;
  $('newBtn').onclick = () => { const item = {id:crypto.randomUUID(),name:'New script',category:'General',description:'',code:'// Write your script here\n'}; scripts.unshift(item);activeId=item.id;categoryFilter='';persist();render(); };
  $('saveBtn').onclick = () => {
    const current = selected(); if (!current) return;
    for (const field of ['name','category','description','code']) current[field] = $(field).value;
    current.name = current.name.trim().slice(0,120) || 'Untitled script';
    current.category = current.category.trim().slice(0,60) || 'General';
    current.description = current.description.slice(0,500);
    current.code = current.code.slice(0,1000000);
    try { persist(); render(); $('status').textContent = 'Saved successfully'; } catch { $('status').textContent = 'Could not save: storage full'; }
  };
  $('deleteBtn').onclick = () => { if (!selected() || !confirm('Delete this script?')) return; scripts = scripts.filter((s) => s.id !== activeId); activeId=null;persist();render(); };
  $('copyBtn').onclick = async () => { if (!selected()) return; try { await navigator.clipboard.writeText($('code').value);$('status').textContent='Copied to clipboard'; } catch { $('status').textContent='Clipboard permission denied'; } };
  $('exportBtn').onclick = async () => {
    const json = JSON.stringify(scripts.map(({name,category,description,code})=>({name,category,description,code})),null,2);
    if (window.bombkitDesktop) { await window.bombkitDesktop.exportScripts(json);return; }
    const blob = new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='bombkit-scripts.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
  };
  $('importBtn').onclick = async () => {
    if (window.bombkitDesktop) { const result=await window.bombkitDesktop.importScripts();if (result?.ok) importJson(result.content); }
    else $('fileInput').click();
  };
  function importJson(content) {
    try { if (content.length > 5_000_000) throw Error('Import exceeds 5 MB'); const incoming=normalize(JSON.parse(content)); scripts.push(...incoming); persist(); categoryFilter='';render();alert(`Imported ${incoming.length} scripts.`); }
    catch(err){alert(`Import failed: ${err.message}`);}
  }
  $('fileInput').onchange = async (event) => { const file=event.target.files?.[0];if(file){if(file.size>5_000_000)alert('File exceeds 5 MB');else importJson(await file.text());}event.target.value=''; };
  render();
})();
