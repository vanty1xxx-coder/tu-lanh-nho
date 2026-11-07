(()=>{
  const dialog=el('dialog');dialog.id='stats-popup';dialog.setAttribute('aria-labelledby','stats-popup-title');
  const heading=el('div',undefined,'stats-modal-header'),headingText=el('div'),title=el('h2');title.id='stats-popup-title';
  const count=el('p');count.id='stats-popup-count';dialog.setAttribute('aria-describedby','stats-popup-count');
  const close=el('button','×','stats-modal-close');close.type='button';close.setAttribute('aria-label','Đóng danh sách');
  headingText.append(title,count);heading.append(headingText,close);const list=el('section',undefined,'stats-modal-list');list.setAttribute('aria-label','Thực phẩm trong danh sách');
  dialog.append(heading,list);document.body.append(dialog);let selected='all';
  const titles={all:'Thực phẩm trong tủ',soon:'Sắp đến mốc / hạn',expired:'Quá mốc / hạn'};
  function refresh(){
    const matches=items.filter(i=>!i.used&&(selected!=='soon'||days(i.expiry)!==null&&days(i.expiry)>=0&&days(i.expiry)<=3)&&(selected!=='expired'||days(i.expiry)!==null&&days(i.expiry)<0)).reverse();
    title.textContent=titles[selected];count.textContent=`${matches.length} món · Mới thêm ở trên cùng`;
    dialog.dataset.category=selected;list.replaceChildren();
    if(!matches.length){list.append(el('div',selected==='expired'?'Chưa có thực phẩm quá mốc / hạn.':selected==='soon'?'Chưa có thực phẩm sắp đến mốc / hạn.':'Tủ lạnh đang trống. Thêm món ở ô chat nhé!','stats-modal-empty'));return}
    for(const i of matches){const row=el('article'),g=FoodGuide.guidance(i.name,i.storage),picture=el('div',g.icon,'emoji'),body=el('div',undefined,'food'),s=status(i);picture.setAttribute('role','img');picture.setAttribute('aria-label',g.label);body.append(el('h3',i.name),el('span',s.text,'badge '+s.kind),el('p',`${i.quantity} · ${storeName(i.storage)}`),el('p',`${i.estimated?(g.fallback?'Nhắc kiểm tra':g.quality?'Mốc chất lượng':'Mốc ước tính'):'Hạn bạn nhập'}: ${fmt(i.expiry)}`),sourceDetails(i));row.append(picture,body);list.append(row)}
  }
  $('#stats').addEventListener('click',e=>{const button=e.target.closest('button[data-stat-list]');if(!button)return;selected=button.dataset.statList;refresh();dialog.showModal();close.focus()});
  close.onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()});
  new MutationObserver(()=>{if(dialog.open)refresh()}).observe($('#stats'),{childList:true});
})();
