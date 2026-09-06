const signinModal=document.getElementById('signinModal');function openSignin(){signinModal.classList.add('open');document.getElementById('signinError').style.display='none';document.getElementById('signinNotice').style.display='none'}function closeSignin(){signinModal.classList.remove('open')}
const DOCUMENTS={
Professional:[['employment-contract','Employment contract'],['residence-permit-application','Residence permit application'],['insurance-certificate','Insurance certificate'],['proof-of-address','Proof of address (for DVV)'],['passport-copy','Passport copy']],
Student:[['admission-letter','Admission letter'],['proof-of-funds','Proof of funds statement'],['insurance-certificate','Insurance certificate'],['passport-copy','Passport copy']],
Researcher:[['hosting-agreement','Hosting agreement'],['salary-confirmation','Salary confirmation letter'],['passport-copy','Passport copy']]
};
const SUPABASE_URL='https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY='YOUR_ANON_KEY';
const sb=(window.supabase&&window.supabase.createClient)?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
let currentUser=null;
function getDisplayName(){
if(!currentUser||!currentUser.email)return 'there';
const local=currentUser.email.split('@')[0];
const first=local.split(/[.\-_0-9]+/)[0]||local;
return first.charAt(0).toUpperCase()+first.slice(1);
}
const familyModal=document.getElementById('familyModal');
const PERSONAS={
Student:{name:'Meera',sub:'Student · Helsinki',progress:42,
steps:[['done','✓','Secure study place','Completed · university admission'],['done','✓','Prepare residence permit','Documents ready · insurance pending'],['','3','Plan finances','Prove roughly €800/month living-cost funds'],['','4','Arrival setup','Identity code · municipality · services']],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Plan post-arrival registration','Based on your city and situation']]},
Researcher:{name:'Divya',sub:'Researcher · Espoo',progress:55,
steps:[['done','✓','Sign hosting agreement','Completed · with research organisation'],['done','✓','Apply for researcher permit','Submitted · salary meets collective agreement'],['','3','Arrange family permit','For spouse and children, if applicable'],['','4','Arrival setup','Identity code · municipality · services']],
tasks:[[1,'Sign hosting agreement','Done · basis for researcher permit'],[1,'Confirm salary meets threshold','Done · min. approx €1,463/month in 2026'],[0,'Arrange family residence permit','If relocating with spouse or children'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]},
Professional:{name:'Arjun',sub:'Professional with family · Helsinki',progress:35,
steps:[['done','✓','Accept job offer','Completed · employer sponsoring permit'],['done','✓','Apply for employment permit','Documents submitted'],['','3','Plan for family','School & daycare research, spouse support'],['','4','Arrival setup','Identity code · municipality · housing']],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Research school and daycare options','For accompanying children'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]}
};
let currentPersona='Student';
let completedStages=new Set();
function setBlur(on){
const ws=document.getElementById('workspace');if(ws)ws.classList.toggle('blurred',on);
const hd=document.querySelector('.dashboard');if(hd)hd.classList.toggle('blurred',on);
}
function showApp(){
document.querySelectorAll('.marketing').forEach(el=>el.style.display='none');
document.getElementById('workspace').style.display='';
window.scrollTo(0,0);
const b=document.getElementById('navAuthBtn');
b.textContent='Log out';
b.setAttribute('onclick','logout()');
}
function showMarketingSite(){
document.querySelectorAll('.marketing').forEach(el=>el.style.display='');
document.getElementById('workspace').style.display='none';
window.scrollTo(0,0);
const b=document.getElementById('navAuthBtn');
b.textContent='Build my roadmap';
b.setAttribute('onclick','openSignin()');
}
window.logout=async function(){
if(sb){try{await sb.auth.signOut();}catch(e){}}
currentUser=null;
showMarketingSite();
};
function showSkeleton(){
document.getElementById('heroName').textContent='Building your roadmap…';
document.getElementById('heroSub').textContent='Personalising for you…';
document.getElementById('heroPill').textContent='';
document.getElementById('heroProgress').style.width='0%';
document.getElementById('heroSteps').innerHTML=[1,2,3,4].map(()=>'<div class="step"><div class="dot" style="background:#e8edf2"></div><div style="flex:1"><div style="height:12px;background:#e8edf2;border-radius:6px;width:70%;margin-bottom:6px"></div><div style="height:9px;background:#edf1f5;border-radius:6px;width:50%"></div></div></div>').join('');
}
function showAppTab(tab){
document.getElementById('tabRoadmap').style.display=tab==='roadmap'?'':'none';
document.getElementById('tabDocuments').style.display=tab==='documents'?'':'none';
document.getElementById('tabbtn-roadmap').classList.toggle('active',tab==='roadmap');
document.getElementById('tabbtn-documents').classList.toggle('active',tab==='documents');
if(tab==='roadmap')updateProgress();
}
window.toggleStage=function(id){
const el=document.getElementById('detail-'+id);
if(el)el.style.display=el.style.display==='none'?'':'none';
};
window.markComplete=function(id,checked){
if(checked)completedStages.add(id);else completedStages.delete(id);
const card=document.querySelector('.rmcard[data-stage="'+id+'"]');
if(card)card.classList.toggle('done',checked);
updateProgress();
};
function updateProgress(){
const activeGrid=currentPersona==='Professional'?document.getElementById('fullRoadmapInner'):document.getElementById('simpleTaskCards');
const badge=document.getElementById('taskProgressBadge');
if(!activeGrid){badge.style.display='none';return}
const total=activeGrid.querySelectorAll('.rmcard').length;
const done=activeGrid.querySelectorAll('.rmcard.done').length;
if(total>0){badge.style.display='inline';badge.textContent=' ('+done+'/'+total+')';}
else{badge.style.display='none';}
}
function resetProgress(){
completedStages=new Set();
document.querySelectorAll('.rmcard').forEach(c=>c.classList.remove('done'));
document.querySelectorAll('.rmdetail').forEach(d=>d.style.display='none');
document.querySelectorAll('.rmcomplete input[type=checkbox]').forEach(cb=>cb.checked=false);
}
function buildSimpleTaskCards(tasks){
return tasks.map((x,i)=>{
const id='simple-'+i;
return '<div class="rmcard pre" data-stage="'+id+'" onclick="toggleStage(\''+id+'\')" style="margin-bottom:12px">'+
'<p class="rmtitle">'+x[1]+'</p>'+
'<p class="rmdesc">'+x[2]+'</p>'+
'<div class="rmdetail" id="detail-'+id+'" style="display:none" onclick="event.stopPropagation()">'+
'<ul class="rmchecklist"><li>'+x[2]+'</li></ul>'+
'<label class="rmcomplete"><input type="checkbox" '+(x[0]?'checked':'')+' onchange="markComplete(\''+id+'\',this.checked)"> Mark complete</label>'+
'</div></div>';
}).join('');
}
function studentOverride(family){
if(!family||!family.living){return{}}
if(family.living==='alone'){
return{sub:'Student · Helsinki',
step3:['','3','Plan finances','Prove roughly €800/month living-cost funds'],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Plan post-arrival registration','Based on your city and situation']]};
}
if(family.family==='spouse'){
return{sub:'Student, relocating with spouse · Helsinki',
step3:['','3','Plan for spouse','Spouse residence permit on family ties, income requirement applies'],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Arrange spouse residence permit','On family ties · income requirement ~€610/month for spouse'],[0,'Plan post-arrival registration','Based on your city and situation']]};
}
const ages=(family.ages||[]).join(', ');
return{sub:'Student with family · Helsinki',
step3:['','3','Plan for family','Spouse and children\u2019s permits, school & daycare research'],
tasks:[[1,'Confirm admission / offer','Done · pathway requirement'],[0,'Arrange required insurance','Before submitting your permit application'],[0,'Prepare proof of funds','~€800/month personal savings, student permit basis'],[0,'Arrange spouse and children\u2019s residence permits','On family ties · income requirement per family member applies'],[0,'Research school and daycare options','For children aged '+ages],[0,'Plan post-arrival registration','Based on your city and situation']]};
}
function professionalOverride(family){
if(!family||!family.living){return{}}
if(family.living==='alone'){
return{sub:'Professional · Helsinki',
step3:['','3','Finalise logistics','Insurance, banking prep and travel booking'],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]};
}
if(family.family==='spouse'){
return{sub:'Professional, relocating with spouse · Helsinki',
step3:['','3','Plan for spouse','Spouse residence permit and settling-in support'],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Arrange spouse residence permit','Based on your employment permit basis'],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]};
}
const ages=(family.ages||[]).join(', ');
return{sub:'Professional with family · Helsinki',
step3:['','3','Plan for family','School & daycare research, spouse support'],
tasks:[[1,'Confirm employment contract & permit basis','Done · employer-sponsored'],[0,'Arrange housing','Before arrival or shortly after'],[0,'Arrange spouse and children\u2019s residence permits','Based on your employment permit basis'],[0,'Research school and daycare options','For children aged '+ages],[0,'Plan post-arrival registration','DVV, tax card, bank, Kela']]};
}
function renderPersona(t,family){
resetProgress();
currentPersona=t;const p=PERSONAS[t];
const o=t==='Professional'?professionalOverride(family):t==='Student'?studentOverride(family):{};
const sub=o.sub||p.sub;
const steps=o.step3?[p.steps[0],p.steps[1],o.step3,p.steps[3]]:p.steps;
const tasks=o.tasks||p.tasks;
document.getElementById('heroName').textContent=getDisplayName()+"’s Finland roadmap";
document.getElementById('heroSub').textContent=t+' · '+sub.split(' · ').slice(1).join(' · ');
document.getElementById('heroPill').textContent=p.progress+'% ready';
document.getElementById('heroProgress').style.width=p.progress+'%';
document.getElementById('heroSteps').innerHTML=steps.map(s=>'<div class="step"><div class="dot '+s[0]+'">'+s[1]+'</div><div><strong>'+s[2]+'</strong><br><small>'+s[3]+'</small></div></div>').join('');
document.getElementById('appHeaderName').textContent=getDisplayName()+"’s Finland roadmap";
document.getElementById('appHeaderSub').textContent=t+' · '+sub.split(' · ').slice(1).join(' · ');
document.getElementById('appHeaderPill').textContent=p.progress+'% ready';
document.getElementById('appHeaderProgress').style.width=p.progress+'%';
document.getElementById('appHeaderPhases').innerHTML=buildPhaseTracker();
['Student','Researcher','Professional'].forEach(k=>document.getElementById('persona-card-'+k).classList.toggle('active',k===t));
const fri=document.getElementById('fullRoadmapInner'),stc=document.getElementById('simpleTaskCards');
if(t==='Professional'){
fri.style.display='';
stc.style.display='none';
const s5=document.getElementById('fr-stage5');
if(!family||!family.living||family.living==='alone'){s5.textContent='Housing support.'}
else if(family.family==='spouse'){s5.textContent='Housing support and spouse settling-in.'}
else{s5.textContent='Housing support, spouse settling-in, and school & daycare research for children aged '+(family.ages||[]).join(', ')+'.'}
}else{
fri.style.display='none';
stc.style.display='';
stc.innerHTML=buildSimpleTaskCards(tasks);
}
document.getElementById('documentList').innerHTML=buildDocumentList(t);
refreshDocumentStatuses();
showAppTab('roadmap');
updateProgress();
}
function selectPersona(t){openSignin()}
renderPersona('Student');
function buildPhaseTracker(){
const phases=[['✓','Explore','done'],['✓','Apply','done'],['3','Travel','current'],['4','Activate',''],['5','Integrate','']];
return phases.map(ph=>{
const circleStyle=ph[2]==='done'?'background:#dff7f1;color:#087c6d':ph[2]==='current'?'background:var(--blue);color:#fff':'background:#E9F0FA;color:var(--blue)';
const labelStyle=ph[2]==='current'?'color:var(--ink);font-weight:500':'color:var(--muted)';
return '<div style="flex:1;text-align:center"><div style="width:24px;height:24px;border-radius:50%;'+circleStyle+';font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 4px">'+ph[0]+'</div><p style="font-size:10px;margin:0;'+labelStyle+'">'+ph[1]+'</p></div>';
}).join('');
}
function buildDocumentList(t){
const docs=DOCUMENTS[t]||[];
return docs.map(d=>{
const[key,name]=d;
return '<div class="docRow" data-key="'+key+'" style="display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:14px;padding:13px 16px;margin-bottom:10px">'+
'<div><p style="margin:0;font-size:14px;font-weight:500">'+name+'</p></div>'+
'<div style="display:flex;align-items:center;gap:10px">'+
'<span class="docStatus" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:#f6f8fb;color:var(--muted)">Checking\u2026</span>'+
'<button class="btn secondary docUploadBtn" style="padding:6px 12px;font-size:12px" onclick="triggerUpload(\''+key+'\',\''+name.replace(/'/g,"\\'")+'\')">Upload</button>'+
'</div></div>';
}).join('');
}
async function refreshDocumentStatuses(){
if(!currentUser||!sb)return;
const{data,error}=await sb.from('documents').select('doc_key,status').eq('user_id',currentUser.id);
const statusMap={};
if(data)data.forEach(r=>{statusMap[r.doc_key]=r.status});
document.querySelectorAll('.docRow').forEach(row=>{
const key=row.getAttribute('data-key');
const status=statusMap[key]||'Not uploaded';
const done=status==='Uploaded';
const badge=row.querySelector('.docStatus'),uploadBtn=row.querySelector('.docUploadBtn');
badge.textContent=status;
badge.style.background=done?'#e8f8f4':'#f6f8fb';
badge.style.color=done?'#087c6d':'var(--muted)';
if(uploadBtn)uploadBtn.style.display=done?'none':'inline-block';
});
}
let pendingUploadKey=null,pendingUploadName=null;
window.triggerUpload=function(key,name){
pendingUploadKey=key;pendingUploadName=name;
document.getElementById('docFileInput').click();
};
window.handleFileSelected=async function(e){
const file=e.target.files[0];
e.target.value='';
if(!file||!pendingUploadKey||!currentUser||!sb)return;
const path=currentUser.id+'/'+pendingUploadKey+'-'+Date.now()+'-'+file.name;
const row=document.querySelector('.docRow[data-key="'+pendingUploadKey+'"]');
const badge=row?row.querySelector('.docStatus'):null;
if(badge)badge.textContent='Uploading\u2026';
const{error:uploadError}=await sb.storage.from('documents').upload(path,file);
if(uploadError){
if(badge){badge.textContent='Upload failed';badge.style.background='#fdf2e5';badge.style.color='#854f0b';}
return;
}
await sb.from('documents').upsert({
user_id:currentUser.id,
doc_key:pendingUploadKey,
doc_name:pendingUploadName,
file_path:path,
status:'Uploaded'
},{onConflict:'user_id,doc_key'});
refreshDocumentStatuses();
};
let authMode='signin';
function toggleAuthMode(e){
e.preventDefault();
authMode=authMode==='signin'?'signup':'signin';
updateAuthUI();
}
function updateAuthUI(){
const title=document.getElementById('authTitle'),sub=document.getElementById('authSubtitle'),
btn=document.getElementById('authSubmitBtn'),toggle=document.getElementById('authToggleRow');
if(authMode==='signup'){
title.textContent='Create account';
sub.textContent='Sign up to build your personalised roadmap.';
btn.textContent='Create account';
toggle.innerHTML='Already have an account? <a href="#" onclick="toggleAuthMode(event)" style="color:var(--blue);font-weight:600">Sign in</a>';
}else{
title.textContent='Sign in';
sub.textContent='Sign in to view your personalised roadmap.';
btn.textContent='Sign in';
toggle.innerHTML='Don\u2019t have an account? <a href="#" onclick="toggleAuthMode(event)" style="color:var(--blue);font-weight:600">Sign up</a>';
}
document.getElementById('signinError').style.display='none';
document.getElementById('signinNotice').style.display='none';
}
async function handleAuthSubmit(){
const email=document.getElementById('signinEmail').value.trim(),
pass=document.getElementById('signinPass').value.trim(),
err=document.getElementById('signinError'),
notice=document.getElementById('signinNotice'),
btn=document.getElementById('authSubmitBtn');
err.style.display='none';notice.style.display='none';
if(!sb){err.textContent='Service unavailable right now. Please refresh and try again.';err.style.display='block';return}
if(!email||!pass){err.textContent='Enter an email and password.';err.style.display='block';return}
btn.disabled=true;btn.style.opacity='.6';
try{
if(authMode==='signup'){
const{data,error}=await sb.auth.signUp({email,password:pass});
if(error){err.textContent=error.message;err.style.display='block';return}
if(!data.session){
notice.textContent='Account created \u2014 check your email to confirm, then sign in.';
notice.style.display='block';
authMode='signin';updateAuthUI();
return;
}
currentUser=data.user;
}else{
const{data,error}=await sb.auth.signInWithPassword({email,password:pass});
if(error){err.textContent=error.message;err.style.display='block';return}
currentUser=data.user;
}
closeSignin();showSkeleton();setBlur(true);openOnboard();
}catch(e){
err.textContent='Something went wrong. Please try again.';err.style.display='block';
}finally{
btn.disabled=false;btn.style.opacity='1';
}
}
signinModal.addEventListener('click',e=>{if(e.target===signinModal)closeSignin()});
const modal=document.getElementById('modal');function openOnboard(){modal.classList.add('open')}function closeOnboard(){modal.classList.remove('open')}
function choose(t){
if(t==='Professional'||t==='Student'){closeOnboard();openFamilyQuestionnaire(t);return}
renderPersona(t);setBlur(false);showApp();const r=document.getElementById('result');r.style.display='block';r.innerHTML='<strong>'+t+' roadmap created.</strong><br>Next steps are prioritised around eligibility, documents, arrival and settling in.';setTimeout(closeOnboard,1300)
}

const famBox=document.getElementById('famWrap');
const famProg=document.getElementById('famProgress');
let famAnswers={};
let famPersona='Professional';

function famDrawProgress(step,total){
famProg.innerHTML='';
for(let i=0;i<total;i++){
const d=document.createElement('div');
d.style.cssText='flex:1;height:5px;border-radius:99px;background:'+(i<step?'var(--blue)':'#e8edf2');
famProg.appendChild(d);
}
}
function famHeader(){
const first=getDisplayName();
return '<p style="font-size:20px;font-weight:500;margin:0 0 6px;">Hi '+first+', let us personalise your roadmap</p><p style="font-size:14px;color:#617387;margin:0 0 20px;line-height:1.6;">A few quick questions so we can tailor your tasks, timelines and family-related steps.</p>';
}
function famOptionBtn(label,handler){
return '<button onclick="'+handler+'" style="width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:15px;padding:15px 16px;font-size:14px;font-weight:500;cursor:pointer;margin-bottom:10px;">'+label+'</button>';
}
function openFamilyQuestionnaire(personaKey){
setBlur(true);
famPersona=personaKey;
famAnswers={};
familyModal.classList.add('open');
famDrawProgress(0,1);
famBox.innerHTML=famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 1</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Are you relocating alone, or with family?</p>'+
famOptionBtn('Just me','famAnswerLiving(&quot;alone&quot;)')+
famOptionBtn('With family','famAnswerLiving(&quot;family&quot;)');
}
window.famAnswerLiving=function(val){
famAnswers.living=val;
if(val==='alone'){famDrawProgress(1,1);famFinish()}
else{famDrawProgress(1,3);famRenderFamilyType()}
};
function famRenderFamilyType(){
famBox.innerHTML=famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 2</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Is it your spouse only, or kids too?</p>'+
famOptionBtn('Spouse only','famAnswerFamily(&quot;spouse&quot;)')+
famOptionBtn('Spouse and kids','famAnswerFamily(&quot;kids&quot;)');
}
window.famAnswerFamily=function(val){
famAnswers.family=val;
if(val==='spouse'){famDrawProgress(3,3);famFinish()}
else{famDrawProgress(2,3);famRenderKids()}
};
function famRenderKids(){
famBox.innerHTML=famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 3</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 4px;">How many kids, and how old is each?</p>'+
'<p style="font-size:13px;color:#617387;margin:0 0 14px;">This helps us bring in the right school and daycare steps at the right time.</p>'+
'<div id="kidRows">'+
'<div class="kidRow" style="border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;"><span style="font-size:13px;color:#617387;width:46px;">Kid 1</span><input class="kidAge" placeholder="Age" style="flex:1;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;padding:9px 11px;font-size:14px;"></div>'+
'</div>'+
'<button onclick="famAddKid()" style="width:100%;text-align:left;background:none;border:none;color:var(--blue);font-size:13px;font-weight:700;cursor:pointer;padding:4px 0 14px;">+ Add another child</button>'+
'<p id="famAgeErr" style="display:none;color:#c0392b;font-size:12px;margin:0 0 10px;">Enter at least one age to continue.</p>'+
'<button onclick="famSubmitKids()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;">Continue →</button>';
}
window.famAddKid=function(){
const rows=document.getElementById('kidRows');
const n=rows.children.length+1;
const div=document.createElement('div');
div.className='kidRow';
div.style.cssText='border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;';
div.innerHTML='<span style="font-size:13px;color:#617387;width:46px;">Kid '+n+'</span><input class="kidAge" placeholder="Age" style="flex:1;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;padding:9px 11px;font-size:14px;">';
rows.appendChild(div);
};
window.famSubmitKids=function(){
const ages=Array.from(document.querySelectorAll('.kidAge')).map(i=>i.value.trim()).filter(Boolean);
const e=document.getElementById('famAgeErr');
if(ages.length===0){e.style.display='block';return}
e.style.display='none';
famAnswers.ages=ages;
famDrawProgress(3,3);
famFinish();
};
function famFinish(){
let note;
if(famAnswers.living==='alone'){note='Just you. We will keep things simple and focused on your own permit and settling-in steps.'}
else if(famAnswers.family==='spouse'){note="You and your spouse. We will include spouse residence permit and settling-in steps."}
else{note='You, your spouse and '+(famAnswers.ages.length>1?'kids':'a child')+' aged '+famAnswers.ages.join(', ')+'. We will include family permits, plus school and daycare steps.'}
famBox.innerHTML='<div style="text-align:center;padding:6px 0 4px;">'+
'<div style="width:44px;height:44px;border-radius:50%;background:#dff7f1;color:#087c6d;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;margin:0 auto 16px;">✓</div>'+
'<p style="font-size:18px;font-weight:500;margin:0 0 8px;">Got it, thanks '+getDisplayName()+'</p>'+
'<p style="font-size:14px;color:#617387;line-height:1.6;margin:0 0 22px;">'+note+'</p>'+
'<button onclick="famComplete()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;">Build my roadmap →</button>'+
'</div>';
}
window.famComplete=function(){
familyModal.classList.remove('open');
renderPersona(famPersona,famAnswers);
document.getElementById('creatingOverlay').classList.add('open');
setTimeout(function(){
document.getElementById('creatingOverlay').classList.remove('open');
setBlur(false);
showApp();
},1600);
};
function recalc(){alert('Demo: roadmap recalculated from your profile, destination, stage and outstanding tasks.')}
const CHAT_FUNCTION_URL='https://YOUR-PROJECT-REF.supabase.co/functions/v1/chat-assistant'; // replace with your actual Edge Function URL
async function ask(){
const i=document.getElementById('question'),q=i.value.trim();
if(!q)return;
const c=document.getElementById('chat');
c.insertAdjacentHTML('beforeend','<div class="bubble user">'+q.replace(/[<>]/g,'')+'</div>');
i.value='';
c.scrollTop=c.scrollHeight;
const thinkingId='thinking-'+Date.now();
c.insertAdjacentHTML('beforeend','<div class="bubble" id="'+thinkingId+'">Thinking…</div>');
c.scrollTop=c.scrollHeight;
try{
const res=await fetch(CHAT_FUNCTION_URL,{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({question:q,persona:currentPersona})
});
const data=await res.json();
const bubble=document.getElementById(thinkingId);
if(!res.ok||data.error){
bubble.textContent="Sorry, I couldn't reach the assistant just now. Please try again.";
}else{
bubble.textContent=data.answer;
}
}catch(err){
const bubble=document.getElementById(thinkingId);
bubble.textContent="Sorry, I couldn't reach the assistant just now. Please try again.";
}
c.scrollTop=c.scrollHeight;
}
modal.addEventListener('click',e=>{if(e.target===modal)closeOnboard()});

const NAV_TEXT_HTML='India\u2013Finland';
const NAV_FLAGS_HTML='<span style="display:inline-flex;align-items:center;gap:5px;vertical-align:-3px">'+
'<svg width="18" height="12" viewBox="0 0 22 15" style="border-radius:2px;flex-shrink:0"><rect width="22" height="5" y="0" fill="#FF9933"/><rect width="22" height="5" y="5" fill="#FFFFFF"/><rect width="22" height="5" y="10" fill="#138808"/><circle cx="11" cy="7.5" r="1.8" fill="none" stroke="#000080" stroke-width="0.5"/><circle cx="11" cy="7.5" r="0.5" fill="#000080"/></svg>'+
'<span style="font-size:11px">\u2192</span>'+
'<svg width="18" height="12" viewBox="0 0 22 15" style="border-radius:2px;flex-shrink:0"><rect width="22" height="15" fill="#FFFFFF"/><rect width="22" height="3.5" y="5.75" fill="#003580"/><rect width="3.5" height="15" x="6" fill="#003580"/></svg>'+
'</span>';
(function navFlagLoop(){
const el=document.getElementById('navFlagToggle');
if(!el)return;
let showingFlags=false;
setInterval(function(){
showingFlags=!showingFlags;
el.style.opacity='0';
setTimeout(function(){
el.innerHTML=showingFlags?NAV_FLAGS_HTML:NAV_TEXT_HTML;
el.style.opacity='1';
},200);
},2800);
el.style.transition='opacity .2s ease';
})();