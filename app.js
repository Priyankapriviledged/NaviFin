const signinModal=document.getElementById('signinModal');function openSignin(){signinModal.classList.add('open');document.getElementById('signinError').style.display='none';document.getElementById('signinNotice').style.display='none'}function closeSignin(){signinModal.classList.remove('open')}
const DOCUMENTS={
Professional:[['employment-contract','Employment contract'],['residence-permit-application','Residence permit application'],['insurance-certificate','Insurance certificate'],['proof-of-address','Proof of address (for DVV)'],['passport-copy','Passport copy']],
Student:[['admission-letter','Admission letter'],['proof-of-funds','Proof of funds statement'],['insurance-certificate','Insurance certificate'],['passport-copy','Passport copy']],
Researcher:[['hosting-agreement','Hosting agreement'],['salary-confirmation','Salary confirmation letter'],['passport-copy','Passport copy']]
};
let sb=null;
if(!window.supabase||!window.supabase.createClient){
console.error('NaviFin: The Supabase SDK failed to load (check your internet connection, ad blocker, or the CDN script tag in index.html).');
}else if(SUPABASE_URL.includes('YOUR_PROJECT_REF')||SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')){
console.error('NaviFin: Supabase is not configured. Open config.js and replace the placeholder SUPABASE_URL and SUPABASE_ANON_KEY with your real project values.');
}else{
sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
}
let currentUser=null;
function getDisplayName(){
if(!currentUser||!currentUser.email)return 'Arun';
const local=currentUser.email.split('@')[0];
const first=local.split(/[.\-_0-9]+/)[0]||local;
return first.charAt(0).toUpperCase()+first.slice(1);
}
function firstNameOf(family){
if(family&&family.name&&family.name.trim())return family.name.trim().split(/\s+/)[0];
return getDisplayName();
}
const CITY_OPTIONS=['Espoo','Helsinki','Vantaa','Tampere','Oulu','Turku','Jyv\u00e4skyl\u00e4','Other city in Finland'];
const NATIONALITIES=['Afghan','Albanian','Algerian','American','Andorran','Angolan','Argentine','Armenian','Australian','Austrian','Azerbaijani','Bahamian','Bahraini','Bangladeshi','Barbadian','Belarusian','Belgian','Belizean','Beninese','Bhutanese','Bolivian','Bosnian','Brazilian','British','Bruneian','Bulgarian','Burkinabe','Burmese','Burundian','Cambodian','Cameroonian','Canadian','Cape Verdean','Chadian','Chilean','Chinese','Colombian','Comoran','Congolese','Costa Rican','Croatian','Cuban','Cypriot','Czech','Danish','Djiboutian','Dominican','Dutch','East Timorese','Ecuadorian','Egyptian','Emirati','English','Equatorial Guinean','Eritrean','Estonian','Ethiopian','Fijian','Filipino','Finnish','French','Gabonese','Gambian','Georgian','German','Ghanaian','Greek','Grenadian','Guatemalan','Guinean','Guyanese','Haitian','Honduran','Hungarian','Icelandic','Indian','Indonesian','Iranian','Iraqi','Irish','Israeli','Italian','Ivorian','Jamaican','Japanese','Jordanian','Kazakhstani','Kenyan','Kiribati','Kuwaiti','Kyrgyz','Lao','Latvian','Lebanese','Liberian','Libyan','Liechtensteiner','Lithuanian','Luxembourgish','Macedonian','Malagasy','Malawian','Malaysian','Maldivian','Malian','Maltese','Mauritanian','Mauritian','Mexican','Micronesian','Moldovan','Monacan','Mongolian','Montenegrin','Moroccan','Mozambican','Namibian','Nauruan','Nepalese','New Zealander','Nicaraguan','Nigerian','Nigerien','North Korean','Norwegian','Omani','Pakistani','Palauan','Palestinian','Panamanian','Papua New Guinean','Paraguayan','Peruvian','Polish','Portuguese','Qatari','Romanian','Russian','Rwandan','Saint Lucian','Salvadoran','Samoan','Saudi Arabian','Scottish','Senegalese','Serbian','Seychellois','Sierra Leonean','Singaporean','Slovak','Slovenian','Solomon Islander','Somali','South African','South Korean','South Sudanese','Spanish','Sri Lankan','Sudanese','Surinamese','Swazi','Swedish','Swiss','Syrian','Taiwanese','Tajik','Tanzanian','Thai','Togolese','Tongan','Trinidadian','Tunisian','Turkish','Turkmen','Tuvaluan','Ugandan','Ukrainian','Uruguayan','Uzbekistani','Vanuatuan','Venezuelan','Vietnamese','Welsh','Yemeni','Zambian','Zimbabwean'];
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
window.toggleChat=function(){
document.getElementById('chatPanel').classList.toggle('open');
};
let currentStages=[],currentView='stage-0';
function renderSidebar(stages){
let html='';
let lastGroup=null,groupIndex=0;
stages.forEach((s,i)=>{
if(s.group!==lastGroup){
html+='<p class="sbGroupLabel">'+s.groupLabel+'</p>';
lastGroup=s.group;
groupIndex=0;
}
groupIndex++;
const done=completedStages.has(s.key);
const isCurrent=currentView==='stage-'+i;
const dotClass=done?'sbDot done':(isCurrent?'sbDot current':'sbDot');
const dotContent=done?'&#10003;':(groupIndex<10?'0'+groupIndex:groupIndex);
html+='<div class="sbItem'+(isCurrent?' active':'')+'" onclick="selectStage('+i+')"><span class="'+dotClass+'">'+dotContent+'</span><span class="sbLabel">'+s.title+'</span></div>';
});
html+='<div class="sbDocLink'+(currentView==='documents'?' active':'')+'" onclick="selectDocumentsView()">Documents</div>';
document.getElementById('appSidebar').innerHTML=html;
}
window.selectStage=function(i){
currentView='stage-'+i;
const s=currentStages[i];
if(!s)return;
const done=completedStages.has(s.key);
let html='<p style="font-size:12px;color:var(--blue);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px">'+(s.meta?s.meta:'Stage '+(i+1))+'</p>'+
'<p style="font-size:22px;font-weight:700;color:var(--navy);margin:0 0 14px">'+s.title+'</p>'+
'<p style="font-size:14px;color:var(--muted);margin:0 0 22px;line-height:1.6">'+s.desc+'</p>'+
'<div style="background:var(--bg);border-radius:12px;padding:18px 20px;margin-bottom:16px">'+
'<p style="font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px">Checklist</p>'+
'<ul style="margin:0;padding-left:18px;font-size:13px;color:var(--ink);line-height:1.9">'+s.checklist.map(c=>'<li>'+c+'</li>').join('')+'</ul>'+
'</div>';
if(s.officialSource){
const o=s.officialSource;
html+='<div style="border:1px solid var(--line);border-radius:12px;padding:20px 22px;margin-bottom:16px">'+
'<p style="font-size:16px;font-weight:700;color:var(--navy);margin:0 0 16px">Official source</p>'+
'<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">'+
'<div><p style="font-size:15px;font-weight:700;color:var(--navy);margin:0 0 6px">'+o.docName+'</p>'+
'<p style="font-size:13px;color:var(--muted);margin:0">Authority: <span style="color:var(--blue);font-weight:700">'+o.authority+'</span> ('+o.authorityFull+')</p></div>'+
'<a href="'+o.url+'" target="_blank" rel="noopener" style="flex-shrink:0;display:inline-flex;align-items:center;gap:6px;background:var(--blue);color:#fff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none;white-space:nowrap">Visit official site &#8599;</a>'+
'</div></div>';
}
if(s.verificationNote){
html+='<div style="background:#fdf2e5;border-radius:10px;padding:14px 16px;margin-bottom:20px">'+
'<p style="font-size:13px;font-weight:700;color:#854f0b;margin:0 0 4px;display:flex;align-items:center;gap:7px">'+
'<svg width="15" height="15" viewBox="0 0 24 24" fill="#e8a33d" style="flex-shrink:0"><path d="M12 2L1 21h22L12 2zm0 6v6m0 3h.01" stroke="#fff" stroke-width="1.5" fill="#e8a33d"/></svg>'+
'Verification required</p>'+
'<p style="font-size:12.5px;color:#854f0b;margin:0 0 0 22px;line-height:1.6">'+s.verificationNote+'</p></div>';
}
html+='<button id="markCompleteBtn" onclick="markComplete(\''+s.key+'\',!'+done+')" style="width:100%;background:#087c6d;color:#fff;border:none;border-radius:10px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">'+
(done?'&#10003; Completed':'&#10003; Mark complete')+'</button>';
document.getElementById('appDetail').innerHTML=html;
renderSidebar(currentStages);
};
window.markComplete=function(key,checked){
if(checked)completedStages.add(key);else completedStages.delete(key);
renderSidebar(currentStages);
updateProgress();
if(currentView.indexOf('stage-')===0){
const idx=parseInt(currentView.split('-')[1],10);
if(currentStages[idx]&&currentStages[idx].key===key)selectStage(idx);
}
};
function updateProgress(){
const total=currentStages.length;
const done=currentStages.filter(s=>completedStages.has(s.key)).length;
const pill=document.getElementById('appHeaderPill');
if(pill)pill.textContent=total>0?done+'/'+total+' complete':'';
}
function resetProgress(){
completedStages=new Set();
}
function buildSimpleStages(tasks){
return tasks.map((x,i)=>({key:'simple-'+i,group:'main',groupLabel:'Your tasks',meta:'',title:x[1],desc:x[2],checklist:[x[2]]}));
}
function buildProfessionalStages(family){
let stage5Desc='Housing support.';
if(family&&family.living&&family.living!=='alone'){
if(family.family==='spouse')stage5Desc='Housing support and spouse settling-in.';
else stage5Desc='Housing support, spouse settling-in, and school & daycare research for children aged '+(family.ages||[]).join(', ')+'.';
}
return[
{key:'pre-1',group:'pre',groupLabel:'Pre-arrival preparations',meta:'',title:'Relocation start',desc:'GDPR consent, questionnaire, pre-consultation if needed',checklist:['Give GDPR consent to your relocation provider','Complete the intake questionnaire','Book a pre-consultation call if you have questions']},
{key:'pre-2',group:'pre',groupLabel:'Pre-arrival preparations',meta:'',title:'Immigration',desc:'Residence permit application, employer-sponsored',checklist:['Confirm your permit basis with your employer','Submit residence permit application','Prepare supporting documents Migri requests'],officialSource:{docName:'Apply for residence permit',authority:'Migri',authorityFull:'Finnish Immigration Service',url:'https://migri.fi/en/i-want-a-residence-permit'},verificationNote:'Requirements can change. Always confirm the current process directly with Migri before you apply.'},
{key:'pre-3',group:'pre',groupLabel:'Pre-arrival preparations',meta:'1–3 months',title:'Permit decision & cards',desc:'Book flights only after receiving the cards',checklist:['Track your application status','Receive your decision and residence permit cards','Only then book flight tickets']},
{key:'pre-4',group:'pre',groupLabel:'Pre-arrival preparations',meta:'',title:'Pre-arrival call',desc:'With a local relocation consultant',checklist:['Schedule your pre-arrival consultation','Review arrival logistics and open questions']},
{key:'pre-5',group:'pre',groupLabel:'Pre-arrival preparations',meta:'on arrival',title:'Destination services',desc:stage5Desc,checklist:[stage5Desc]},
{key:'post-1',group:'post',groupLabel:'After arrival',meta:'1–4 days',title:'Local registration (DVV)',desc:'Finnish ID number, healthcare eligibility, address registration',checklist:['Book a DVV appointment or visit a service point','Bring passport and residence permit card','Receive your Finnish personal ID number'],officialSource:{docName:'Get a personal identity code from DVV',authority:'DVV',authorityFull:'Digital and Population Data Services',url:'https://dvv.fi/en/personal-identity-code'},verificationNote:'Requirements can change. Always confirm the current process directly with DVV before you register.'},
{key:'post-2',group:'post',groupLabel:'After arrival',meta:'after ID',title:'Tax card',desc:'Required before your first payroll run',checklist:['Apply for your tax card via Vero','Share it with your employer before payroll'],officialSource:{docName:'Register with Finnish Tax Authority',authority:'Vero',authorityFull:'Finnish Tax Administration',url:'https://www.vero.fi/en/individuals/'},verificationNote:'Requirements can change. Always confirm the current process directly with Vero before you register.'},
{key:'post-3',group:'post',groupLabel:'After arrival',meta:'3–4 months',title:'Social security (Kela)',desc:'Apply as soon as your ID number is ready',checklist:['Submit your Kela application','Expect 3–4 months processing time'],officialSource:{docName:'Apply for Kela card',authority:'Kela',authorityFull:'Social Insurance Institution of Finland',url:'https://www.kela.fi/ulkomailta-suomeen'},verificationNote:'Requirements can change. Always confirm the current process directly with Kela before you apply.'},
{key:'post-4',group:'post',groupLabel:'After arrival',meta:'7–14 days',title:'Bank account',desc:'Needs a registered address from DVV first',checklist:['Book a bank appointment after DVV registration','Bring ID and proof of address']},
{key:'post-5',group:'post',groupLabel:'After arrival',meta:'parallel',title:'Home search',desc:'More options open up once your ID number is issued',checklist:['Start browsing while your permit is processing','More listings available once you have a Finnish ID']},
{key:'post-6',group:'post',groupLabel:'After arrival',meta:'ongoing',title:'Enjoy Finland',desc:'Update your bank details with Kela and tax office · don\u2019t forget the sauna',checklist:['Update bank details with Kela and tax office','Settle into everyday life']}
];
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
let sub=o.sub||p.sub;
if(family&&family.city){
const parts=sub.split(' · ');
parts[parts.length-1]=family.city;
sub=parts.join(' · ');
}
const steps=o.step3?[p.steps[0],p.steps[1],o.step3,p.steps[3]]:p.steps;
const tasks=o.tasks||p.tasks;
const displayName=firstNameOf(family);
document.getElementById('heroName').textContent=displayName+"’s Finland roadmap";
document.getElementById('heroSub').textContent=t+' · '+sub.split(' · ').slice(1).join(' · ');
document.getElementById('heroPill').textContent=p.progress+'% ready';
document.getElementById('heroProgress').style.width=p.progress+'%';
document.getElementById('heroSteps').innerHTML=steps.map(s=>'<div class="step"><div class="dot '+s[0]+'">'+s[1]+'</div><div><strong>'+s[2]+'</strong><br><small>'+s[3]+'</small></div></div>').join('');
document.getElementById('appHeaderName').textContent=displayName+"’s Finland roadmap";
document.getElementById('appHeaderSub').textContent=t+' · '+sub.split(' · ').slice(1).join(' · ');
document.getElementById('editDetailsLink').style.display='inline-block';
document.getElementById('appHeaderPhases').innerHTML=buildPhaseTracker();
['Student','Researcher','Professional'].forEach(k=>document.getElementById('persona-card-'+k).classList.toggle('active',k===t));
currentStages=t==='Professional'?buildProfessionalStages(family):buildSimpleStages(tasks);
currentView='stage-0';
selectStage(0);
updateProgress();
}
function selectPersona(t){openSignin()}
renderPersona('Student');
function buildPhaseTracker(){
const phases=[
['Prepare','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0047BA" stroke-width="2"><rect x="5" y="4" width="14" height="17" rx="1.5"/><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1M9 11h6M9 15h6"/></svg>'],
['Apply','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0047BA" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>'],
['Travel','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0047BA" stroke-width="2"><path d="M2 16l20-8-8 20-3-9-9-3z"/></svg>'],
['Register','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0047BA" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M14 10h5M14 14h3"/></svg>'],
['Settle in','<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0047BA" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>']
];
return phases.map(ph=>{
return '<div style="flex:1;text-align:center"><div style="width:24px;height:24px;border-radius:50%;background:#E9F0FA;display:flex;align-items:center;justify-content:center;margin:0 auto 4px">'+ph[1]+'</div><p style="font-size:12px;font-weight:700;margin:0;color:var(--ink)">'+ph[0]+'</p></div>';
}).join('');
}
function buildDocumentList(t){
const docs=DOCUMENTS[t]||[];
return docs.map(d=>{
const[key,name]=d;
return '<div class="docRow" data-key="'+key+'" style="display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:14px;padding:13px 16px;margin-bottom:10px">'+
'<div><p style="margin:0;font-size:14px;font-weight:500">'+name+'</p></div>'+
'<div class="docActions" style="display:flex;align-items:center;gap:10px">'+
'<span class="docStatus" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:#f6f8fb;color:var(--muted)">Checking\u2026</span>'+
'<button class="btn secondary docViewBtn" style="padding:6px 12px;font-size:12px;display:none" onclick="viewDocument(\''+key+'\')">View</button>'+
'<button class="btn secondary docUploadBtn" style="padding:6px 12px;font-size:12px" onclick="triggerUpload(\''+key+'\',\''+name.replace(/'/g,"\\'")+'\')">Upload</button>'+
'</div></div>';
}).join('');
}
window.selectDocumentsView=function(){
currentView='documents';
document.getElementById('appDetail').innerHTML=
'<p style="font-size:22px;font-weight:700;color:var(--navy);margin:0 0 8px">Documents</p>'+
'<p style="font-size:14px;color:var(--muted);margin:0 0 22px">Documents that come up across your roadmap, in one place.</p>'+
'<div id="documentList">'+buildDocumentList(currentPersona)+'</div>';
refreshDocumentStatuses();
renderSidebar(currentStages);
};
let docPathMap={};
async function refreshDocumentStatuses(){
if(!currentUser||!sb)return;
const{data,error}=await sb.from('documents').select('doc_key,status,file_path').eq('user_id',currentUser.id);
const statusMap={};
docPathMap={};
if(data)data.forEach(r=>{statusMap[r.doc_key]=r.status;docPathMap[r.doc_key]=r.file_path});
document.querySelectorAll('.docRow').forEach(row=>{
const key=row.getAttribute('data-key');
const status=statusMap[key]||'Not uploaded';
const done=status==='Uploaded';
const badge=row.querySelector('.docStatus'),uploadBtn=row.querySelector('.docUploadBtn'),viewBtn=row.querySelector('.docViewBtn');
badge.textContent=status;
badge.style.background=done?'#e8f8f4':'#f6f8fb';
badge.style.color=done?'#087c6d':'var(--muted)';
if(uploadBtn)uploadBtn.textContent=done?'Replace':'Upload';
if(viewBtn)viewBtn.style.display=done?'inline-block':'none';
});
}
window.viewDocument=async function(key){
if(!sb||!currentUser)return;
const path=docPathMap[key];
if(!path)return;
const{data,error}=await sb.storage.from('documents').createSignedUrl(path,300);
if(error||!data){
console.error('Could not create signed URL:',error);
alert("Sorry, couldn't open that file right now. Please try again.");
return;
}
window.open(data.signedUrl,'_blank');
};
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
console.error('Document storage upload failed:',uploadError);
if(badge){badge.textContent='Upload failed';badge.style.background='#fdf2e5';badge.style.color='#854f0b';}
return;
}
const{error:dbError}=await sb.from('documents').upsert({
user_id:currentUser.id,
doc_key:pendingUploadKey,
doc_name:pendingUploadName,
file_path:path,
status:'Uploaded'
},{onConflict:'user_id,doc_key'});
if(dbError){
console.error('Document DB write failed:',dbError);
if(badge){badge.textContent='Upload failed';badge.style.background='#fdf2e5';badge.style.color='#854f0b';}
return;
}
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
closeOnboard();openFamilyQuestionnaire(t);
}

