/* 铁血远征 IRON EXPEDITION · 公共交互 */
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
    cat=cat||'全部岗位';
    var list=cat==='全部岗位'?TB.JOBS:TB.JOBS.filter(function(j){return j.cat===cat});
    box.innerHTML=list.map(function(j){
      return '<article class="job">'+
        '<div class="top"><img src="assets/images/'+j.img+'" alt="'+j.name+'" loading="lazy"><span class="corner">'+j.tag+'</span><span class="code">'+j.code+'</span></div>'+
        '<div class="body"><h4>'+j.name+'</h4>'+
        '<div class="desc">'+j.desc+'</div>'+
        '<div class="req"><b>任职要求：</b>'+j.req+'</div>'+
        '<div class="pay"><b>'+j.pay+'</b><span>'+j.unit+'</span></div>'+
        '<div class="meta">'+j.meta+'</div>'+
        '<div class="foot"><a href="enlist.html?job='+j.id+'" class="btn btn-danger btn-sm">申请该岗位</a></div>'+
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
    renderJobs('全部岗位');
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

  /* ---- 报名表单 ---- */
  window.initEnlist=function(){
    var form=document.getElementById('enlistForm');if(!form)return;
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
      if(!ok){tbToast('还有必填项未完成，请检查后提交');return}
      var no='ZB-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Math.floor(Math.random()*900000+100000);
      sessionStorage.setItem('tb_apply_no',no);
      try{sessionStorage.setItem('tb_apply_name',form.querySelector('[name=name]').value)}catch(e){}
      location.href='success.html';
    });
  };
  window.showApplyNo=function(){
    var el=document.getElementById('applyNo');if(!el)return;
    el.textContent=sessionStorage.getItem('tb_apply_no')||'ZB-20260101-000000';
    var n=document.getElementById('applyName');
    if(n){var nm=sessionStorage.getItem('tb_apply_name');if(nm)n.textContent=nm}
  };

  /* ---- AI 招募顾问（本地规则应答） ---- */
  window.initAgent=function(){
    var log=document.getElementById('chatLog');if(!log)return;
    var input=document.getElementById('msgInput'), sendBtn=document.getElementById('sendBtn');
    function addMsg(text,who){
      var d=document.createElement('div');d.className='msg'+(who==='me'?' me':'');
      var av=document.createElement('div');av.className='av';av.textContent=who==='me'?'我':'征';
      var bub=document.createElement('div');bub.className='bub';bub.innerHTML=text;
      d.appendChild(av);d.appendChild(bub);log.appendChild(d);log.scrollTop=log.scrollHeight;return bub;
    }
    function typing(){
      var d=document.createElement('div');d.className='msg';
      d.innerHTML='<div class="av">征</div><div class="bub"><span class="typing"><i></i><i></i><i></i></span></div>';
      log.appendChild(d);log.scrollTop=log.scrollHeight;return d;
    }
    function reply(text){var t=typing();setTimeout(function(){t.remove();addMsg(text,'ai')},520+Math.random()*380)}
    setTimeout(function(){addMsg('您好，我是铁血远征的招募顾问。您可以咨询<b>岗位要求</b>、<b>薪资待遇</b>、<b>派遣流程</b>或<b>保险保障</b>，请问想了解哪方面？','ai')},280);
    function respond(q){
      if(/待遇|工资|薪资|月薪|多少钱|钱|收入|签字费|签约金/.test(q)){
        reply('薪酬由基础月薪、海外津贴与任务奖金三部分构成。按岗位与职级，综合月薪大致在 <b>2.2 万至 6 万</b> 区间，签约另有安家补贴。六险一金与高额意外险由公司承担。具体可查看「待遇详解」页的职级对比表。');return;
      }
      if(/岗位|职位|前线|战场|去哪|做什么|危险|风险/.test(q)){
        reply('目前开放三类岗位：<b>行动岗位</b>（前线安保、精确支援、空中机动）、<b>技术支持</b>（战地医疗、通信情报、工作犬训导）与<b>后勤保障</b>（后勤主管、营地运营、装备维护）。每类岗位的职责与任职要求都写在「战场机会」页。');return;
      }
      if(/报名|流程|怎么加入|怎么弄|步骤|签约|条件|要求/.test(q)){
        reply('招募流程五步：<b>提交申请 → 初步沟通 → 资格评估 → 签署合同 → 出发赴任</b>。基本要求为年满 21 周岁、身体健康、无犯罪记录，具体条件视岗位而定。您可以到「立即报名」页填写意向。');return;
      }
      if(/保险|保障|医疗|意外|家属/.test(q)){
        reply('保障方面：全员六险一金，另配高额意外伤害险与商业医疗险；资深及以上职级覆盖家属医疗。任务期间有医疗后送机制与应急预案，确保伤病得到及时救治。');return;
      }
      if(/培训|训练/.test(q)){
        reply('上岗前会完成系统的岗前培训，包括安全规程、急救技能、装备使用与任务区域情况熟悉。技术岗位另有专项训练与资格复核，确保每位队员能够胜任岗位。');return;
      }
      if(/真实|真的吗|假的|骗|靠谱|合法|公司/.test(q)){
        reply('铁血远征是一家提供海外安全服务的机构，本网站是其人员招募信息展示页。您可以重点看三处：<b>岗位说明书</b>、<b>待遇职级表</b>与<b>常见问题</b>，信息都写得比较具体。若有进一步意向，按流程提交申请即可。');return;
      }
      reply('这个问题我暂时没有准备到。您可以问我<b>薪资待遇</b>、<b>岗位分类</b>、<b>报名流程</b>、<b>保险保障</b>或<b>培训安排</b>，我来为您说明。');
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
    if(typeof showApplyNo==='function') showApplyNo();
  };
})();
