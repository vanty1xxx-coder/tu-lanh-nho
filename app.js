
let KEY='tu-lanh-nho-v1';
let items=[],filter='all',editing=null;
const $=s=>document.querySelector(s),norm=FoodGuide.normalize;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const addDays=(date,n)=>FoodGuide.add(date,n,'day');
const days=date=>FoodGuide.validDate(date)?Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(today()+'T00:00:00Z'))/86400000):null;
const fmt=d=>FoodGuide.validDate(d)?d.split('-').reverse().join('/'):'Chưa có mốc';
const storeName=s=>s==='freezer'?'❄ Ngăn đông ≤ −18°C':'Ngăn mát ≤ 4°C';
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',5500)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items));return true}catch{toast('Không lưu được. Hãy sao lưu dữ liệu trước khi đóng trang.');return false}}
function hydrateRecords(data){
  if(!Array.isArray(data)||data.length>10000)throw Error('invalid records');
  return data.map(i=>{
    if(!i||typeof i.id!=='string'||typeof i.name!=='string'||typeof i.quantity!=='string'||!FoodGuide.validDate(i.purchase)||(i.expiry!=null&&i.expiry!==''&&!FoodGuide.validDate(i.expiry)))throw Error('invalid record');
    const legacy=!!i.estimated&&i.guideVersion!==FoodGuide.version;
    const item={id:i.id,name:i.name.slice(0,100),quantity:i.quantity.slice(0,40),purchase:i.purchase,storage:i.storage==='freezer'?'freezer':'fridge',start:FoodGuide.validDate(i.start)?i.start:i.purchase,expiry:legacy?null:i.expiry||null,estimated:legacy||!!i.estimated,used:!!i.used,guideVersion:FoodGuide.version,needsReview:legacy||!!i.needsReview,oldExpiry:legacy?i.expiry:i.oldExpiry||null,icon:FoodGuide.identify(i.name).icon,estimateMethod:i.estimateMethod||'early'};
    const guide=FoodGuide.guidance(item.name,item.storage);
    if(i.estimated||!item.expiry){item.expiry=FoodGuide.add(item.start,FoodGuide.average(guide.period),guide.period.unit);item.estimated=true;item.estimateMethod=guide.fallback?'default':'average';item.needsReview=false;}
    return item;
  });
}
function loadRecords(){try{items=hydrateRecords(JSON.parse(localStorage.getItem(KEY)||'[]'));save();}catch{items=[];toast('Dữ liệu lưu chưa hợp lệ. Hãy kiểm tra bản sao lưu.')}}
loadRecords();
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e}
function status(i){const d=days(i.expiry),g=FoodGuide.guidance(i.name,i.storage);if(i.used)return {text:'Đã dùng',kind:''};if(d===null)return {text:i.needsReview?'Cần xác nhận lại mốc cũ':'Chưa đủ dữ liệu để tính mốc',kind:'unknown'};if(!i.estimated)return {text:d<0?`Quá hạn đã nhập ${-d} ngày`:d===0?'Đến hạn đã nhập hôm nay':`Còn ${d} ngày · hạn đã nhập`,kind:d<0?'expired':d<=3?'soon':''};const title=g.fallback?'mốc kiểm tra':g.quality?'mốc chất lượng':'mốc ước tính';return {text:d<0?`Quá ${title} ${-d} ngày`:d===0?`Đến ${title} hôm nay`:`Còn ${d} ngày đến ${title}`,kind:d<0?'expired':d<=3?'soon':''}}
function sourceDetails(i){
  const g=FoodGuide.guidance(i.name,i.storage),details=el('details',undefined,'guide-details');details.append(el('summary','Vì sao có mốc này?'));
  if(!i.estimated&&i.expiry)details.append(el('p','Ngày do bạn nhập. App không xác minh nhãn bao bì hoặc tình trạng thực phẩm.'));
  if(i.needsReview)details.append(el('p','Bản trước có lỗi nhận diện. Mốc tự động cũ đã được bỏ; mở Sửa để kiểm tra và áp dụng lại. Không thay đổi hạn bạn tự nhập.'));
  details.append(el('p','Nhận diện: '+g.label+'. '+g.condition));
  if(g.fallback){details.append(el('p',g.checkNow?'Nhắc kiểm tra ngay hôm nay (0 ngày). Tài liệu không khuyến nghị cấp đông trứng còn vỏ/trứng luộc.':`Lịch nhắc mặc định của app: ${FoodGuide.averageText(g.period)}. Đây không phải thời gian bảo quản đã được nghiên cứu cho món này, không phải hạn dùng an toàn. Ưu tiên nhãn sản phẩm và kiểm tra điều kiện thực tế.`));if(g.why)details.append(el('p',g.why));}
  else if(g.period){details.append(el('p',`Tài liệu: ${FoodGuide.periodText(g.period)} · ${storeName(i.storage)}. App dùng trung bình làm tròn: khoảng ${FoodGuide.averageText(g.period)}, tính từ ${fmt(i.start)}.`));}
  else details.append(el('p',g.why||(i.storage==='freezer'?'Chưa có mốc cấp đông phù hợp với trạng thái/sơ chế này. Hãy nhập hướng dẫn trên bao bì.':'Cần tên cụ thể hơn hoặc hướng dẫn trên bao bì.')));
  if(g.sourceInfo){const link=el('a',g.sourceInfo.name);link.href=g.sourceInfo.url;link.target='_blank';link.rel='noopener';details.append(link);}
  if(i.storage==='freezer')details.append(el('p','Mốc đông là chất lượng khi giữ liên tục ≤ −18°C; không phải ngày chắc chắn hỏng. Mua hàng đông lạnh: ưu tiên HSD của sản phẩm.'));
  return details;
}
function render(){
  const active=items.filter(i=>!i.used);
  $('#stats').replaceChildren(...[[active.length,'món trong tủ','all'],[active.filter(i=>days(i.expiry)!==null&&days(i.expiry)>=0&&days(i.expiry)<=3).length,'sắp đến mốc / hạn','soon'],[active.filter(i=>days(i.expiry)!==null&&days(i.expiry)<0).length,'quá mốc / hạn','expired']].map(([n,t,key])=>{const e=el('button',undefined,'stat');e.type='button';e.dataset.statList=key;e.setAttribute('aria-haspopup','dialog');e.setAttribute('aria-controls','stats-popup');e.setAttribute('aria-label',`${n} ${t}. Mở danh sách`);e.append(el('strong',n),el('span',t),el('span','Xem danh sách →','stat-open'));return e}));
  const visible=items.filter(i=>(filter==='used'?i.used:!i.used)&&(filter!=='soon'||days(i.expiry)!==null&&days(i.expiry)>=0&&days(i.expiry)<=3)&&(filter!=='expired'||days(i.expiry)!==null&&days(i.expiry)<0)&&(filter!=='unknown'||!i.expiry)&&norm(i.name).includes(norm($('#search').value))).reverse();
  $('#list').replaceChildren();if(!visible.length)$('#list').append(el('div',filter==='all'&&!items.length?'Tủ đang trống. Thêm món đầu tiên của bạn nhé!':'Không có món nào trong danh sách này.','empty'));
  for(const i of visible){
    const a=el('article'),body=el('div',undefined,'food'),actions=el('div',undefined,'actions'),s=status(i),g=FoodGuide.guidance(i.name,i.storage);i.icon=g.icon;
    body.append(el('h3',i.name),el('span',s.text,'badge '+s.kind),el('p',`${i.quantity} · ${storeName(i.storage)} · Mua ${fmt(i.purchase)}`));
    if(i.estimated&&g.period)body.append(el('p',`${g.fallback?'Lịch nhắc mặc định':'Bảo quản ước tính'}: ${g.checkNow?'kiểm tra ngay (0 ngày)':'khoảng '+FoodGuide.averageText(g.period)}`));
    if(i.expiry)body.append(el('p',`${i.estimated?(g.fallback?'Ngày nhắc kiểm tra':g.quality?'Mốc chất lượng tham khảo':'Ngày tham khảo'):'Hạn bạn nhập'}: ${fmt(i.expiry)}`));
    else body.append(el('p',g.why||'Ghi rõ loại thực phẩm hoặc bổ sung hạn trên bao bì.','missing-date'));
    body.append(sourceDetails(i));
    for(const [t,fn]of [[i.used?'Hoàn tác':'✓ Đã dùng',()=>{i.used=!i.used;save();render()}],['Sửa',()=>openEdit(i)],['Xóa',()=>{if(confirm(`Xóa ${i.name}?`)){items=items.filter(x=>x.id!==i.id);save();render()}}]]){const b=el('button',t);b.onclick=fn;actions.append(b)}
    const picture=el('div',g.icon,'emoji');picture.setAttribute('role','img');picture.setAttribute('aria-label',g.label);a.append(picture,body,actions);$('#list').append(a);
  }
}
function editingGuide(){const f=$('#edit').elements;return FoodGuide.guidance(f.name.value,f.storage.value)}
let pendingAutoDate=null;
function updateGuidePreview(){const f=$('#edit').elements;if(pendingAutoDate){if(f.expiry.value===pendingAutoDate)f.expiry.value='';pendingAutoDate=null;}const g=editingGuide();$('#guide-preview').textContent=(g.period?`${g.fallback?"Lịch nhắc mặc định":"Ước tính"}: khoảng ${FoodGuide.averageText(g.period)}. `:'Chưa có thời gian phù hợp. ')+g.condition+' '+(g.why||'');$('#apply-guide').disabled=!g.period;}
function openEdit(i){editing=i;pendingAutoDate=null;const f=$('#edit').elements;for(const k of ['name','quantity','purchase','storage','start'])f[k].value=i[k];f.expiry.value=i.expiry||'';updateGuidePreview();$('#editor').showModal()}
$('#cancel').onclick=()=>{$('#editor').close();editing=null};
for(const key of ['name','storage','start'])$('#edit').elements[key].addEventListener('input',updateGuidePreview);
$('#apply-guide').onclick=()=>{const g=editingGuide(),f=$('#edit').elements;if(!g.period||!FoodGuide.validDate(f.start.value))return;f.expiry.value=FoodGuide.add(f.start.value,FoodGuide.average(g.period),g.period.unit);pendingAutoDate=f.expiry.value;toast('Đã chọn mốc trung bình ước tính. Nhấn Lưu để áp dụng.')};
$('#edit').onsubmit=e=>{
  e.preventDefault();const f=e.target.elements,name=f.name.value.trim(),quantity=f.quantity.value.trim(),purchase=f.purchase.value,storage=f.storage.value,start=f.start.value,entered=f.expiry.value||null;
  if(!name||!quantity||!FoodGuide.validDate(purchase)||!FoodGuide.validDate(start)||(entered&&!FoodGuide.validDate(entered)))return;
  if(start>today()||purchase>today()){toast('Ngày mua và ngày bắt đầu không được ở tương lai.');return}
  const changedBasis=name!==editing.name||storage!==editing.storage||start!==editing.start;
  const applied=!!pendingAutoDate&&entered===pendingAutoDate;
  const preserveAuto=editing.estimated&&entered===editing.expiry&&!changedBasis&&!editing.needsReview;
  let expiry=entered,estimated=applied||preserveAuto;
  if(editing.estimated&&changedBasis&&entered===editing.expiry&&!applied){expiry=null;estimated=false;}
  if(editing.needsReview&&!applied&&!entered){expiry=null;estimated=true}
  const finalGuide=FoodGuide.guidance(name,storage);if(!expiry){expiry=FoodGuide.add(start,FoodGuide.average(finalGuide.period),finalGuide.period.unit);estimated=true;}
  Object.assign(editing,{name,quantity,purchase,storage,start,expiry,estimated,estimateMethod:estimated?(finalGuide.fallback?'default':'average'):null,needsReview:false,guideVersion:FoodGuide.version,icon:FoodGuide.identify(name).icon});
  if(!items.includes(editing))items.push(editing);save();$('#editor').close();editing=null;render();
};
$('#add').onsubmit=e=>{
  e.preventDefault();const name=$('#name').value.trim(),quantity=Number($('#quantity').value),storage=$('#storage').value;
  if(!name||!Number.isFinite(quantity)||quantity<=0||quantity>9999)return;
  const g=FoodGuide.guidance(name,storage),start=today(),expiry=g.period?FoodGuide.add(start,FoodGuide.average(g.period),g.period.unit):null;
  const i={id:crypto.randomUUID(),name,quantity:String(quantity)+' phần',purchase:start,start,storage,expiry,estimated:!!expiry,used:false,icon:g.icon,guideVersion:FoodGuide.version,needsReview:false,estimateMethod:g.fallback?'default':'average'};
  items.push(i);save();render();$('#name').value='';$('#quantity').value='1';
  const message=expiry?`Đã thêm ${name} · ${quantity} phần · ${storeName(storage)}. ${g.fallback?"Lịch nhắc mặc định":"Bảo quản ước tính"}: khoảng ${FoodGuide.averageText(g.period)}.`:`Đã thêm ${name} · ${quantity} phần · ${storeName(storage)}. Chưa đủ dữ liệu để tự tính mốc; bạn có thể ghi rõ loại hoặc nhập hạn trên bao bì.`;
  const b=el('div',message,'bubble');$('#chatlog')?.replaceChildren(b);toast(expiry?'Đã thêm món với mốc tham khảo.':'Đã thêm món, chưa gán hạn dùng.');
};
function updateComposerHint(){const storage=$('#storage').value;$('#hint').textContent=storage==='freezer'?'≤ −18°C · Giả định cấp đông hôm nay; hàng mua đông lạnh ưu tiên HSD bao bì.':'≤ 4°C · Tính từ hôm nay; nguyên liệu tươi sống trừ khi tên ghi rõ đã nấu.'}
$('#storage').onchange=updateComposerHint;updateComposerHint();
$('#search').oninput=render;
$('#filters').onclick=e=>{if(!e.target.dataset.filter)return;filter=e.target.dataset.filter;document.querySelectorAll('#filters button').forEach(b=>b.classList.toggle('selected',b===e.target));render()};
function download(content,type,name){const u=URL.createObjectURL(new Blob([content],{type})),a=el('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$('#export').onclick=()=>download(JSON.stringify(items,null,2),'application/json','tu-lanh-sao-luu.json');
$('#calendar').onclick=()=>{
  const active=items.filter(i=>!i.used&&days(i.expiry)!==null&&days(i.expiry)>=0);if(!active.length)return toast('Chưa có món có mốc/hạn để tạo lịch nhắc.');
  const esc=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Tu lanh nho//VI','CALSCALE:GREGORIAN'];
  for(const i of active){const date=addDays(i.expiry,-1).replaceAll('-','');lines.push('BEGIN:VEVENT',`UID:${i.id}@tu-lanh-nho`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${date}`,`SUMMARY:${esc('Kiểm tra: '+i.name)}`,`DESCRIPTION:${esc((i.estimated?'Mốc tham khảo':'Hạn đã nhập')+': '+fmt(i.expiry)+'. '+storeName(i.storage)+'. Không xác nhận tình trạng thực tế.')}`,'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Kiểm tra thực phẩm','TRIGGER:PT9H','END:VALARM','END:VEVENT')}
  lines.push('END:VCALENDAR');download(lines.join('\r\n')+'\r\n','text/calendar;charset=utf-8','nhac-han-tu-lanh.ics');
};
setInterval(render,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});render();
