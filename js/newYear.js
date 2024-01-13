// 存数据
// name：命名 data：数据
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}

// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (t < (time * 60 * 1000) && t > -1) return d.data;
    }
    return 0;
}

// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用

// 读取背景
try {
    let data = loadData('blogbg', 1440)
    if (data) changeBg(data, 1)
    else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    if (s.charAt(0) == '#') {
        bg.style.backgroundColor = s
        bg.style.backgroundImage = 'none'
    } else bg.style.backgroundImage = s
    if (!flag) { saveData('blogbg', s) }
}
function setFont(n) {
    localStorage.setItem("font", n)
    if (n == "main") {
        document.body.style.fontFamily = "-apple-system, IBM Plex Mono ,monosapce,'微软雅黑', sans-serif"
    }
    else {
        document.body.style.fontFamily = "var(--global-font),-apple-system, IBM Plex Mono ,monosapce,'微软雅黑', sans-serif"
        document.documentElement.style.setProperty('--global-font', n)
    }
}

// 切换自定义颜色
var defineColor = localStorage.getItem("blogbg") && localStorage.getItem("blogbg").charAt(0) == '#' ? localStorage.getItem("blogbg") : '#F4D88A';
function changeBgColor() {
    changeBg(document.querySelector("#define_colors").value);
}

// 必应每日壁纸API
let bingDayBg = screen.width <= 768 ? "url(https://bing.img.run/m.php)" : "url(https://bing.img.run/1920x1080.php)";
// 必应历史壁纸API
let bingHistoryBg = screen.width <= 768 ? "url(https://bing.img.run/rand_m.php)" : "url(https://bing.img.run/rand.php)";
// EEE.DOG
let EEEDog = "url(https://api.yimian.xyz/img?type=moe&size=1920x1080)";
// 随机美图cdn.seovx.com
let seovx = "url(https://cdn.seovx.com/?mom=302)";
// picsum随机
let picsum = "url(https://picsum.photos/1920/1080.webp)";
// 小歪二次元
// let waiDongman = "url(https://api.ixiaowai.cn/api/api.php)";
//  小歪高清壁纸
let waiBizhi = "url(https://api.ixiaowai.cn/gqapi/gqapi.php)";
// 博天随机
let btstu = "url(http://api.btstu.cn/sjbz/?lx=suiji)";
// tuapi 动漫
// let tuapi = "url(https://tuapi.eees.cc/api.php?category=dongman)";
// unsplash随机 https://source.unsplash.com/random/1920x1080/daily (weekly)
let unsplash = "url(https://source.unsplash.com/random/1920x1080/)";




// 切换链接对应的背景(加入了链接检验与防抖)
function getPicture() {
    debounce(getPicture_, 300);
}

function getPicture_() {
    checkImgExists(document.getElementById("pic-link").value).then(() => {
        // 有效的图片链接
        var link = "url(" + document.getElementById("pic-link").value + ")";
        changeBg(link);
        // 提示切换成功
        new Vue({
            data: function () {
                this.$notify({
                    title: "可以啦🍨",
                    message: "切换自定义背景成功！",
                    position: 'top-left',
                    offset: 50,
                    showClose: true,
                    type: "success",
                    duration: 5000
                });
            }
        })
    }).catch(() => {
        // 无效的图片链接，提示无效
        new Vue({
            data: function () {
                this.$notify({
                    title: "链接不对🤣",
                    message: "请输入有效的图片链接！",
                    position: 'top-left',
                    offset: 50,
                    showClose: true,
                    type: "warning",
                    duration: 5000
                });
            }
        })
    })
}
// 判断图片链接是否可用
function checkImgExists(imgurl) {
    return new Promise(function (resolve, reject) {
        var ImgObj = new Image();
        ImgObj.src = imgurl;
        ImgObj.onload = function (res) {
            resolve(res);
        }
        ImgObj.onerror = function (err) {
            reject(err);
        }
    })
}