const famBox=document.getElementById('famWrap');
const famProg=document.getElementById('famProgress');
let famAnswers={};
let famPersona='Professional';
let famHistory=[];

function famDrawProgress(step,total){
famProg.innerHTML='';
for(let i=0;i<total;i++){
const d=document.createElement('div');
d.style.cssText='flex:1;height:5px;border-radius:99px;background:'+(i<step?'var(--blue)':'#e8edf2');
famProg.appendChild(d);
}
}
function famHeader(){
const first=firstNameOf(famAnswers);
return '<p style="font-size:20px;font-weight:500;margin:0 0 6px;">Hi '+first+', let us personalise your roadmap</p><p style="font-size:14px;color:#617387;margin:0 0 20px;line-height:1.6;">A few quick questions so we can tailor your tasks, timelines and family-related steps.</p>';
}
function famBackLink(){
return '<a href="#" onclick="event.preventDefault();famGoBack()" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#617387;font-weight:600;text-decoration:none;margin-bottom:14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#617387" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>Back</a>';
}
function famOptionBtn(label,handler){
return '<button onclick="'+handler+'" style="width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:15px;padding:15px 16px;font-size:14px;font-weight:500;cursor:pointer;margin-bottom:10px;">'+label+'</button>';
}
function isResearcher(){return famPersona==='Researcher'}

