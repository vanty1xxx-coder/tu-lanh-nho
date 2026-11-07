(function(){
 const unlocked=()=>!document.body.classList.contains('auth-locked')&&KEY.includes(':user:');
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
 function dialog(id,title){const d=node('dialog',null,'food-tools-dialog');d.id=id;d.setAttribute('aria-labelledby',id+'-title');const head=node('div',null,'food-tools-head'),h=node('h2',title);h.id=id+'-title';const close=node('button','×');close.type='button';close.setAttribute('aria-label','Đóng');close.onclick=()=>d.close();head.append(h,close);const body=node('div',null,'food-tools-body');d.append(head,body);document.body.append(d);return {d,body}}
 const meals=dialog('meal-suggestions','Hôm nay nấu món gì?'),reminder=dialog('one-day-reminders','Nhắc trước 1 ngày');
 const banner=node('section',null,'one-day-banner');banner.hidden=true;banner.setAttribute('aria-live','polite');document.querySelector('#stats').before(banner);
 const mealButton=node('button',null,'meal-side'),reminderButton=node('button',null,'reminder-side');mealButton.type=reminderButton.type='button';mealButton.setAttribute('aria-haspopup','dialog');reminderButton.setAttribute('aria-haspopup','dialog');
 mealButton.append(icon('grid'),document.createTextNode('Gợi ý món Việt'));reminderButton.append(icon('clock'),document.createTextNode('Nhắc trước 1 ngày'));const count=node('span',null,'tool-count');reminderButton.append(count);sideButtons[5].before(mealButton,reminderButton);
 function openMeals(){if(!unlocked())return;renderMeals();closeSide();meals.d.showModal()}
 function openReminder(){if(!unlocked())return;renderReminder();closeSide();reminder.d.showModal()}
 mealButton.onclick=openMeals;reminderButton.onclick=openReminder;
 function renderMeals(){
  meals.body.replaceChildren(node('p','1–3 lựa chọn từ nguyên liệu còn lại, ưu tiên món gần đến mốc. Đây là các phương án thay thế, không phải thực đơn nấu tất cả cùng lúc.'));
  const suggestions=MealGuide.suggest(items,days);
  if(!suggestions.length)meals.body.append(node('p','Chưa có nguyên liệu phù hợp với thư viện công thức đã kiểm chứng. Thêm thực phẩm hoặc ghi rõ loại cá/thịt để có gợi ý chính xác hơn.'));
  for(const r of suggestions){const card=node('article',null,'meal-card');card.append(node('span',r.kind,'meal-kind'),node('h3',r.name));if(r.urgent.length)card.append(node('p','Ưu tiên kiểm tra và dùng sớm: '+r.urgent.map(i=>i.name).join(', '),'meal-urgent'));
   card.append(node('p','Trong tủ: '+r.have.map(i=>i.name+' ('+i.quantity+')').join(', ')),node('p','Cần kiểm tra / bổ sung: '+r.missing.join(', ')),node('p',r.note));
   const a=node('a','Xem công thức gốc ↗');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';card.append(a,node('p','Nguồn: Món Ngon Mỗi Ngày · Ajinomoto Việt Nam.'));meals.body.append(card);
  }
  meals.body.append(node('p','Số lượng hiển thị là lượng còn trong tủ, chưa xác nhận đủ cho định lượng công thức. Không đưa món đã dùng, số lượng bằng 0 hoặc đã quá mốc/hạn vào gợi ý. Xem công thức gốc để kiểm tra nguyên liệu, khẩu phần và cách chế biến.'));
 }
 const read=k=>{try{return localStorage.getItem(k)}catch{return null}},write=(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}};
 const enabled=()=>read(KEY+':notify-enabled')==='1';
 let registration,notifying=false;
 async function worker(){if(!('serviceWorker' in navigator))throw Error('unsupported');if(!registration)registration=navigator.serviceWorker.register('notifications-sw.js').catch(e=>{registration=null;throw e});const reg=await registration;if(reg.active)return reg;return Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),10000))])}
 function renderReminder(){
  const list=MealGuide.reminders(items,days);reminder.body.replaceChildren(node('p','Thực phẩm chưa dùng còn đúng 1 ngày tới hạn đã nhập hoặc mốc kiểm tra ước tính. Mốc này không xác nhận tình trạng an toàn của món ăn.'));
  if(!list.length)reminder.body.append(node('p','Không có thực phẩm chưa dùng nào còn đúng 1 ngày.'));
  for(const i of list){const row=node('div',null,'reminder-item');row.append(node('strong',i.name+' · '+i.quantity),node('p','Ngày mai, '+fmt(i.expiry)+' · '+(i.estimated?'mốc tham khảo / kiểm tra':'hạn bạn đã nhập')+' · '+storeName(i.storage)));reminder.body.append(row)}
  const supported='Notification' in window&&'serviceWorker' in navigator&&window.isSecureContext;
  const status=!supported?'Trình duyệt này chưa hỗ trợ thông báo. Bạn vẫn nhận nhắc trong app và có thể tải lịch nhắc.':Notification.permission==='denied'?'Thông báo đang bị chặn. Nếu muốn bật, mở quyền thông báo của trang trong trình duyệt.':enabled()&&Notification.permission==='granted'?'Đã bật thông báo trình duyệt khi app đang mở.':'Chưa bật thông báo trình duyệt.';
  reminder.body.append(node('p',status,'notification-status'));
  if(supported){const b=node('button',enabled()?'Tắt thông báo trình duyệt':'Bật thông báo trình duyệt');b.onclick=async()=>{if(enabled()){write(KEY+':notify-enabled','0');await clearNotifications();renderReminder();return}const account=KEY;b.disabled=true;try{const permission=await Notification.requestPermission();if(KEY!==account||!unlocked())return;if(permission==='granted'){await worker();if(KEY!==account||!unlocked())return;if(!write(account+':notify-enabled','1'))throw Error('storage');toast('Đã bật nhắc trước 1 ngày khi app đang mở.');await notifyDue()}else toast('Chưa được cấp quyền. Nhắc trong app vẫn hoạt động.')}catch{toast('Không bật được thông báo trên trình duyệt này. Bạn có thể dùng lịch nhắc.')}finally{b.disabled=false;renderReminder()}};reminder.body.append(b)}
  const calendar=node('button','Tải lịch nhắc để dùng khi đóng app');calendar.onclick=()=>document.querySelector('#calendar').click();reminder.body.append(calendar,node('p','App chỉ kiểm tra khi trang đang mở; thông báo có thể chậm khi trình duyệt tạm dừng tab. Chưa có dịch vụ push khi app đóng. Muốn được nhắc ngoài app, tải lịch, nhập vào ứng dụng lịch và bật nhắc của lịch đó.'));
 }
 async function clearNotifications(){try{const reg=await navigator.serviceWorker.getRegistration();if(reg)for(const n of await reg.getNotifications())n.close()}catch{}}
 async function notifyDue(){
  if(notifying||!unlocked()||!enabled()||!('Notification' in window)||Notification.permission!=='granted')return;
  const account=KEY,date=today(),list=MealGuide.reminders(items,days);const pending=list.filter(i=>read(account+':notified:'+i.id+':'+i.expiry)!==date);if(!pending.length)return;
  notifying=true;try{const reg=await worker();if(KEY!==account||!unlocked()||!enabled())return;const current=MealGuide.reminders(items,days);const valid=pending.filter(i=>current.some(j=>j.id===i.id&&j.expiry===i.expiry));if(!valid.length)return;
   await reg.showNotification('Tủ lạnh: '+valid.length+' món còn 1 ngày',{body:valid.map(i=>i.name+' ('+i.quantity+')').slice(0,4).join(', ')+'. Kiểm tra mốc/hạn ngày mai.',tag:'fridge-one-day',data:{account}});
   for(const i of valid)write(account+':notified:'+i.id+':'+i.expiry,date);
  }catch{if(reminder.d.open)toast('Không gửi được thông báo trình duyệt; nhắc trong app vẫn hiện.')}finally{notifying=false}
 }
 let bannerSignature='';
 function update(){
  const list=unlocked()?MealGuide.reminders(items,days):[];count.textContent=String(list.length);count.hidden=!list.length;banner.hidden=!list.length;
  const signature=KEY+JSON.stringify(list.map(i=>[i.id,i.name,i.quantity,i.expiry]));if(signature!==bannerSignature){bannerSignature=signature;banner.replaceChildren();if(list.length){banner.append(node('strong','Ngày mai có '+list.length+' món đến mốc / hạn'),node('p',list.map(i=>i.name+' · '+i.quantity).join(' • ')));const details=node('button','Xem nhắc trước 1 ngày');details.onclick=openReminder;const cook=node('button','Gợi ý món từ tủ lạnh');cook.onclick=openMeals;banner.append(details,cook)}}
  if(meals.d.open)renderMeals();if(reminder.d.open)renderReminder();notifyDue();
 }
 new MutationObserver(update).observe(document.querySelector('#stats'),{childList:true});
 new MutationObserver(()=>{update();if(!unlocked())clearNotifications()}).observe(document.body,{attributes:true,attributeFilter:['class']});
 window.addEventListener('fridge-account-changed',()=>{clearNotifications();update()});update();
})();