// 黑夜霓虹灯开关
if (localStorage.getItem("light") == undefined) {
    localStorage.setItem("light", "true");
}
// 这里要适配Pjax
document.addEventListener('pjax:complete', function () {
    changeLight(localStorage.getItem("light") == "true" ? true : false)
});
document.addEventListener('DOMContentLoaded', function () {
    changeLight(localStorage.getItem("light") == "true" ? true : false)
});
function setLight() {
    if (document.getElementById("lightSet").checked) {
        changeLight(true);
        localStorage.setItem("light", "true");
    } else {
        changeLight(false);
        localStorage.setItem("light", "false");
    }
}
// 更换霓虹灯状态
function changeLight(flag) {
    if (document.getElementById("site-name"))
        document.getElementById("site-name").style.animation = flag ? "light_15px 10s linear infinite" : "none";
    if (document.getElementById("site-title"))
        document.getElementById("site-title").style.animation = flag ? "light_15px 10s linear infinite" : "none";
    if (document.getElementById("site-subtitle"))
        document.getElementById("site-subtitle").style.animation = flag ? "light_10px 10s linear infinite" : "none";
    if (document.getElementById("post-info"))
        document.getElementById("post-info").style.animation = flag ? "light_5px 10s linear infinite" : "none";
    document.getElementById("menu_shadow").innerText = flag ? `:root{--menu-shadow: 0 0 1px var(--theme-color);}` : `:root{--menu-shadow: none;}`;
}



// 解决开启Pjax的问题
function whenDOMReady() {
    try {
        let data = loadData('blogbg', 1440)
        if (data) changeBg_noWindow(data, 0)
        else localStorage.removeItem('blogbg');
    } catch (error) { localStorage.removeItem('blogbg'); }
}
whenDOMReady()
document.addEventListener("pjax:success", whenDOMReady)

// 无弹窗提醒更换背景
// function changeBg_noWindow(s, flag) {
//   let bg = document.getElementById("web_bg");
//   if (s.charAt(0) == "#") {
//     bg.style.backgroundColor = s;
//     bg.style.backgroundImage = "none";
//   } else bg.style.backgroundImage = s;
//   if (!flag) {
//     saveData("blogbg", s);
//   }
// }

// 创建窗口
var winbox = "";