function openFamilyQuestionnaire(personaKey){
setBlur(true);
famPersona=personaKey;
famAnswers={};
famHistory=[];
familyModal.classList.add('open');
famRenderStep('name');
}
window.famGoBack=function(){
famHistory.pop();
const prev=famHistory.pop();
if(!prev){
familyModal.classList.remove('open');
openOnboard();
return;
}
famRenderStep(prev);
};
function famRenderStep(name){
famHistory.push(name);
if(name==='name')famRenderName();
else if(name==='nationality')famRenderNationality();
else if(name==='city')famRenderCity();
else if(name==='living')famRenderLiving();
else if(name==='familytype')famRenderFamilyType();
else if(name==='kids')famRenderKids();
}

function famRenderName(){
const total=isResearcher()?3:6;
famDrawProgress(1,total);
famBox.innerHTML=famBackLink()+famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 1</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Your full name?</p>'+
'<input id="famNameInput" placeholder="e.g. Arjun Kumar" value="'+(famAnswers.name||'')+'" style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;margin-bottom:6px;">'+
'<p id="famNameErr" style="display:none;color:#c0392b;font-size:12px;margin:0 0 10px;">Enter your name to continue.</p>'+
'<button onclick="famSubmitName()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;margin-top:8px;">Continue →</button>';
}
window.famSubmitName=function(){
const val=document.getElementById('famNameInput').value.trim();
const err=document.getElementById('famNameErr');
if(!val){err.style.display='block';return}
err.style.display='none';
famAnswers.name=val;
famRenderStep('nationality');
};

