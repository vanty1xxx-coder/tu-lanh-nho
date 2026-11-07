/* Notification delivery only; no cached app or authentication/data storage. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{const app=new URL('./',self.location.href).href;const tabs=await self.clients.matchAll({type:'window',includeUncontrolled:true});const tab=tabs.find(c=>c.url.startsWith(app));if(tab)return tab.focus();return self.clients.openWindow(app)})());
});
