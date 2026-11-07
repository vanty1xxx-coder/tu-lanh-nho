
const login=document.querySelector('#google-login'),gate=document.querySelector('#auth-gate'),gateMessage=document.querySelector('#auth-message'),retry=document.querySelector('#auth-retry');
const profile=document.createElement('section');profile.id='account-profile';profile.hidden=true;const accountName=document.createElement('strong'),accountInfo=document.createElement('p'),logout=document.createElement('button');logout.textContent='Đăng xuất';profile.append(accountName,accountInfo,logout);document.querySelector('#sidebar .side-bottom').before(profile);
let auth,sdk,authenticatedUid=null;
function setAuthLocked(locked){
  document.body.classList.toggle('auth-locked',locked);gate.hidden=!locked;
  for(const selector of ['main','#sidebar']){const node=document.querySelector(selector);if(node)node.inert=locked;}
  if(locked){for(const d of document.querySelectorAll('dialog[open]'))d.close();document.body.classList.remove('sidebar-open');}
}
setAuthLocked(true);
function switchLocalAccount(user){
  authenticatedUid=user?.uid||null;
  document.querySelector('#editor').close();editing=null;document.querySelector('#chatlog').replaceChildren();profile.hidden=!user;
  if(!user){items=[];KEY='tu-lanh-nho-v1:locked';render();setAuthLocked(true);gateMessage.textContent='Đăng nhập bằng tài khoản Google để mở tủ lạnh của bạn.';login.disabled=false;login.textContent='Tiếp tục với Google';return;}
  KEY='tu-lanh-nho-v1:user:'+user.uid;loadRecords();render();window.dispatchEvent(new Event('fridge-account-changed'));
  accountName.textContent=user.displayName||'Tài khoản Google';accountInfo.textContent=user.email||'';
  document.querySelector('#sidebar .side-bottom').textContent='Đã đăng nhập Google\nDữ liệu lưu trên trình duyệt này';setAuthLocked(false);
}
async function startAuth(){
  try{
    const config=await fetch('./firebase-config.json').then(r=>{if(!r.ok)throw Error('config');return r.json()});
    const [{initializeApp},authSdk]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js')]);
    sdk=authSdk;auth=sdk.getAuth(initializeApp(config));
    sdk.onAuthStateChanged(auth,user=>{retry.hidden=true;const googleUser=user?.providerData?.some(p=>p.providerId==='google.com')?user:null;switchLocalAccount(googleUser);},()=>{authenticatedUid=null;items=[];render();setAuthLocked(true);gateMessage.textContent='Không kiểm tra được phiên đăng nhập. Kiểm tra kết nối rồi thử lại.';retry.hidden=false;login.disabled=true;});
  }catch{
    setAuthLocked(true);login.disabled=true;gateMessage.textContent='Chưa kết nối được Google. Hãy kiểm tra mạng rồi nhấn Thử lại.';retry.hidden=false;
  }
}
login.onclick=async()=>{
  if(!auth||authenticatedUid)return;
  login.disabled=true;login.textContent='Đang mở Google…';gateMessage.textContent='Chọn tài khoản trong cửa sổ Google để tiếp tục.';
  const slow=setTimeout(()=>{if(!authenticatedUid){gateMessage.textContent='Nếu không thấy cửa sổ Google, hãy cho phép pop-up hoặc mở app trong Chrome/Safari rồi thử lại.';login.disabled=false;login.textContent='Thử đăng nhập Google lại';}},30000);
  try{
    const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
    await sdk.signInWithPopup(auth,provider);
  }catch(e){
    const messages={'auth/popup-blocked':'Trình duyệt đang chặn cửa sổ Google. Cho phép pop-up rồi thử lại.','auth/popup-closed-by-user':'Bạn đã đóng cửa sổ đăng nhập. Đăng nhập Google để tiếp tục.','auth/cancelled-popup-request':'Vui lòng hoàn tất cửa sổ Google đang mở.','auth/unauthorized-domain':'Địa chỉ app chưa được cho phép đăng nhập Google.','auth/network-request-failed':'Không kết nối được Google. Hãy kiểm tra mạng.'};
    if(!authenticatedUid)gateMessage.textContent=messages[e.code]||'Chưa đăng nhập được. Hãy thử lại bằng tài khoản Google.';
  }finally{clearTimeout(slow);login.disabled=false;login.textContent='Tiếp tục với Google';}
};
retry.onclick=()=>location.reload();
logout.onclick=async()=>{logout.disabled=true;try{await sdk.signOut(auth);switchLocalAccount(null);}catch{toast('Chưa đăng xuất được. Vui lòng thử lại.')}finally{logout.disabled=false}};
// Hidden/inert app content remains unavailable until Firebase confirms a user.
document.addEventListener('submit',event=>{if(!authenticatedUid&&event.target.closest('main,dialog')){event.preventDefault();event.stopImmediatePropagation();setAuthLocked(true)}},true);
document.addEventListener('click',event=>{if(!authenticatedUid&&event.target.closest('main,#sidebar,dialog')){event.preventDefault();event.stopImmediatePropagation();setAuthLocked(true)}},true);
startAuth();