function famRenderNationality(){
const total=isResearcher()?3:6;
famDrawProgress(2,total);
famBox.innerHTML=famBackLink()+famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 2</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Your nationality?</p>'+
'<select id="famNatInput" style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;margin-bottom:6px;background:#fff;">'+
'<option value="">Select nationality</option>'+
NATIONALITIES.map(n=>'<option value="'+n+'"'+(famAnswers.nationality===n?' selected':'')+'>'+n+'</option>').join('')+
'</select>'+
'<p id="famNatErr" style="display:none;color:#c0392b;font-size:12px;margin:0 0 10px;">Select a nationality to continue.</p>'+
'<button onclick="famSubmitNationality()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;margin-top:8px;">Continue →</button>';
}
window.famSubmitNationality=function(){
const val=document.getElementById('famNatInput').value;
const err=document.getElementById('famNatErr');
if(!val){err.style.display='block';return}
err.style.display='none';
famAnswers.nationality=val;
famRenderStep('city');
};

function famRenderCity(){
const total=isResearcher()?3:6;
famDrawProgress(3,total);
famBox.innerHTML=famBackLink()+famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 3</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Which city are you moving to?</p>'+
'<select id="famCityInput" style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;margin-bottom:6px;background:#fff;">'+
'<option value="">Select a city</option>'+
CITY_OPTIONS.map(c=>'<option value="'+c+'"'+(famAnswers.city===c?' selected':'')+'>'+c+'</option>').join('')+
'</select>'+
'<p id="famCityErr" style="display:none;color:#c0392b;font-size:12px;margin:0 0 10px;">Select a city to continue.</p>'+
'<button onclick="famSubmitCity()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:12px;padding:13px;font-weight:750;font-size:14px;cursor:pointer;margin-top:8px;">Continue →</button>';
}
window.famSubmitCity=function(){
const val=document.getElementById('famCityInput').value;
const err=document.getElementById('famCityErr');
if(!val){err.style.display='block';return}
err.style.display='none';
famAnswers.city=val;
if(isResearcher()){famDrawProgress(3,3);famFinish();}
else{famRenderStep('living');}
};

