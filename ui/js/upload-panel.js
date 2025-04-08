export const uploadPanel = {
    //废弃-- Unique name for the extension
	name: "uploadPanel",
    async initHtml() {
        let html = 
        `
        
            <div class="zw-close-box"><button type="button" id="zw-btn-close" class="zw-btn zw-btn-close" title="关闭">×</button></div>
            <div class="zw-conent">
                <div class="zw-image-box" id="zw-image-box" >
                    <ul class="zw-image-ul">
                    </ul>
                </div>
                <div class="zw-param-box" style="display: none;" id="zw-param-box" >
                    <ul class="zw-param-ul">
                        <li>
                            <b>百度翻译KEY</b>
                            <input type="text" name="baidu_key" class="zw-text" placeholder="用于翻译提示词,请先保存参数再测试"> 
                            <button type="button" id="zw-baidu-key" class="zw-btn">测试</button>
                            <a href="" target="_blank">申请教程</a>
                        </li>
                        <li>
                            <b>图趣网KEY</b>
                            <input type="text" name="tuqu_key" class="zw-text" placeholder="用于云端保存"> 
                            <button type="button" id="zw-tuqu-key" class="zw-btn">测试</button>
                            <a href="" target="_blank">访问图趣网</a>
                        </li>
                    </ul>
                </div>
                <div class="zw-bars">
                    <div class="zw-bars-left">
                        <button type="button" id="zw-btn-all" class="zw-btn">全选</button>
                        <button type="button" id="zw-btn-all-none" class="zw-btn">全不选</button>
                    </div>
                    <div class="zw-bars-right">
                        <span id="zw-bars-msg"></span>
                        <button type="button" id="zw-btn-param-show" class="zw-btn">参数设置</button>
                        <button type="button" id="zw-btn-upload" class="zw-btn">开始上传</button>
                        <button type="button" id="zw-btn-param-save" class="zw-btn" style="display:none;">保存参数</button>
                        <button type="button" id="zw-btn-param-cancel" class="zw-btn" style="display:none;">取消/返回</button>
                    </div>
                </div>
            </div>
        
        `;
       
        var ele = document.createElement('div');
        ele.innerHTML = html;
        ele.className = "zw-upload-panel";
        document.body.appendChild(ele);
    },
    async initEvent() {
        $("#zw-btn-close").bind('click', () => {
            console.log("关闭上传面板");
            $(".zw-upload-panel").hide();
        });

        $("#zw-btn-param-show").bind('click', () => {
            $('.zw-image-box').hide();
            $('#zw-btn-param-show').hide();
            $('#zw-btn-upload').hide();
            $('#zw-btn-all').hide();
            $('#zw-btn-all-none').hide();

            $('.zw-param-box').css("display", 'flex');
            $('#zw-btn-param-save').css("display",'inline-block');
            $('#zw-btn-param-cancel').css("display",'inline-block');

            uploadPanel.getParams();
        });
        $("#zw-btn-param-cancel").bind('click', () => {
            $('.zw-image-box').css("display", 'flex');
            $('#zw-btn-param-show').css("display",'inline-block');
            $('#zw-btn-upload').css("display",'inline-block');
            $('#zw-btn-all').css("display",'inline-block');
            $('#zw-btn-all-none').css("display",'inline-block');

            $('.zw-param-box').hide();
            $('#zw-btn-param-save').hide();
            $('#zw-btn-param-cancel').hide();
        });
        $("#zw-btn-param-save").bind('click', () => {
            console.log("保存参数");
            uploadPanel.saveParams();
        });
        $("#zw-btn-upload").bind('click', () => {
            console.log("开始上传");
        });
        const buttonAll = $('zw-btn-all');
        $("#zw-btn-all").bind('click', () => {
            console.log("全选");
            $(".zw-image-ul li img").addClass("zw-on");
        });
        $("#zw-btn-all-none").bind('click', () => {
            console.log("全选");
            $(".zw-image-ul li img").removeClass("zw-on");
        });
        $("#zw-baidu-key").bind('click', () => {
            uploadPanel.testBaidu();
        });
    },
    async showPanel(images) {
        let html = "";
        $(".zw-upload-panel").show();

        if(images === null || images === undefined) return;

        for(let i = 0; i < images.length; i++){
            let src = location.href + "view?filename="+images[i].filename+"&subfolder="+images[i].subfolder+"&type="+images[i].type+"&rand="+Math.random();
            html += `
                <li>
                    <img src="${src}" alt="${images[i].filename}">
                </li>
            `;
        }

        $(".zw-image-ul").html(html);
        $(".zw-image-ul li img").bind('click', function() {
            $(this).toggleClass("zw-on");
        });
    },
    async getParams() {
        const res = await fetch('/zw_tools/get_params')
        const jsonData = await res.json()
        console.log(marked, jsonData)
        $(".zw-param-ul").find("input[name='baidu_key']").val(jsonData.baidu_key);
        $(".zw-param-ul").find("input[name='tuqu_key']").val(jsonData.tuqu_key);
    },
    async saveParams() {
        console.log("保存ssss参数");
        let baidu_key = $(".zw-param-ul").find("input[name='baidu_key']").val();
        let tuqu_key = $(".zw-param-ul").find("input[name='tuqu_key']").val();
        const res = await fetch('/zw_tools/save_params?baidu_key=' + baidu_key + '&tuqu_key=' + tuqu_key);
        const jsonData = await res.json()
        console.log(marked, jsonData)
        if(jsonData.code == 0) {
            $("#zw-bars-msg").show();
            $("#zw-bars-msg").html("保存成功");
            $("#zw-btn-param-cancel").click();
            $("#zw-bars-msg").fadeOut(3000);
        }
        return jsonData;
    },
    async testBaidu() {
        let baidu_key = $(".zw-param-ul").find("input[name='baidu_key']");
        const res = await fetch('/zw_tools/test_baidu?baidu_key='+baidu_key);
        const jsonData = await res.json()
        console.log(marked, jsonData)
        if(jsonData.code == 0) {
            alert("测试成功:"+jsonData.msg);
        } else {
            alert("测试失败:"+jsonData.msg);
        }
    },
    async saveFlowRecord(input_texts, out_images, flow) {
        let data = {
            input_texts: input_texts,
            out_images: out_images,
            flow: flow
        };
        let url = '/zw_tools/save_flow_record'
        const res = await fetch(url, 
            {
                method:'POST', 
                headers: {
                'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            }
        );
        const jsonData = await res.json()
        console.log(marked, jsonData)
    }
};