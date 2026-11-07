/* Reviewed 2026-11-07. Ranges are storage guidance, not verified expiry dates. */
(function(root){
  const sources={
    us:{name:'FoodSafety.gov · Cold Food Storage Chart',url:'https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts'},
    umd:{name:'University of Maryland Extension · Rau củ, trái cây',url:'https://www.extension.umd.edu/resource/storing-garden-fruits-and-vegetables'},
    aces:{name:'Alabama Extension · Food Storage Charts',url:'https://www.aces.edu/blog/topics/disaster-home-family/food-storage-charts/'}
  };
  const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const has=(n,phrase)=>(' '+n+' ').includes(' '+phrase+' ');
  const any=(n,words)=>words.some(w=>has(n,w));
  const range=(min,max,unit='day')=>({min,max,unit});
  function identify(name){
    const n=normalize(name),original=String(name).toLowerCase();
    const record=(id,label,icon,source,fridge,freezer,condition,why='')=>({id,label,icon,source,fridge,freezer,condition,why});
    let r;
    if(any(n,['trung luoc','trung chin']))r=record('egg-cooked','Trứng đã luộc','🥚','us',range(7,7),null,'Đã luộc, giữ lạnh liên tục.','Không khuyến nghị cấp đông trứng luộc.');
    else if(any(n,['trung','egg','eggs'])&&!any(n,['tiet trung','thanh trung','sua','banh trung thu','trung ca']))r=record('egg-shell','Trứng sống còn vỏ','🥚','us',range(3,5,'week'),null,'Giả định trứng sống, nguyên vỏ, được giữ lạnh.','Không cấp đông trứng còn vỏ; trứng đã tách cần hướng dẫn riêng.');
    else if(any(n,['canh','sup','soup','ham'])&&!has(n,'dam ham'))r=record('soup','Canh / súp đã nấu','🍲','us',range(3,4),range(2,3,'month'),'Tính từ ngày nấu; được làm lạnh kịp thời.');
    else if(any(n,['thit xay','thit bam','bo xay','heo xay','lon xay']))r=record('ground','Thịt sống xay','🥩','us',range(1,2),range(3,4,'month'),'Thịt sống đã xay, bảo quản liên tục.');
    else if(any(n,['ca rot','carrot','carrots','cu cai']))r=record('roots','Cà rốt / củ cải nguyên củ','🥕','umd',range(1,2,'week'),null,'Nguyên củ, bỏ lá ngọn.');
    else if(any(n,['ca chua','tomato','tomatoes']))r=record('tomato','Cà chua','🍅','umd',null,null,'Nguồn khuyến nghị để nguyên quả ở nhiệt độ phòng.','Chưa có mốc ngăn mát/ngăn đông phù hợp trong bảng này.');
    else if(any(n,['ca tim','eggplant']))r=record('eggplant','Cà tím','🍆','aces',range(7,7),null,'Nguyên quả, giữ ngăn mát.');
    else if(any(n,['dau tay','strawberry','strawberries']))r=record('berries','Dâu tây','🍓','umd',range(2,3),null,'Tươi nguyên quả, chưa rửa; loại bỏ quả dập.');
    else if(any(n,['viet quat','blueberries','mam xoi','raspberries']))r=record('berries-other','Quả mọng','🫐','umd',range(2,3),null,'Tươi nguyên quả, chưa rửa; loại bỏ quả dập.');
    else if(any(n,['tao','apple','apples']))r=record('apple','Táo nguyên quả','🍎','aces',range(1,1,'month'),null,'Nguyên quả, chưa rửa; ngăn rau quả.');
    else if(any(n,['cam','quyt','buoi','chanh','orange','lemon']))r=record('citrus','Cam, quýt, bưởi, chanh','🍊','aces',range(2,2,'week'),null,'Nguyên quả, chưa rửa.');
    else if(any(n,['nho','grapes']))r=record('grapes','Nho','🍇','aces',range(5,5),null,'Nguyên quả, chưa rửa.');
    else if(any(n,['dua hau','watermelon','dua luoi','melon']))r=record('melon','Dưa','🍉','umd',any(n,['da cat','cat san','bo doi'])?range(3,4):null,null,'Mốc 3–4 ngày chỉ áp dụng dưa đã cắt, đậy kín.','Ghi rõ “dưa hấu đã cắt” để áp dụng mốc tương ứng.');
    else if(/(^|\s)dừa($|\s)/u.test(original))r=record('coconut','Dừa','🥥',null,null,null,'Cần biết còn nguyên quả hay đã mở; ưu tiên hướng dẫn sản phẩm.');
    else if(/(^|\s)dứa($|\s)/u.test(original)||any(n,['thom','pineapple']))r=record('pineapple','Dứa / thơm','🍍','aces',range(2,2),null,'Giữ lạnh; hướng dẫn này không dành cho hàng đóng hộp.');
    else if(any(n,['chuoi','banana']))r=record('banana','Chuối','🍌','aces',has(n,'chin')?range(5,5):null,null,'Chỉ áp dụng khi chuối đã chín và được giữ lạnh.','Ghi rõ “chuối chín” hoặc nhập ngày trên bao bì.');
    else if(/(^|\s)bơ($|\s)/u.test(original)||any(n,['qua bo','trai bo','avocado']))r=record('avocado','Quả bơ','🥑','aces',has(n,'chin')?range(5,5):null,null,'Áp dụng quả đã chín, nguyên quả, giữ lạnh.');
    else if(any(n,['dao','peach']))r=record('peach','Đào','🍑','umd',range(5,5),null,'Đã chín, nguyên quả, giữ ngăn rau quả.');
    else if(any(n,['le','pear']))r=record('pear','Lê','🍐','umd',range(5,5),null,'Đã chín, nguyên quả, giữ ngăn rau quả.');
    else if(any(n,['trai cay','hoa qua','fruit','fruits']))r=record('fruit','Trái cây chưa rõ loại','🍎','umd',null,null,'Mỗi loại có thời gian khác nhau.','Hãy ghi rõ tên như táo, nho hoặc dâu tây.');
    else if(any(n,['xa lach','cai bo xoi','spinach','lettuce']))r=record('greens','Rau salad / cải bó xôi','🥬','umd',range(2,4),null,'Rau tươi, chưa rửa, túi thoáng.');
    else if(any(n,['bong cai','sup lo','bap cai','broccoli','cauliflower','cabbage']))r=record('brassica','Bông cải / bắp cải','🥦','umd',range(3,6),null,'Tươi, túi thoáng trong ngăn mát.');
    else if(any(n,['ot chuong','bell pepper']))r=record('pepper','Ớt chuông','🫑','umd',range(5,5),null,'Nguyên quả, túi thoáng, giữ lạnh.');
    else if(any(n,['dua leo','dua chuot','cucumber']))r=record('cucumber','Dưa leo','🥒','aces',range(7,7),null,'Nguyên quả, giữ lạnh.');
    else if(any(n,['rau','rau cu','cai']))r=record('vegetable','Rau chưa rõ loại','🥬','umd',null,null,'Cần biết loại rau và trạng thái sơ chế.');
    else if(any(n,['sua','milk','yogurt','pho mai']))r=record('dairy','Sữa / sản phẩm đóng gói','🥛',null,null,null,'Hạn phụ thuộc sản phẩm, mở nắp và bao bì.','Nhập đúng hạn và hướng dẫn sau mở nắp của nhà sản xuất.');
    else if(any(n,['ca hoi','ca ngu','ca thu','salmon','tuna','mackerel']))r=record('fatty-fish','Cá béo sống','🐟','us',range(1,3),range(2,3,'month'),'Cá sống; không áp dụng cho cá hun khói / đóng hộp.');
    else if(any(n,['ca tuyet','cod']))r=record('cod','Cá tuyết sống','🐟','us',range(1,3),range(6,8,'month'),'Cá sống, bảo quản liên tục.');
    else if(any(n,['tom','shrimp']))r=record('shrimp','Tôm tươi sống','🦐','us',range(3,5),range(6,18,'month'),'Tôm sống, làm lạnh/cấp đông kịp thời.');
    else if(any(n,['muc','squid']))r=record('squid','Mực tươi sống','🦑','us',range(1,3),range(6,18,'month'),'Mực sống, bảo quản liên tục.');
    else if(any(n,['ga','chicken']))r=record('chicken','Gà sống','🍗','us',range(1,2),has(n,'nguyen con')?range(12,12,'month'):range(9,9,'month'),'Giả định gà sống cắt miếng; gà nguyên con ghi rõ trong tên.');
    else if(any(n,['thit bo','thit heo','thit lon','thit cuu','suon','beef','pork'])||has(original,'bò'))r=record('meat','Thịt đỏ sống nguyên miếng','🥩','us',range(3,5),range(4,12,'month'),'Giả định miếng thịt sống, không xay; mốc đông tùy phần cắt.');
    else if(any(n,['ca','fish','hai san']))r=record('fish-generic','Cá / hải sản chưa rõ loại','🐟','us',null,null,'Loại cá/hải sản có mốc khác nhau.','Ghi rõ cá hồi, cá tuyết, tôm hoặc mực.');
    else r=record('unknown','Chưa nhận diện chắc chắn','📦',null,null,null,'Cần tên cụ thể hoặc ngày trên bao bì.');
    if(r.id==='unknown'){
      const extra=[['xoai','🥭'],['du du','🍈'],['kiwi','🥝'],['dua hau','🍉'],['dua luoi','🍈'],['dua gang','🍈'],['dua','🥥'],['vai','🍎'],['nhan','🍎'],['chom chom','🍎'],['thanh long','🍎'],['oi','🍎'],['sau rieng','🍎'],['khoai tay','🥔'],['khoai lang','🍠'],['hanh','🧅'],['toi','🧄'],['nam','🍄']].find(([word])=>has(n,word));
      if(extra)r=record('produce-other','Rau quả chưa có mốc phù hợp',extra[1],'umd',null,null,'Cần hướng dẫn đúng loại và trạng thái; không tự gán ngày.');
    }
    if(r.id==='citrus'&&has(n,'chanh'))r.icon='🍋';
    if(r.id==='brassica'&&has(n,'bap cai'))r.icon='🥬';
    if(r.id==='melon'&&has(n,'dua luoi'))r.icon='🍈';
    const processed=any(n,['dong hop','say kho','hun khoi','uop muoi','len men','bot','sinh to','nuoc ep'])||/(^|\s)khô($|\s)/u.test(original);
    const cooked=any(n,['da nau','da chin','nau chin','luoc','chien','nuong','hap','xao','rang','kho']);
    if(processed){r={...r,fridge:null,freezer:null,condition:'Sản phẩm đã chế biến/đóng gói: ưu tiên nhãn riêng.',why:'Không áp dụng thời gian của nguyên liệu tươi.'};}
    else if(cooked&&['chicken','meat','ground'].includes(r.id))r=record('cooked-meat','Thịt / gà đã nấu','🍲','us',range(3,4),range(2,6,'month'),'Tính từ ngày nấu; làm lạnh kịp thời.');
    if(any(n,['da cat','cat san'])&&!['melon','meat','chicken','ground','cooked-meat','soup'].includes(r.id))r={...r,fridge:null,freezer:null,condition:'Đã cắt/sơ chế: không dùng mốc dành cho nguyên quả.',why:'Cần hướng dẫn cụ thể cho thực phẩm đã cắt.'};
    return r;
  }
  const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
  function add(date,count,unit){if(!validDate(date))return null;const d=new Date(date+'T12:00:00Z');if(unit==='month'){const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+count);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));}else d.setUTCDate(d.getUTCDate()+count*(unit==='week'?7:1));return d.toISOString().slice(0,10);}
  function guidance(name,storage='fridge'){const r=identify(name),period=r[storage==='freezer'?'freezer':'fridge'];return {...r,period:period||null,storage:storage==='freezer'?'freezer':'fridge',sourceInfo:r.source?sources[r.source]:null,quality:storage==='freezer'||['umd','aces'].includes(r.source)};}
  function periodText(p){if(!p)return '';const u={day:'ngày',week:'tuần',month:'tháng'}[p.unit];return (p.min===p.max?p.min:p.min+'–'+p.max)+' '+u;}
  const api={version:2,sources,normalize,identify,guidance,validDate,add,periodText};root.FoodGuide=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
