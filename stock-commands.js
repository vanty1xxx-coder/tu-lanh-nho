/* Plan an entire cooking command before changing any stock. */
(function(root){
  const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const canonical=s=>String(s).normalize('NFC').toLowerCase().replace(/\s+/g,' ').trim();
  const rounded=n=>Math.round((n+Number.EPSILON)*1e6)/1e6;
  const units=new Map(Object.entries({kg:'kg',g:'g',gram:'g',ml:'ml',l:'l',lit:'l',con:'con',trai:'trai',qua:'qua',cu:'cu',hop:'hop',goi:'goi',phan:'phan',lon:'lon',chai:'chai',tui:'tui',mieng:'mieng',vi:'vi',cai:'cai'}));
  function quantity(text){const m=String(text).match(/^\s*(\d+(?:[.,]\d+)?)\s*(.*?)\s*$/u);if(!m)return null;const value=Number(m[1].replace(',','.'));if(!Number.isFinite(value)||value<0)return null;const unit=m[2]||'phần';return {value,unit,key:units.get(normalize(unit))||normalize(unit)}}
  function split(text){const parts=[];let start=0;for(let i=0;i<text.length;i++){const c=text[i];if(c===';'||c==='\n'||c===','&&!(/\d/.test(text[i-1]||'')&&/\d/.test(text[i+1]||''))){parts.push(text.slice(start,i).trim());start=i+1}}parts.push(text.slice(start).trim());return parts.filter(Boolean)}
  function parse(text){
    let input=String(text).trim();const prefix=input.match(/^(?:đã\s+nấu|da\s+nau)\b\s*:?\s*/iu);const cooking=!!prefix;
    if(cooking)input=input.slice(prefix[0].length);else if(!/^[-−–]/u.test(input))return null;
    const parts=split(input);if(!parts.length)return {error:'Nhập ví dụ: đã nấu 1 cá, 1 cà chua.'};
    const commands=[];
    for(const part of parts){const m=part.match(cooking?/^(?:[-−–]\s*)?(\d+(?:[.,]\d+)?)\s*(.+)$/u:/^[-−–]\s*(\d+(?:[.,]\d+)?)\s*(.+)$/u);if(!m)return {error:'Dùng mẫu: đã nấu 1 cá, 1 cà chua hoặc -1 cá, -1 cà chua.'};const amount=Number(m[1].replace(',','.'));if(!Number.isFinite(amount)||amount<=0||amount>9999)return {error:'Số lượng đã dùng phải lớn hơn 0 và không quá 9999.'};let name=m[2].trim(),unit=null;const first=name.match(/^(\S+)\s+(.+)$/u);if(first&&units.has(normalize(first[1]))){unit=units.get(normalize(first[1]));name=first[2].trim();}if(!normalize(name))return {error:'Hãy ghi tên thực phẩm sau số lượng.'};commands.push({amount,name,unit});}
    return {commands};
  }
  function plan(text,records){
    const parsed=parse(text);if(!parsed)return null;if(parsed.error)return parsed;
    if(new Set(records.map(i=>i.id)).size!==records.length)return {error:'Danh sách có mã món trùng. Hãy kiểm tra bản sao lưu trước khi trừ.'};
    const next=records.map(i=>({...i})),before=new Map(records.map(i=>[i.id,i])),touched=new Set(),summary=new Map();
    for(const command of parsed.commands){
      const hasAccents=/[^\x00-\x7F]/u.test(command.name),matchName=hasAccents?canonical:normalize,target=matchName(command.name);
      let matches=next.filter(i=>!i.used&&canonical(i.name)===canonical(command.name));
      if(!matches.length)matches=next.filter(i=>!i.used&&matchName(i.name)===target);
      if(!matches.length)matches=next.filter(i=>!i.used&&(' '+matchName(i.name)+' ').includes(' '+target+' '));
      const names=[...new Set(matches.map(i=>canonical(i.name)))];
      if(names.length>1)return {error:`“${command.name}” khớp nhiều món. Hãy ghi rõ: ${matches.map(i=>i.name).filter((n,i,a)=>a.indexOf(n)===i).join(', ')}.`};
      if(!matches.length)return {error:`Không tìm thấy “${command.name}” trong tủ. Chưa trừ món nào.`};
      let measured=matches.map(item=>({item,q:quantity(item.quantity)}));if(measured.some(x=>!x.q))return {error:`Số lượng của “${matches[0].name}” chưa ở dạng số. Hãy sửa số lượng trước.`};
      const kinds=[...new Set(measured.map(x=>x.q.key))];if(!command.unit&&kinds.length>1)return {error:`“${matches[0].name}” có nhiều đơn vị. Ghi rõ, ví dụ: đã nấu 1 kg ${matches[0].name}.`};
      const unitKey=command.unit||kinds[0];measured=measured.filter(x=>x.q.key===unitKey);if(!measured.length)return {error:`Không có đơn vị tương ứng cho “${command.name}”. Chưa trừ món nào.`};
      const available=rounded(measured.reduce((sum,x)=>sum+x.q.value,0));const name=measured[0].item.name,unit=measured[0].q.unit;
      if(available+1e-6<command.amount)return {error:`Chỉ còn ${available} ${unit} ${name}, không đủ để trừ ${command.amount}. Chưa trừ món nào.`};
      measured.sort((a,b)=>(a.item.expiry||'9999').localeCompare(b.item.expiry||'9999')||(a.item.purchase||'').localeCompare(b.item.purchase||''));
      let remaining=command.amount;
      for(const {item,q}of measured){if(remaining<=0)break;const take=Math.min(q.value,remaining),left=rounded(q.value-take);if(take<=0)continue;item.quantity=String(left)+' '+q.unit;if(left===0){item.used=true;item.quantityBeforeUse=before.get(item.id).quantity;}remaining=rounded(remaining-take);touched.add(item.id);}
      const key=canonical(name)+'|'+unitKey,existing=summary.get(key);summary.set(key,{name,unit,unitKey,amount:rounded((existing?.amount||0)+command.amount)});
    }
    const results=[...summary.values()].map(s=>({...s,remaining:rounded(next.filter(i=>!i.used&&canonical(i.name)===canonical(s.name)&&quantity(i.quantity)?.key===s.unitKey).reduce((sum,i)=>sum+quantity(i.quantity).value,0))}));
    const changes=[...touched].map(id=>({id,before:{...before.get(id)},after:{...next.find(i=>i.id===id)}}));return {items:next,results,changes};
  }
  function undo(changes,records){
    if(changes.some(c=>{const item=records.find(i=>i.id===c.id);return !item||item.quantity!==c.after.quantity||!!item.used!==!!c.after.used||item.name!==c.after.name||item.storage!==c.after.storage}))return {error:'Các món đã thay đổi sau lần trừ này. Không thể hoàn tác tự động.'};
    const next=records.map(i=>({...i}));for(const c of changes){const item=next.find(i=>i.id===c.id);item.quantity=c.before.quantity;item.used=c.before.used;if(c.before.quantityBeforeUse===undefined)delete item.quantityBeforeUse;else item.quantityBeforeUse=c.before.quantityBeforeUse;}return {items:next};
  }
  const api={parse,plan,quantity,undo};root.StockCommands=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
