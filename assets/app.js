/* 铁血远征 · 公共交互（纯前端 parody 演示，不上传任何数据） */
(function(){
  var TB = window.TB || {};

  /* ---- 抽屉 ---- */
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), mask=document.getElementById('drawerMask');
  function openDrawer(){if(drawer)drawer.classList.add('on');if(mask)mask.classList.add('on')}
  function closeDrawer(){if(drawer)drawer.classList.remove('on');if(mask)mask.classList.remove('on')}
  if(burger)burger.addEventListener('click',openDrawer);
  if(mask)mask.addEventListener('click',closeDrawer);
  var dc=document.getElementById('drawerClose');if(dc)dc.addEventListener('click',closeDrawer);

  /* ---- toast ---- */
  window.tbToast=function(msg){
    var t=document.getElementById('toast');
    if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
    t.textContent=msg;t.classList.add('on');
    clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('on')},2600);
  };

  /* ---- 岗位渲染 / 筛选 ---- */
  window.renderJobs=function(cat){
    var box=document.getElementById('jobGrid');if(!box||!TB.JOBS)return;
    cat=cat||'全部机会';
    var list=cat==='全部机会'?TB.JOBS:TB.JOBS.filter(function(j){return j.cat===cat});
    box.innerHTML=list.map(function(j){
      return '<article class="job">'+
        '<div class="top"><span class="corner">'+j.tag+'</span>'+j.icon+'</div>'+
        '<div class="body"><h4>'+j.name+'</h4>'+
        '<div class="desc">'+j.desc+'</div>'+
        '<div class="pay"><b>'+j.pay+'</b><span>'+j.unit+'</span></div>'+
        '<div class="meta">'+j.meta+'</div>'+
        '<div class="foot"><a href="enlist.html?job='+j.id+'" class="btn btn-danger btn-sm">我要报名</a></div>'+
        '</div></article>';
    }).join('');
  };
  window.initFilters=function(){
    var box=document.getElementById('filters');if(!box||!TB.CATS)return;
    box.innerHTML=TB.CATS.map(function(c,i){
      return '<button data-cat="'+c+'" class="'+(i===0?'on':'')+'">'+c+'</button>';
    }).join('');
    box.addEventListener('click',function(e){
      if(e.target.tagName!=='BUTTON')return;
      var bs=box.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].classList.remove('on');
      e.target.classList.add('on');renderJobs(e.target.getAttribute('data-cat'));
    });
    renderJobs('全部机会');
  };

  /* ---- 待遇对比表 ---- */
  window.renderTiers=function(){
    var body=document.getElementById('tierBody');if(!body||!TB.TIERS)return;
    body.innerHTML=TB.TIERS.map(function(t){
      return '<tr><td><b>'+t.tier+'</b></td><td class="hot">'+t.pay+'</td><td>'+t.sign+'</td><td>'+t.ins+'</td><td>'+t.leave+'</td><td>'+t.bonus+'</td><td>'+t.note+'</td></tr>';
    }).join('');
  };

  /* ---- FAQ ---- */
  window.renderFaq=function(){
    var box=document.getElementById('faqBox');if(!box||!TB.FAQ)return;
    box.innerHTML=TB.FAQ.map(function(f){
      return '<details class="faq"><summary>'+f.q+'</summary><div class="ans">'+f.a+'</div></details>';
    }).join('');
  };

  /* ---- 报名表单（纯演示） ---- */
  window.initEnlist=function(){
    var form=document.getElementById('enlistForm');if(!form)return;
    // 从 URL 带 job 参数预选
    var params=new URLSearchParams(location.search), job=params.get('job');
    var sel=document.getElementById('fJob');
    if(sel&&job){for(var i=0;i<sel.options.length;i++){if(sel.options[i].value===job){sel.selectedIndex=i;break}}}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      var req=form.querySelectorAll('[data-required]');
      for(var i=0;i<req.length;i++){
        var el=req[i], err=el.parentNode.querySelector('.err');
        var bad=!el.value.trim();
        if(el.type==='checkbox')bad=!el.checked;
        if(err)err.classList.toggle('on',bad);
        if(bad)ok=false;
      }
      if(!ok){tbToast('还有必填项没填哦');return}
      // 演示：不上传任何数据，生成虚构编号
      var no='ZB-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Math.floor(Math.random()*900000+100000);
      sessionStorage.setItem('tb_demo_no',no);
      try{sessionStorage.setItem('tb_demo_name',form.querySelector('[name=name]').value)}catch(e){}
      location.href='success.html';
    });
  };
  window.showDemoNo=function(){
    var el=document.getElementById('demoNo');if(!el)return;
    el.textContent=sessionStorage.getItem('tb_demo_no')||'ZB-DEMO-000000';
  };

  /* ---- AI 招募顾问（本地规则演示） ---- */
  window.initAgent=function(){
    var log=document.getElementById('chatLog');if(!log)return;
    var input=document.getElementById('msgInput'), sendBtn=document.getElementById('sendBtn');
    function addMsg(text,who,html){
      var d=document.createElement('div');d.className='msg'+(who==='me'?' me':'');
      var av=document.createElement('div');av.className='av';av.textContent=who==='me'?'我':'征';
      var bub=document.createElement('div');bub.className='bub';
      if(html)bub.innerHTML=text;else bub.textContent=text;
      d.appendChild(av);d.appendChild(bub);log.appendChild(d);log.scrollTop=log.scrollHeight;return bub;
    }
    function typing(){
      var d=document.createElement('div');d.className='msg';
      d.innerHTML='<div class="av">征</div><div class="bub"><span class="typing"><i></i><i></i><i></i></span></div>';
      log.appendChild(d);log.scrollTop=log.scrollHeight;return d;
    }
    function reply(text,html){var t=typing();setTimeout(function(){t.remove();addMsg(text,'ai',html)},520+Math.random()*380)}
    setTimeout(function(){addMsg('您好！我是铁血远征的招募顾问「老征」。想了解待遇、战场机会还是报名流程？随便问——反正都是演示，说说无妨。','ai')},280);
    function respond(q){
      if(/待遇|工资|薪资|月薪|多少钱|钱|收入|签字费/.test(q)){
        reply('待遇这块我们主打一个「数字大得离谱」：月薪 1.8–6 万，签约就发 3–30 万安家费，六险一金 + 顶格意外险，吃住装备全包。具体可以看「待遇详解」页的对比表——当然，全是虚构演示，别太当真。');return;
      }
      if(/战场|岗位|机会|前线|作战|危险|打仗|去哪/.test(q)){
        reply('机会多得很：前线突击、精确支援、空中机动、战地医疗、通信情报、后勤保障……前台岗位卡上写着「月薪 + 风险补贴」。危险指数我们也老实标了，但记住——每一场「战斗」都只存在于你的浏览器里。');return;
      }
      if(/报名|流程|怎么加入|怎么弄|步骤|签约/.test(q)){
        reply('流程五步走：提交意向 → 初步沟通 → 确认档位 → 签署合同 → 整装出发。报名表是纯前端演示，不上传你的任何信息，随便填，提交后给个虚构编号乐一乐。');return;
      }
      if(/真实|真的吗|假的|骗|靠谱吗|合法/.test(q)){
        reply('坦白讲：本站 100% 虚构 parody，纯属恶搞演示，不是真的招募、不构成任何招聘或法律行为。所有高薪和「上战场机会」都是编剧写的段子。放心，没有陷阱，只有快乐。');return;
      }
      if(/危险|死|命|风险/.test(q)){
        reply('文案里我们诚实写了「有生命危险」——因为上战场本就是高危行为。但这是虚构演示，你的「战场」就是这块屏幕，最大的风险大概是刷太久忘了时间。');return;
      }
      reply('这个我暂时没编好台词～你可以问我待遇、战场机会、报名流程，或者直接问「这是真的吗」。记住：本站纯属虚构演示，仅供娱乐。');
    }
    function send(){var v=input.value.trim();if(!v)return;addMsg(v,'me');input.value='';respond(v)}
    if(sendBtn)sendBtn.addEventListener('click',send);
    if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter')send()});
  };

  /* ---- 页面初始化 ---- */
  window.TB_READY = function(){
    renderJobs();
    initFilters();
    renderTiers();
    renderFaq();
    initEnlist();
    initAgent();
    if(typeof showDemoNo==='function') showDemoNo();
  };
})();