function famRenderLiving(){
famDrawProgress(4,6);
famBox.innerHTML=famBackLink()+famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 4</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Are you relocating alone, or with family?</p>'+
famOptionBtn('Just me','famAnswerLiving(&quot;alone&quot;)')+
famOptionBtn('With family','famAnswerLiving(&quot;family&quot;)');
}
window.famAnswerLiving=function(val){
famAnswers.living=val;
if(val==='alone'){famDrawProgress(4,4);famFinish()}
else{famRenderStep('familytype')}
};
function famRenderFamilyType(){
famDrawProgress(5,6);
famBox.innerHTML=famBackLink()+famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 5</p>'+
'<p style="font-size:15px;font-weight:500;margin:0 0 14px;">Is it your spouse only, or kids too?</p>'+
famOptionBtn('Spouse only','famAnswerFamily(&quot;spouse&quot;)')+
famOptionBtn('Spouse and kids','famAnswerFamily(&quot;kids&quot;)');
}
window.famAnswerFamily=function(val){
famAnswers.family=val;
if(val==='spouse'){famDrawProgress(5,5);famFinish()}
else{famRenderStep('kids')}
};
function famRenderKids(){
famDrawProgress(6,6);
famBox.innerHTML=famBackLink()+famHeader()+
'<p style="font-size:13px;font-weight:700;color:#617387;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Question 6</p>'+
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
famDrawProgress(6,6);
famFinish();
};
function famFinish(){
let note;
if(isResearcher()){
note='Moving to '+famAnswers.city+'. We will tailor your roadmap around your research permit and settling-in steps.';
}else if(famAnswers.living==='alone'){
note='Just you, moving to '+famAnswers.city+'. We will keep things simple and focused on your own permit and settling-in steps.';
}else if(famAnswers.family==='spouse'){
note='You and your spouse, moving to '+famAnswers.city+'. We will include spouse residence permit and settling-in steps.';
}else{
note='You, your spouse and '+(famAnswers.ages.length>1?'kids':'a child')+' aged '+famAnswers.ages.join(', ')+', moving to '+famAnswers.city+'. We will include family permits, plus school and daycare steps.';
}
famBox.innerHTML='<div style="text-align:center;padding:6px 0 4px;">'+
'<div style="width:44px;height:44px;border-radius:50%;background:#dff7f1;color:#087c6d;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;margin:0 auto 16px;">✓</div>'+
'<p style="font-size:18px;font-weight:500;margin:0 0 8px;">Got it, thanks '+firstNameOf(famAnswers)+'</p>'+
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