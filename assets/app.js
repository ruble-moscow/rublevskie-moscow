'use strict';
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let config={demoMode:true,available:false,contacts:{},analyticsId:null};
let analyticsChoice;try{analyticsChoice=localStorage.getItem('rm-analytics');}catch{}
const toast=message=>{const t=$('.toast');t.textContent=message;t.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('visible'),6500);};
function openDialog(id){const d=document.getElementById(id);if(d&&!d.open)d.showModal();}
$$('[data-dialog]').forEach(b=>b.addEventListener('click',()=>openDialog(b.dataset.dialog)));
$$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
const menu=$('.menu-toggle');const mobileNav=$('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');}
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Открыть меню':'Закрыть меню');mobileNav.hidden=expanded;});
mobileNav.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
async function track(){}
function loadAnalytics(){if(!config.analyticsId||analyticsChoice!=='yes'||$('#metrika-script'))return;const s=document.createElement('script');s.id='metrika-script';s.src='https://mc.yandex.ru/metrika/tag.js';s.async=true;window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments);};window.ym.l=Date.now();document.head.append(s);window.ym(Number(config.analyticsId),'init',{clickmap:false,trackLinks:false,accurateTrackBounce:true,webvisor:false});}
function setAnalytics(choice){analyticsChoice=choice;try{localStorage.setItem('rm-analytics',choice);}catch{}$('.cookie-panel').hidden=true;if(choice==='yes')loadAnalytics();else if(config.analyticsId&&typeof window.ym==='function'){window.ym(Number(config.analyticsId),'destruct');$('#metrika-script')?.remove();}}
$$('[data-analytics]').forEach(b=>b.addEventListener('click',()=>setAnalytics(b.dataset.analytics)));
$('#analytics-settings').addEventListener('click',()=>{if(config.analyticsId)$('.cookie-panel').hidden=false;else toast('Внешняя аналитика пока не подключена.');});
const configReady=Promise.resolve({"demoMode":true,"previewOnly":true,"contacts":{},"legal":{},"analyticsId":null}).then(c=>{
config={...c,available:true};
if(!c.demoMode)$('#demo-banner').hidden=true;
if(c.legal?.name){$('#legal-footer').textContent=`${c.legal.name} · ${c.legal.id}`;const p=document.createElement('p');p.textContent=`Оператор: ${c.legal.name}, ${c.legal.id}. Адрес: ${c.legal.address}. По вопросам данных и отзыва согласия: ${c.legal.email}. Срок хранения обращений: ${c.legal.retentionDays} дней, если иной срок не требуется для исполнения договора.`;$('#legal-content').replaceChildren(p);}
$$('[data-contact]').forEach(b=>{const value=c.contacts[b.dataset.contact];if(value){b.title=value;if(b.dataset.contact==='phone'&&b.closest('.header-inner')){const label=$('[data-phone-label]',b);if(label)label.textContent=value;else b.textContent=value;}}});
if(c.analyticsId&&!analyticsChoice)$('.cookie-panel').hidden=false;loadAnalytics();
}).catch(()=>{const banner=$('#demo-banner');banner.hidden=false;banner.textContent='Режим просмотра · сервер заявок недоступен · отправка и контакты требуют запуска проекта';});
$$('[data-contact]').forEach(b=>b.addEventListener('click',async()=>{await configReady;const channel=b.dataset.contact;const contact=config.contacts[channel];if(!contact){const message='Этот канал ещё не настроен. Вебмастер должен внести контакты мастерской.';toast(message);$('#contact-status').textContent=message;return;}track('contact_click',{channel});const url=channel==='phone'?`tel:${contact.replace(/[^+\d]/g,'')}`:channel==='email'?`mailto:${contact}`:channel==='telegram'?`https://t.me/${contact}`:`https://wa.me/${contact}`;if(channel==='phone'||channel==='email')location.href=url;else window.open(url,'_blank','noopener,noreferrer');}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});$$('[data-category]').forEach(x=>x.hidden=b.dataset.filter!=='all'&&x.dataset.category!==b.dataset.filter);track('portfolio_filter');}));
const cases=[['Остров с переходом рисунка','island.svg','Кухонный остров','Сопряжение плоскостей и раскладка рисунка'],['Санузел в крупном формате','bathroom.svg','Комплексная облицовка санузла','Ниши, примыкания и ревизионные люки'],['Архитектура каминного портала','fireplace.svg','Каминный портал','Геометрия и доступ к обслуживанию']];
$$('[data-case]').forEach(b=>b.addEventListener('click',()=>{const c=cases[Number(b.dataset.case)];$('#case-content').innerHTML=`<h2 id="case-title">${c[0]}</h2><p>Это шаблон, а не отчёт о выполненной работе. Факты, фотографии и результаты нужно заполнить по реальному объекту.</p><img src="assets/images/${c[1]}" alt="Демонстрационная схема"><dl class="case-fields"><div><dt>Задача</dt><dd>${c[2]}. Внести исходные требования клиента.</dd></div><div><dt>Материал</dt><dd>Указать производителя, коллекцию, формат и толщину.</dd></div><div><dt>Сложный узел</dt><dd>${c[3]}. Описать фактическое решение.</dd></div><div><dt>Порядок и срок</dt><dd>Указать срок после согласований отдельно от замера и закупки.</dd></div></dl><h3>Результат в деталях</h3><p>Добавить фото стыков, кромок, примыканий, процесса на объекте. Заполнить результат, не добавляя неподтверждённых цифр и отзывов.</p>`;openDialog('case-dialog');track('case_open');}));
$('.close-case').addEventListener('click',()=>$('#case-dialog').close());
function chooseService(service){$$('.lead-form').forEach(f=>{f.elements.service.value=service;if(f.elements.project){const known=[...f.elements.project.options].some(x=>x.value===service);f.elements.project.value=known?service:'other';}});}
$$('.service-cta').forEach(b=>b.addEventListener('click',()=>chooseService(b.closest('[data-service]').dataset.service)));
const anchorService=location.hash.slice(1);if(['islands','countertops','bathrooms','stairs','fireplaces'].includes(anchorService))chooseService(anchorService);
$$('.lead-form select[name=project]').forEach(s=>s.addEventListener('change',()=>s.form.elements.service.value=s.value));
function validateFiles(files){if(files.length>3)throw Error('Можно приложить до 3 изображений.');for(const f of files){if(!['image/jpeg','image/png','image/webp'].includes(f.type))throw Error('Подойдут JPEG, PNG или WebP.');if(!f.size||f.size>3*1024*1024)throw Error('Каждое изображение должно быть не больше 3 МБ.');}}
const readFile=f=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({name:f.name,type:f.type,data:String(reader.result).split(',')[1]});reader.onerror=()=>reject(Error('Не удалось прочитать изображение.'));reader.readAsDataURL(f);});
$$('.lead-form').forEach(form=>{let requestId;let busy=false;form.addEventListener('input',()=>{requestId=undefined;});form.elements.images?.addEventListener('change',()=>{try{const files=[...form.elements.images.files];validateFiles(files);$('.file-list',form).textContent=files.map(f=>f.name).join(' · ');}catch(e){form.elements.images.value='';$('.file-list',form).textContent=e.message;}});
form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const status=$('.form-status',form);const submit=$('[type=submit]',form);status.classList.remove('success');$$('[aria-invalid]',form).forEach(el=>el.removeAttribute('aria-invalid'));const fail=(message,field)=>{status.textContent=message;if(field){field.setAttribute('aria-invalid','true');field.focus();}};
const phone=form.elements.phone.value.trim();if(!/^(?:\+7|7|8)[\s()\-\d]+$/.test(phone)||phone.replace(/\D/g,'').length!==11)return fail('Введите российский телефон: +7 и ещё 10 цифр.',form.elements.phone);
if(!form.elements.consent.checked)return fail('Для ответа на обращение нужно согласие на обработку данных.',form.elements.consent);
if(form.elements.email?.value&&!form.elements.email.validity.valid)return fail('Проверьте адрес e-mail.',form.elements.email);
busy=true;submit.disabled=true;status.textContent='Проверяем форму…';try{
await configReady;if(!config.available)throw Error('Сервер заявок недоступен. Запустите проект по инструкции.');const files=[...(form.elements.images?.files||[])];validateFiles(files);status.classList.add('success');status.textContent='Поля заполнены верно. Это офлайн-просмотр: заявка и файлы никуда не отправлены.';
}catch(error){status.textContent=error.name==='TimeoutError'||error.name==='TypeError'?'Не удалось получить подтверждение. Повторите отправку: повтор той же заявки не создаст дубликат.':error.message;}finally{busy=false;submit.disabled=false;}
});});
