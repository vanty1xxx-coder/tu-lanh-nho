/* Curated from the publisher's recipes, reviewed 2026-11-07. Matching is local. */
(function(root){
 const n=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim();
 const ingredient=(label,aliases)=>({label,aliases:aliases||[label]});
 const recipes=[
  {id:'fish-kho',name:'Cá kho',kind:'Ăn cơm',core:['cá'],url:'cach-kho-ca-ngon-va-don-gian-danh-cho-chi-em-noi-tro',ingredients:[ingredient('cá',['cá']),ingredient('gia vị kho, nước mắm, tiêu'),ingredient('cơm trắng')],note:'Chọn cách kho phù hợp với loại cá; xem hướng dẫn sơ chế và kho tại nguồn.'},
  {id:'pork-kho',name:'Thịt kho',kind:'Ăn cơm',core:['thịt ba chỉ'],url:'thit-kho',ingredients:[ingredient('thịt ba chỉ',['ba chỉ','ba rọi','thịt heo','thịt lợn']),ingredient('hành tím'),ingredient('tỏi'),ingredient('hành lá'),ingredient('dầu ăn'),ingredient('gia vị nêm sẵn thịt kho'),ingredient('cơm trắng')],note:'Công thức gốc dùng thịt ba chỉ. Kiểm tra đúng phần thịt trước khi nấu.'},
  {id:'tofu-tomato',name:'Đậu hũ sốt cà chua',kind:'Ăn cơm',core:['đậu hũ'],url:'mon-ngon-moi-ngay-khong-ngan',ingredients:[ingredient('đậu hũ',['đậu hũ','đậu phụ','đậu hủ']),ingredient('cà chua'),ingredient('hành tím'),ingredient('tỏi'),ingredient('hành lá'),ingredient('nước tương, hạt nêm nấm, đường, tiêu, dầu ăn'),ingredient('cơm trắng')],note:'Xem mục 6 trong bài nguồn để biết định lượng và cách rim sốt.'},
  {id:'chicken-pan',name:'Gà nướng chảo',kind:'Ăn cơm',core:['thịt gà'],url:'ga-nuong-chao',ingredients:[ingredient('thịt gà',['gà','thịt gà']),ingredient('hạt ngò, ngò rí'),ingredient('tỏi'),ingredient('hành tím'),ingredient('ớt'),ingredient('chanh vàng'),ingredient('mật ong, nước mắm, dầu ăn, tiêu, bột ngọt'),ingredient('xà lách'),ingredient('cà chua'),ingredient('cơm trắng')],note:'Công thức gốc dùng má đùi gà rút xương, làm chín đều hai mặt trên chảo.'},
  {id:'fish-noodle',name:'Bún chả cá',kind:'Ăn bún',core:['cá thác lác','cá lóc'],url:'bun-cha-ca',ingredients:[ingredient('cá thác lác',['cá thác lác']),ingredient('cá lóc',['cá lóc']),ingredient('bún tươi',['bún']),ingredient('nước dùng'),ingredient('cà chua'),ingredient('dọc mùng',['dọc mùng','bạc hà']),ingredient('thì là, hành lá, hành tím'),ingredient('nghệ, cơm mẻ, chanh, dầu điều, dầu ăn, mắm tôm, tiêu, bột chiên giòn')],note:'Cần đúng cá thác lác nạo và phi lê cá lóc theo nguồn; cá ghi chung chưa đủ để xác nhận phù hợp.'},
  {id:'fish-porridge',name:'Cháo cá giò heo',kind:'Ăn cháo',core:['cá lóc','giò heo'],url:'chao-ca-gio-heo',ingredients:[ingredient('cá lóc'),ingredient('giò heo',['giò heo','chân giò']),ingredient('gạo tẻ',['gạo','gạo tẻ']),ingredient('gạo nếp'),ingredient('nước dùng, giá, bún, hành, ngò, chanh, ớt, hành phi, gừng'),ingredient('nước mắm, dầu ăn, muối, tiêu, hạt nêm')],note:'Công thức gốc dùng nạc cá lóc và giò heo rút xương; xem nguồn để sơ chế đúng.'},
  {id:'salmon-porridge',name:'Cháo cá hồi',kind:'Ăn cháo',core:['cá hồi'],url:'chao-ca-hoi',ingredients:[ingredient('cá hồi'),ingredient('gạo'),ingredient('cà rốt'),ingredient('đậu que',['đậu que','đậu cô ve']),ingredient('đậu đen'),ingredient('bắp Mỹ',['bắp','ngô']),ingredient('hành ngò, tiêu, muối, hạt nêm')],note:'Đối chiếu định lượng tại nguồn; không tự quy đổi số phần trong tủ thành khẩu phần ăn.'},
  {id:'pork-egg-porridge',name:'Cháo trứng thịt bằm',kind:'Ăn cháo',core:['thịt heo','trứng gà'],url:'chao-trung-thit-bam',ingredients:[ingredient('thịt heo',['thịt heo','thịt lợn','thịt bằm','thịt băm','thịt thăn','ba chỉ','ba rọi']),ingredient('trứng gà',['trứng gà','trứng']),ingredient('gạo tẻ',['gạo','gạo tẻ']),ingredient('gạo nếp'),ingredient('hành lá'),ingredient('ngò rí'),ingredient('hành tím'),ingredient('muối, tiêu, nước mắm, dầu ăn, giấm gạo, hạt nêm')],note:'Nguồn dùng thịt thăn heo băm nhỏ và trứng gà; xem đầy đủ các bước trước khi nấu.'}
 ];
 function matches(item,ing){
  const name=n(item.name);if(/\b(kho|chien|nuong|luoc|hap|canh|chao|bun|cha|sot|xot|hop)\b/.test(name)&&!['bún tươi','cơm trắng'].includes(ing.label))return false;
  if(ing.label==='cá')return /^cá(?:\s|$)/i.test(String(item.name).trim())&&!/^cá (chua|tím|rốt)/i.test(item.name);
  if(ing.label==='thịt gà'&&/\b(trung|chan|long|gan|me)\b/.test(name))return false;
  if(ing.label==='gạo tẻ'&&/\b(nep|lut)\b/.test(name))return false;
  if(ing.label==='trứng gà'&&/\b(cut|vit|muoi|ca)\b/.test(name))return false;
  return ing.aliases.some(a=>(' '+name+' ').includes(' '+n(a)+' '));
 }
 const positive=i=>{const m=String(i.quantity||'').match(/^\s*(\d+(?:[.,]\d+)?)/);return !i.used&&m&&Number(m[1].replace(',','.'))>0};
 function remaining(records,day){return records.filter(i=>positive(i)&&day(i.expiry)!==null&&day(i.expiry)>=0)}
 function reminders(records,day){return records.filter(i=>positive(i)&&day(i.expiry)===1)}
 function suggest(records,day){
  const available=remaining(records,day);
  const ranked=recipes.map(r=>{
   const found=r.ingredients.map(g=>({ingredient:g,items:available.filter(i=>matches(i,g))}));
   if(!found.some(f=>r.core.includes(f.ingredient.label)&&f.items.length))return null;
   const have=found.filter(f=>f.items.length),missing=found.filter(f=>!f.items.length).map(f=>f.ingredient.label);
   const used=[...new Map(have.flatMap(f=>f.items).map(i=>[i.id,i])).values()];
   const urgent=used.filter(i=>day(i.expiry)<=1);
   return {...r,url:'https://monngonmoingay.com/'+r.url+'/',have:used,missing,urgent,score:urgent.length*20+have.length*3-missing.length};
  }).filter(Boolean).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const out=[];for(const r of ranked)if(!out.some(x=>x.kind===r.kind))out.push(r);
  for(const r of ranked)if(out.length<3&&!out.includes(r))out.push(r);
  return out.slice(0,3);
 }
 const api={recipes,matches,positive,remaining,reminders,suggest};root.MealGuide=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