function createWinbox() {
    let div = document.createElement("div");
    document.body.appendChild(div);
    winbox = WinBox({
        id: "meihuaBox",
        index: 99,
        title: "美化设置",
        x: "left",
        y: "center",
        minwidth: "300px",
        height: "60%",
        // "#76c8f1"
        background: 'var(--theme-color)',
        onmaximize: () => {
            div.innerHTML = `<style>body::-webkit-scrollbar {display: none;} div#meihuaBox {width: 100% !important;}</style>`;
        },
        onrestore: () => {
            div.innerHTML = "";
        },
    });
    winResize();
    window.addEventListener("resize", winResize);

    // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\进行转义
    winbox.body.innerHTML = `
    <div class="settings" style="display: block;">
    <div id="article-container" style="padding:12px;">
    <br>
    <center><p><button onclick="reset()" style="background:linear-gradient(to right, #fc354c, #0abfbc);display:block;width:40%;padding:15px 0;border-radius:30px;color:white;font-size:1.1em;"><i class="fa-solid fa-arrows-rotate"></i>&nbsp;恢复默认设置</button></p></center>
    
    <h2>一、显示偏好</h2>
    
    <div class="transValue" style="font-weight:bold;padding-left:10px">透明度 (0%-100%): ${curTransNum}%</div>
    <div class="range">
    <input id="transSet" type="range" min="0" max="100" step="1" value=${curTransNum} oninput="setTrans()">
    <p class="rang_width" id="rang_trans" style="width:${curTransMini}%"></p>
    </div>
    
    <div class="blurValue" style="font-weight:bold;padding-left:10px">模糊半径 (开启模糊生效 0px-100px): ${curBlur} px</div>
    <div class="range">
    <input id="blurSet" type="range" min="0" max="100" step="1" value="${curBlur}" oninput="setBlurNum()">
    <p class="rang_width" id="rang_blur" style="width:${miniBlur}%"></p>
    </div>

    <div class="content" style="display:flex">
    <div class="content-text" style="font-weight:bold; padding-left:10px"> 星空特效 (夜间模式) </div><input type="checkbox" id="universeSet" onclick="setUniverse()">
    <div class="content-text" style="font-weight:bold; padding-left:20px"> 霓虹灯 (夜间模式) </div><input type="checkbox" id="lightSet" onclick="setLight()">
    </div>
  
    <div class="content" style="display:flex">
    <div class="content-text" style="font-weight:bold; padding-left:10px"> 模糊效果 (消耗性能) </div><input type="checkbox" id="blur" onclick="setBlur()">
    <div class="content-text" style="font-weight:bold; padding-left:20px"> 侧边栏 (默认开) </div><input type="checkbox" id="rightSideSet" onclick="toggleRightside()">
    </div>
  
    <div class="content" style="display:flex">
    <div class="content-text" style="font-weight:bold; padding-left:10px"> 帧率监测 (刷新生效) </div><input type="checkbox" id="fpson" onclick="fpssw()">
    <div class="content-text" style="font-weight:bold; padding-left:10px"> 雪花特效 (白天模式) </div><input type="checkbox" id="snowSet" onclick="setSnow()">
    </div>
  
  
    <h2>二、字体设置</h2>
    <div class="note warning modern"><p>非商免字体未经授权只能个人使用。本站为完全非商业、非盈利性质的网站，平时用于个人学习交流，如有侵权请联系站长删除，谢谢！ —— 致版权方</p>
</div>
    <p id="swfs">
    <a class="swf" id="swf_ZhuZiAWan" href="javascript:;" rel="noopener external nofollow" style="font-family:'ZhuZiAWan'!important;color:black" onclick="setFont('ZhuZiAWan')">筑紫A丸标准体2.0</a>
    <a class="swf" id="swf_HYTMR" href="javascript:;" rel="noopener external nofollow" style="font-family:'HYTMR'!important;color:black" onclick="setFont('HYTMR')">汉仪唐美人</a>
    <a class="swf" id="swf_TTQHB" href="javascript:;" rel="noopener external nofollow" style="font-family:'TTQHB'!important;color:black" onclick="setFont('TTQHB')">甜甜圈海报</a>
    <a class="swf" id="swf_YSHST" href="javascript:;" rel="noopener external nofollow" style="font-family:'YSHST'!important;color:black" onclick="setFont('YSHST')">优设好身体</a>
    <a class="swf" id="swf_default" href="javascript:;" rel="noopener external nofollow" style="font-family:-apple-system, IBM Plex Mono ,monosapce,'微软雅黑', sans-serif;!important;color:black" onclick="setFont('default')">系统默认</a>
    </p>
  
    <h2>三、主题色设置</h2>
    <div class="content" style="display:flex"><input type="radio" id="red" name="colors" value=" "
    onclick="setColor('red')"><input type="radio" id="orange" name="colors" value=" "
    onclick="setColor('orange')"><input type="radio" id="yellow" name="colors" value=" "
    onclick="setColor('yellow')"><input type="radio" id="green" name="colors" value=" "
    onclick="setColor('green')"><input type="radio" id="blue" name="colors" value=" "
    onclick="setColor('blue')"><input type="radio" id="heoblue" name="colors" value=" "
    onclick="setColor('heoblue')"><input type="radio" id="darkblue" name="colors" value=" "
    onclick="setColor('darkblue')"><input type="radio" id="purple" name="colors" value=" "
    onclick="setColor('purple')"><input type="radio" id="pink" name="colors" value=" "
    onclick="setColor('pink')" checked="checked"><input type="radio" id="black" name="colors" value=" "
    onclick="setColor('black')"><input type="radio" id="blackgray" name="colors" value=" "
    onclick="setColor('blackgray')"></div>
  
    <h2>四、背景设置</h2>
    <center><button onclick="resetBg()" style="background:var(--theme-color);display:block;width:35%;padding:15px 0;border-radius:30px;color:white;"><i class="fa-solid fa-arrows-rotate"></i>&nbsp;恢复默认背景</button></center>
  
    <h3>1. 二次元</h3>
    <details class="folding-tag" cyan><summary> 查看二次元背景 </summary>
              <div class='content'>
              <div class="bgbox"><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104151936_008.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104151936_008.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104151936_006.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104151936_006.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104152003_006.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104152003_006.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104152003_007.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231104152003_007.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_004.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_004.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_005.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_005.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_006.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_006.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_007.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_007.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150300_002.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150300_002.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_002.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_002.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_003.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_003.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url()" class="imgbox" onclick="changeBg('url()')"></a></div>
              </div>
            </details>
  
    <h3>2. 风景</h3>
  
    <details class="folding-tag" cyan><summary> 查看风景背景 </summary>
              <div class='content'>
              <div class="bgbox"><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_005.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_005.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_001.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_001.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_002.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_002.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_003.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150634_003.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_001.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_001.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_004.jpg)" class="imgbox" onclick="changeBg('url(https://wenroumao.oss-cn-beijing.aliyuncs.com/img/DM_20231215150505_004.jpg)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url()" class="imgbox" onclick="changeBg('url()')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url()" class="imgbox" onclick="changeBg('url()')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url()" class="imgbox" onclick="changeBg('url()')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url()" class="imgbox" onclick="changeBg('url()')"></a></div>
              </div>
            </details>
  
    <h3>3. 萌宠</h3>
  
    <details class="folding-tag" cyan><summary> 查看萌宠背景 </summary>
              <div class='content'>
              <div class="bgbox"><a href="javascript:;" rel="noopener external nofollow" style="background-image:url()" class="imgbox" onclick="changeBg('url()')"></a></div>
              </div>
            </details>
  
    <h3>4. 渐变色</h3>
    <details class="folding-tag" cyan><summary> 查看渐变色背景 </summary>
              <div class='content'>
              <div class="bgbox"><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #544a7d, #ffd452)" onclick="changeBg('linear-gradient(to right, #544a7d, #ffd452)')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to bottom, #7f7fd5, #86a8e7, #91eae4)" onclick="changeBg('linear-gradient(to bottom, #7f7fd5, #86a8e7, #91eae4)')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to left, #654ea3, #eaafc8)" onclick="changeBg('linear-gradient(to left, #654ea3, #eaafc8)')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to top, #d3959b, #bfe6ba)" onclick="changeBg('linear-gradient(to top, #d3959b, #bfe6ba)')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to top, #8360c3, #2ebf91)" onclick="changeBg('linear-gradient(to top, #8360c3, #2ebf91)')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to top, #108dc7, #ef8e38)" onclick="changeBg('linear-gradient(to top, #108dc7, #ef8e38)')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to top, #355c7d, #6c5b7b, #c06c84)" onclick="changeBg('linear-gradient(to top, #355c7d, #6c5b7b, #c06c84)')"></a></div>
              </div>
            </details>
  
  
  <h3>5. 纯色</h3>
  <details class="folding-tag" cyan><summary> 查看纯色背景 </summary>
              <div class='content'>
              <div class="bgbox"><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #ecb1b1" onclick="changeBg('#ecb1b1')"></a> <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #d3ebac" onclick="changeBg('#d3ebac')"></a> <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #ace9ce" onclick="changeBg('#ace9ce')"></a><a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #c1ebea" onclick="changeBg('#c1ebea')"></a> <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #dee7f1" onclick="changeBg('#dee7f1')"></a> <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #e9e3f2" onclick="changeBg('#e9e3f2')"></a> <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #f7eff5" onclick="changeBg('#f7eff5')"></a>  <input type="color" id="define_colors" href="javascript:;" rel="noopener external nofollow" class="box" autocomplete="on" value="${defineColor}" oninput="changeBgColor()"></input></div>
              </div>
            </details>
  
  
  
  <h3>6. 适配手机</h3>
  <details class="folding-tag" cyan><summary> 查看适配手机的背景 </summary>
              <div class='content'>
              <div class="bgbox"><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://lskypro.acozycotage.net/Fomalhaut/img/mb4.webp)" class="pimgbox" onclick="changeBg('url(https://lskypro.acozycotage.net/Fomalhaut/img/mb4.webp)')"></a><a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2022/08/30/630d6d4d539a5.webp)" class="pimgbox" onclick="changeBg('url(https://bu.dusays.com/2022/08/30/630d6d4d539a5.webp)')"></a>    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2022/08/30/630d6d4e15c9d.webp)" class="pimgbox" onclick="changeBg('url(https://bu.dusays.com/2022/08/30/630d6d4e15c9d.webp)')"></a>    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2022/08/30/630d6f22c03c6.webp)" class="pimgbox" onclick="changeBg('url(https://bu.dusays.com/2022/08/30/630d6f22c03c6.webp)')"></a>    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2022/08/30/630d6d56c83eb.webp)" class="pimgbox" onclick="changeBg('url(https://bu.dusays.com/2022/08/30/630d6d56c83eb.webp)')"></a>       <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://bu.dusays.com/2022/08/30/630d6d50b439b.webp)" class="pimgbox" onclick="changeBg('url(https://bu.dusays.com/2022/08/30/630d6d50b439b.webp)')"></a>   </div>
              </div>
            </details>
  
  
  <h3>7. 壁纸API</h3>
  <details class="folding-tag" cyan><summary> 查看壁纸API系列背景 </summary>
              <div class='content'>
              <div class="bgbox"><a id="bingDayBox" rel="noopener external nofollow" style="background-image: ${bingDayBg}" class="box apiBox" onclick="changeBg('${bingDayBg}')"></a><a id="bingHistoryBox" rel="noopener external nofollow" style="background-image: ${bingHistoryBg}" class="box apiBox" onclick="changeBg('${bingHistoryBg}')"></a><a id="EEEDogBox" rel="noopener external nofollow" style="background-image: ${EEEDog}" class="box apiBox" onclick="changeBg('${EEEDog}')"></a><a id="seovxBox" rel="noopener external nofollow" style="background-image: ${seovx}" class="box apiBox" onclick="changeBg('${seovx}')"></a><a id="picsumBox" rel="noopener external nofollow" style="background-image: ${picsum}" class="box apiBox" onclick="changeBg('${picsum}')"></a><a id="waiBizhiBox" rel="noopener external nofollow" style="background-image: ${waiBizhi}" class="box apiBox" onclick="changeBg('${waiBizhi}')"></a><a id="btstuBox" rel="noopener external nofollow" style="background-image: ${btstu}" class="box apiBox" onclick="changeBg('${btstu}')"></a><a id="unsplashBox" rel="noopener external nofollow" style="background-image: ${unsplash}" class="box apiBox" onclick="changeBg('${unsplash}')"></a></div>
              </div>
            </details>
  
  
  <h3>8. 自定义背景</h3>
  <details class="folding-tag" cyan><summary> 设置自定义背景 </summary>
              <div class='content'>
              <p><center><input type="text" id="pic-link" size="70%" maxlength="1000" placeholder="请输入有效的图片链接"></center></p><p><center><button type="button" onclick="getPicture()" style="background:var(--theme-color);width:35%;padding: 5px 0px 7px 0px;border-radius:30px;color:white;line-height:2;">🌈切换背景🌈</button></center></p>
              </div>
            </details>
  
  <br>
  <center><div style="font-size:1.2em;color:var(--theme-color);font-weight:bold;">------ ( •̀ ω •́ )y 到底啦 ------</div></center>
  <br>
  
  </div>
  
  </div>
  
  `;

    // 打开小窗时候初始化
    $("#" + localStorage.getItem("themeColor")).attr("checked", true);
    if (localStorage.getItem("blur") == 1) {
        document.getElementById("blur").checked = true;
    } else {
        document.getElementById("blur").checked = false;
    }
    if (localStorage.getItem("universe") == "block") {
        document.getElementById("universeSet").checked = true;
    } else if (localStorage.getItem("universe") == "none") {
        document.getElementById("universeSet").checked = false;
    }
    if (localStorage.getItem("fpson") == "1") {
        document.getElementById("fpson").checked = true;
    } else {
        document.getElementById("fpson").checked = false;
    }
    if (localStorage.getItem("rs") == "block") {
        document.getElementById("rightSideSet").checked = true;
    } else if (localStorage.getItem("rs") == "none") {
        document.getElementById("rightSideSet").checked = false;
    }
    if (localStorage.getItem("light") == "true") {
        document.getElementById("lightSet").checked = true;
    } else {
        document.getElementById("lightSet").checked = false;
    }
    setFontBorder();
    if (localStorage.getItem("snow") == "block") {
        document.getElementById("snowSet").checked = true;
    } else if (localStorage.getItem("snow") == "none") {
        document.getElementById("snowSet").checked = false;
    }
}

// 恢复默认背景
function resetBg() {
    localStorage.removeItem('blogbg');
    reload();
}

// 恢复默认设置并刷新页面
function reset() {
    clearItem();
    reload();
}

// 适应窗口大小
function winResize() {
    try {
        var offsetWid = document.documentElement.clientWidth;
        if (offsetWid <= 768) {
            winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
        } else {
            winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
        }
    } catch (err) {
        // console.log("Pjax毒瘤抽风运行winResize方法🙄🙄🙄");
    }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
    if (document.querySelector("#meihuaBox")) {
        winbox.toggleClass("hide");
    } else {
        createWinbox();
    };
}

/* 美化模块 end */