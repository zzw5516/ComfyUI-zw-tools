import { app } from "../../../../scripts/app.js";
import { zwTags } from "./tags.js";

export const nodePrompt = {
    // Unique name for the extension
	name: "nodePrompt",
    scrollY: 0,
    textarea: null,
    pageIndex:0,
    cachePromptText:[],
    cachePromptIndex:0,
    aiBtnTimerCnt:8,
    async initHtml() {
        let html = `
                <div class="zw-close-box"><span>zw-tools提示词助手</span><button type="button" class="zw-btn zw-btn-close" title="关闭">×</button></div>
                <div class="zw-conent">
                    <div class="zw-input-box">
                        <textarea class="zw-textarea" id="zw-textarea-0" placeholder="建议格式：画质+主题+艺术风格+动作或场景+艺术家(特点风格强化)+细节描述">
                        </textarea>
                        <span class="zw-input-span">
                            <button type="button" class="zw-btn zw-btn-block" title="AI提示词扩展描述细化：建议应用Flux等级别的模型时使用" id="zw-btn-ai-detail">AI细化</button> 
                            <button type="button" class="zw-btn zw-btn-block zw-btn-half" id="zw-btn-ai-detail-pre">细化前</button>
                            <button type="button" class="zw-btn zw-btn-block zw-btn-half" id="zw-btn-ai-detail-after" style="margin-left:-1px;">细化后</button>
                            <button type="button" class="zw-btn zw-btn-block zw-btn-half" id="zw-btn-clear"> 清  除 </button>
                            <button type="button" class="zw-btn zw-btn-block zw-btn-half" id="zw-btn-fanyi" style="margin-left:-1px;">翻译</button>    
                        </span>
                        <button type="button" class="zw-btn zw-btn-prompt" id="zw-btn-prompt">确认使用</button>   
                    </div>
                    <div class="zw-text-box">
                        <div class="zw-text-box-left">
                            <div class="zw-text-area" id="zw-text-area">
                                <ul class="zw-text-ul">
                                </ul>
                            </div>
                        </div>
                        <div class="zw-text-box-right">
                            <div class="zw-tab-box">
                                <div class="zw-tab-cond-bar">
                                    <label><input type="checkbox" name="is_fav" class="is_fav">只显示已收藏</label>
                                    <label><input type="radio" name="enabled_type" class="enabled_cn" checked value="0">使用中文词</label>
                                    <label><input type="radio" name="enabled_type" class="enabled_en" value="1">使用英文词</label>
                                </div>
                                <div class="zw-tab-header">
                                    <a href="javascript:;" class="zw-tab-header-item zw-tab-header-item-on" id="zw-tab-h-prompt-0">提示词助手</a>
                                    <a href="javascript:;" class="zw-tab-header-item" id="zw-tab-h-his">历史记录</a>
                                    <a href="javascript:;" class="zw-tab-header-item" id="zw-tab-h-prompt-edit">提示词管理</a>
                                </div>
                                <div class="zw-tab-body" style="display: block;">
                                    <ul class="zw-tab-ul zw-tab-ul-cate0"></ul>
                                    <ul class="zw-tab-ul-nav-sub zw-tab-ul-cate1"></ul>
                                    <ul class="zw-tab-body-item zw-tab-ul-cate2"></ul>
                                </div>
                                
                                <div class="zw-tab-body">
                                    <div class="zw-his-srch">
                                        <span class="zw-his-srch-left">
                                        </span>
                                        <span class="zw-his-srch-right">
                                            <label><input type="checkbox" class="zw-chkbox zw-chkbox-fav" value="true"/>已收藏</label>
                                            <select class="zw-select zw-select-ib-cate-key">
                                                <option value="">全部分类</option>
                                                <option value='女士'>女士</option>
                                                <option value='日本动画片'>日本动画片</option>
                                                <option value='户外'>户外</option>
                                                <option value='漫画'>漫画</option>
                                                <option value='摄影'>摄影</option>
                                                <option value='戏服'>戏服</option>
                                                <option value='男人'>男人</option>
                                                <option value='动画'>动画</option>
                                                <option value='盔甲'>盔甲</option>
                                                <option value='运输'>运输</option>
                                                <option value='建筑学'>建筑学</option>
                                                <option value='城市'>城市</option>
                                                <option value='卡通'>卡通</option>
                                                <option value='车'>车</option>
                                                <option value='食物'>食物</option>
                                                <option value='天文学'>天文学</option>
                                                <option value='现代艺术'>现代艺术</option>
                                                <option value='猫'>猫</option>
                                                <option value='机器人'>机器人</option>
                                                <option value='景观'>景观</option>
                                                <option value='狗'>狗</option>
                                                <option value='龙'>龙</option>
                                                <option value='幻想'>幻想</option>
                                                <option value='跑车'>跑车</option>
                                                <option value='后世界末日'>后世界末日</option>
                                                <option value='真实感'>真实感</option>
                                                <option value='恐怖'>恐怖</option>
                                                <option value='名人'>名人</option>
                                                <option value='游戏角色'>游戏角色</option>
                                                <option value='科幻'>科幻</option>
                                                <option value='其他'>其他</option>
                                            </select>
                                            <input type="date" class="zw-date zw-date-ib-add-day" placeholder="请选择日期" />
                                            <input type="text" class="zw-text" placeholder="请输入关键字"/><button type="button" class="zw-btn zw-btn-search">点击搜索</button> 
                                        </span>
                                    </div>
                                    <div class="zw-history-box">
                                        <dl class="zw-history-list">
                                        </dl>
                                    </div>
                                    <div class="zw-history-page-bar">
                                        <div class="zw-history-page-bar-info">
                                            <span class="zw-history-page-bar-total-count"></span>
                                            <span class="zw-history-page-bar-page-size">
                                                , 每页
                                                <select class="zw-select zw-select-page-size" name="zw-select-page-size-prompt">
                                                    <option value="10">10</option>
                                                    <option value="20" selected>20</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                    <option value="200">200</option>
                                                    <option value="500">500</option>
                                                    <option value="1000">1000</option>
                                                </select>
                                                条
                                            </span>
                                            <span class="zw-history-page-bar-page-index"></span>
                                        </div>
                                        <a href="javascript:void(0);" class="zw-history-page-bar-prev zw-btn">上一页</a>
                                        <a href="javascript:void(0);" class="zw-history-page-bar-next zw-btn">下一页</a>
                                    </div>
                                </div>
                                <div class="zw-tab-body">
                                </div>
                            </div>    
                        </div>
                    </div>

                    
                </div>
        `;
        var ele = document.createElement('div');
        ele.innerHTML = html;
        ele.className = "zw-node-prompt-panel";
        document.body.appendChild(ele);
    },
    async initEvent() {
        nodePrompt.bindPromptTextareaEvent();
        
        $(".zw-node-prompt-panel").find(".zw-btn-close").click(function () {
            $(".zw-node-prompt-panel").hide();
        });
        $(".zw-node-prompt-panel").find(".zw-textarea").keyup(function () {
            nodePrompt.setTextULVal();
            nodePrompt.bindZwATextEvent();
        });
        $(".zw-node-prompt-panel").find(".zw-textarea").mouseup(function () {
            nodePrompt.setTextULVal();
            nodePrompt.bindZwATextEvent();
        });
        $("#zw-btn-clear").click(function () {
            $(".zw-node-prompt-panel").find(".zw-textarea").val("");
            nodePrompt.setTextULVal();
        })
        $("#zw-btn-ai-detail").click(function () {
            nodePrompt.aiPromptDetail();
        });
        $("#zw-btn-ai-detail-pre").click(function () {
            nodePrompt.aiPromptDetailPre();
        });
        $("#zw-btn-ai-detail-after").click(function () {
            nodePrompt.aiPromptDetailAfter();
        });
        $("#zw-btn-fanyi").click(function () {
            nodePrompt.promptFanyi();
        });
        $("#zw-btn-prompt").click(function () {
            let prompt = $(".zw-node-prompt-panel").find(".zw-textarea").val();
            nodePrompt.textarea.val(prompt);
			nodePrompt.textarea[0].dispatchEvent(new Event('input', { bubbles: true }));
			nodePrompt.textarea[0].dispatchEvent(new Event('change', { bubbles: true }));
            $(".zw-node-prompt-panel").find(".zw-btn-close").click();
        });
        $("#zw-tab-h-prompt-0").click(function () {
            $(".zw-tab-header").find(".zw-tab-header-item").removeClass("zw-tab-header-item-on");
            $(this).addClass("zw-tab-header-item-on");
            $(".zw-tab-body").hide();
            $(".zw-tab-body").eq(0).show();

            nodePrompt.bindCate0List();
        });
        
        
        /** Tags */
        $(".zw-tab-ul-li .zw-tab-ul-nav").each(function (index) {
            $(this).click(function(){

                $(".zw-tab-ul-li .zw-tab-ul-nav").removeClass("zw-tab-ul-nav-on");
                $(this).addClass("zw-tab-ul-nav-on");
                   
                $(".zw-tab-ul-nav-sub").hide();
                $(".zw-tab-ul-nav-sub-"+index).show();
                $(".zw-tab-ul-nav-sub-"+index+" .zw-tab-ul-nav-sub-a").removeClass("zw-tab-ul-nav-sub-a-on");
                $(".zw-tab-ul-nav-sub-"+index+" .zw-tab-ul-nav-sub-a").eq(0).addClass("zw-tab-ul-nav-sub-a-on");

                $(".zw-tab-body-item").hide();
                $(".zw-tab-body-item-"+index).eq(0).show();
            });
        });



        $("#zw-tab-h-his").click(function () {
            $(".zw-tab-header").find(".zw-tab-header-item").removeClass("zw-tab-header-item-on");
            $(this).addClass("zw-tab-header-item-on");
            $(".zw-tab-body").hide();
            $(".zw-tab-body").eq(1).show();

            nodePrompt.pageIndex = 0;
            $(".zw-his-srch").find(".zw-text").val("");
            nodePrompt.bindHistoryRecord();
        });
        $(".zw-history-page-bar-prev").click(function () {
            if (nodePrompt.pageIndex > 0) {
                nodePrompt.pageIndex--;
            }
            if(nodePrompt.pageIndex < 0) {
                nodePrompt.pageIndex = 0;
            }
            nodePrompt.bindHistoryRecord();
        });
        $(".zw-history-page-bar-next").click(function () {
            nodePrompt.pageIndex++;
            nodePrompt.bindHistoryRecord();
        });
        $(".zw-his-srch").find(".zw-btn-search").click(function () {
            nodePrompt.pageIndex = 0;
            nodePrompt.bindHistoryRecord();
        });
        $(".zw-history-page-bar-page-size").find('select[name="zw-select-page-size-prompt"]').change(function () {
            nodePrompt.pageIndex = 0;
            nodePrompt.bindHistoryRecord();
        });
        $("#zw-tab-h-prompt-edit").click(function () {
            $(".zw-tags-box").show();
            zwTags.bindCate0List();
        });
        $(".zw-tab-cond-bar").find(".is_fav").click(function () {
            nodePrompt.bindCate0List();
        });
    },
    async bindPromptTextareaEvent() {
		let textareaTmp = $(".p-textarea");
		
		// 1. 获取所有匹配的 textarea 元素（不仅仅是第一个）
		let textareas = $(".p-textarea");
		
		if (textareas.length === 0) {
			console.warn("未找到 .p-textarea 元素，请确认选择器是否正确或元素是否已渲染");
		}

		// 绑定在 document 上，使用【捕获阶段 (true)】
        // 这样无论节点是现在有的，还是未来 10 分钟后创建的，都能生效
        document.addEventListener("dblclick", function(e) {
            const target = e.target;
            
            // 检查目标是否是 ComfyUI 的 textarea
            // v1.3+ 前端通常是 TEXTAREA 标签，且可能有 p-textarea 类
            if (target && target.tagName === "TEXTAREA" && target.classList.contains("p-textarea")) {
                
                console.log("捕捉到 Textarea 双击:", target);
                
                // --- 你的业务逻辑写在这里 ---
				nodePrompt.textarea = $(target);
				$(".zw-node-prompt-panel").show();

				let prompt = $(target).val();
				prompt = prompt.replaceAll(/，/g, ",").replaceAll(/。/g, ",").replace(/\r\n/g, ",").replace(/\n/g, ",");
				$(".zw-node-prompt-panel").find(".zw-textarea").val(prompt);

				$(".zw-tab-header").find(".zw-tab-header-item").removeClass("zw-tab-header-item-on");
				$(".zw-tab-header").find(".zw-tab-header-item").eq(0).addClass("zw-tab-header-item-on");
				$(".zw-tab-box").find(".zw-tab-body").hide();
				$(".zw-tab-box").find(".zw-tab-body").eq(0).show();
				
				nodePrompt.setTextULVal();
				nodePrompt.bindZwATextEvent();
				nodePrompt.bindCate0List();
                // -------------------------

                // 阻止事件传给 ComfyUI 画布
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true); // <--- true 是核心，表示捕获阶段
		
        
    },
    async setTextULVal() {
        let prompt = $(".zw-node-prompt-panel").find(".zw-textarea").val();
        prompt = prompt.replaceAll(/，/g, ",").replaceAll(/。/g, ",").replace(/\r\n/g, ",").replace(/\n/g, ",");
        let textArr = prompt.split(",");
        let textHtml = "";
        let textStr = "";
        for (let i = 0; i < textArr.length; i++) {
            let text = textArr[i];
            text = text.trim();
            if (text != "") {
                textHtml += '<li draggable="true"><a href="javascript:;" class="zw-a-text">'+text+'</a><a href="javascript:;" class="zw-a-remove">×</a></li>';
                textStr += textArr[i].trim()+", ";
            }
        }
        $(".zw-text-ul").find("li").remove();
        $(".zw-text-ul").append(textHtml);

        
        let draggingItem;
        let dragEndItem;
        $('.zw-text-ul > li').on('dragstart', function (e) {
            draggingItem = $(this);
            draggingItem.addClass('dragging');
        });

        $('.zw-text-ul > li').on('dragend', function (e) {
            draggingItem.removeClass('dragging');
            if(dragEndItem.parent().hasClass('zw-text-ul')){
                dragEndItem.before(draggingItem);
                nodePrompt.setTextAreaVal();
            }
        });
        $('.zw-text-ul > li').on('dragover', function (e) {
            e.preventDefault();
            dragEndItem = $(e.target).parent();
        });

        //$(".zw-node-prompt-panel").find(".zw-textarea").val(textStr);
    },
    async bindZwATextEvent() {
        $(".zw-a-remove").click(function(){
            $(this).parent().remove();
            var text = $(this).parent().find(".zw-a-text").text();
            var textArea = $("#zw-textarea-0").val();
            let pos = textArea.indexOf(text+",");
            if(pos>-1) {
                textArea = textArea.replace(text+",","");
            } else {
                textArea = textArea.replace(text,"");
            }
            
            $("#zw-textarea-0").val(textArea);
        });
        $(".zw-a-text").click(function(){
            var text = $(this).text();
            var textArea = $("#zw-textarea-0").val();
            var sPos = textArea.lastIndexOf(text);
            var ePos = sPos + text.length;
            $("#zw-textarea-0").prop("selectionStart", sPos);
            $("#zw-textarea-0").prop("selectionEnd", ePos);
            $("#zw-textarea-0").focus();

        });
        $(".zw-a-text").mouseover(function () {
            let html =
            `
                <div class="zw-text-bar">
                    <a href="javascript:;" class="zw-a-bar zw-q0-minlus">-</a>
                    <input type="text" class="zw-text" value="1">
                    <a href="javascript:;" class="zw-a-bar zw-q0-plus">+</a>
                    <a href="javascript:;" class="zw-a-bar zw-q1-plus">
                        ( )+
                        <span class="zw-msg-tips">
                            <span class="zw-msg-tips-arrow">&#x25B2;</span>
                            <span class="zw-msg-tips-text">增强关键词权重：叠加( )</span>
                        </span>
                    </a>
                    <a href="javascript:;" class="zw-a-bar zw-q1-minlus">
                        ( )-
                        <span class="zw-msg-tips">
                            <span class="zw-msg-tips-arrow">&#x25B2;</span>
                            <span class="zw-msg-tips-text">增强关键词权重：减少( )</span>
                        </span>
                    </a>
                    <a href="javascript:;" class="zw-a-bar zw-q2-plus">
                        [ ]+
                        <span class="zw-msg-tips">
                            <span class="zw-msg-tips-arrow">&#x25B2;</span>
                            <span class="zw-msg-tips-text">减弱关键词权重：叠加[ ]</span>
                        </span>
                    </a>
                    <a href="javascript:;" class="zw-a-bar  zw-q2-minlus">
                        [ ]-
                        <span class="zw-msg-tips">
                            <span class="zw-msg-tips-arrow">&#x25B2;</span>
                            <span class="zw-msg-tips-text">减弱关键词权重：减少[ ]</span>
                        </span>
                    </a>
                </div>
            `;
            if( $(this).parent().find('.zw-text-bar').length == 0 ) {
                $(this).before(html);
                nodePrompt.bindBarEvent($(this));

                let text = $(this).text();
                text = text.replace(/\(/g, "").replace(/\)/g, "");
                text = text.replace(/\[/g, "").replace(/\]/g, "");
                let pos = text.indexOf(":");
                if(pos > -1) {
                    let v = text.substring(pos+1);
                    $(this).parent().find('.zw-text-bar').find('.zw-text').val(v);
                }
                var scrollableDiv = document.getElementById('zw-text-area');  
                scrollableDiv.addEventListener('scroll', function() {   
                    nodePrompt.scrollY = this.scrollTop;  
                });  
            }
            $(this).parent().find('.zw-text-bar').css("margin-top", (-36-nodePrompt.scrollY)+"px");
        });
    },
    async bindBarEvent(e) {
        e.parent().find(".zw-q0-minlus").click(function(){
            let v = $(this).parent().find(".zw-text").val();
            v = v === "" ? 1 : parseFloat(v);
            v =  (v * 1000 - 0.05 * 1000) / 1000;
            $(this).parent().find(".zw-text").val(v);

            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\(/g, "").replace(/\)/g, "");
            text = text.replace(/\[/g, "").replace(/\]/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
            } 

            if(v != 1) {
                text = "("+text + ":" + v + ")";
            }
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });
        e.parent().find(".zw-q0-plus").click(function(){
            let v = $(this).parent().find(".zw-text").val();
            v = v === "" ? 1 : parseFloat(v);
            v =  (v * 1000 + 0.05 * 1000) / 1000;
            $(this).parent().find(".zw-text").val(v);

            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\(/g, "").replace(/\)/g, "");
            text = text.replace(/\[/g, "").replace(/\]/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
            }
            if(v != 1) {
                text = "("+text + ":" + v + ")";
            }
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });

        e.parent().find(".zw-q1-plus").click(function(){
            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\[/g, "").replace(/\]/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
                text = text.replace(/\(/g, "").replace(/\)/g, "");
            }
            text = "("+text +")";
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });
        e.parent().find(".zw-q1-minlus").click(function(){
            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\[/g, "").replace(/\]/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
                text = text.replace(/\(/g, "").replace(/\)/g, "");
            } 
            text = text.replace("(", "").replace(")", "");
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });

        e.parent().find(".zw-q2-plus").click(function(){
            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\(/g, "").replace(/\)/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
            }
            text = "["+text +"]";
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });
        e.parent().find(".zw-q2-minlus").click(function(){
            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\(/g, "").replace(/\)/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
            } 
            text = text.replace("[", "").replace("]", "");
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });

        e.parent().find(".zw-text-bar").find(".zw-text").keyup(function(){
            let v = $(this).val();
            let text = $(this).parent().parent().find(".zw-a-text").text();
            text = text.replace(/\(/g, "").replace(/\)/g, "");
            text = text.replace(/\[/g, "").replace(/\]/g, "");
            let pos = text.indexOf(":");
            if(pos > -1) {
                text = text.substring(0, pos);
            } 
            if(v != 1) {
                text = "("+text + ":" + v + ")";
            }
            $(this).parent().parent().find(".zw-a-text").text(text);

            nodePrompt.setTextAreaVal();
        });
    },
    async setTextAreaVal() {
        let html = "";
        $(".zw-text-ul").find(".zw-a-text").each(function() {
            let text = $(this).text();
            html += text + ", ";
        })

        $("#zw-textarea-0").val(html);
    },
    async bindHistoryRecord() {
        let keywords = $(".zw-his-srch").find(".zw-text").val();
        let is_fav = $(".zw-his-srch").find(".zw-chkbox-fav").prop("checked") ? "true" : "false";
        let add_time = $(".zw-his-srch").find('.zw-date-ib-add-day').val();
        let cate_keys = $(".zw-his-srch").find('.zw-select-ib-cate-key').val();
        let page_size = $(".zw-history-page-bar-page-size").find('select[name="zw-select-page-size-prompt"]').val();

        let url = '/zw_tools/find_local_file_list?pageIndex='+nodePrompt.pageIndex
                                                            +"&keywords="+keywords
                                                            +"&is_fav="+is_fav
                                                            +"&upload_state=-1"
                                                            +"&add_time="+add_time
                                                            +"&cate_keys="+cate_keys
                                                            +"&page_size="+page_size;
        const res = await fetch(url);
        const jsonData = await res.json();
        
        if(jsonData.code != 0) return;

        $(".zw-history-page-bar-total-count").html("共"+jsonData.total_count+"条");
        $(".zw-history-page-bar-page-index").html(", 当前"+(nodePrompt.pageIndex+1) +"/"+(Math.ceil(jsonData.total_count/page_size))+"页");

        if(jsonData.data == null || jsonData.data.length == 0) {
            if(nodePrompt.pageIndex > 0) {
                nodePrompt.pageIndex--;
            }
            $(".zw-history-list").html("<dd>找不着着着...</dd>");
            return;
        }
        let html ="";
        for(let i = 0; i < jsonData.data.length; i++){
            let item = jsonData.data[i];
            let recordId = item[0];
            let arrText = JSON.parse(item[1]);
            let prompt0 = "";
            let prompt1 = "";
            if(arrText.length > 0) prompt0 = arrText[0];
            if(arrText.length > 1) prompt1 = arrText[1];
            

            let filename = item[2] === "undefined" ? "" : item[2];
            //let work_flow_json = JSON.stringify(item[3]);
            let subfolder = item[4];
            let type = item[5];
            let is_fav = item[6];
            let imgUrl = location.href + "view?filename="+filename+"&subfolder="+subfolder+"&type="+type+"&rand="+Math.random();
            //let prompt_id = item[7];

            let fileContainer = `<img class="" src="${imgUrl}">`;
            if(filename.indexOf(".mp4") > -1) {
                fileContainer = `<video src="${imgUrl}" controls="controls"></video>`;
            } 

            html += 
            `
                <dd>
                    <span class="zw-dd-span-img"><a href="${imgUrl}" target=_blank title="${recordId}">${fileContainer}</a></span>
                    <span class="zw-dd-span-0">
                        <p>${prompt0}</p>
                        <div class="zw-dd-bar"><button type="button" class="zw-btn">使用提示词1</button></div>
                    </span>
                    <span class="zw-dd-span-1">
                        <p>${prompt1}</p>
                        <div class="zw-dd-bar"><button type="button" class="zw-btn">使用提示词2</button></div>
                    </span>
                    <span class="zw-dd-span-2">
                        <button type="button" class="zw-btn zw-btn-flow" data="${recordId}">加载工作流</button>
                        <button type="button" class="zw-btn zw-btn-fav" data="${recordId}"><i class="zw-red-${is_fav}">❤</i> 收藏</button>
                    </span>
                </dd>
            `;          
        }
        $(".zw-history-list").html(html);
        $(".zw-history-list").find(".zw-dd-bar").find("button").click(function(){
            let prompt = $(this).parent().parent().find("p").text();
            prompt = prompt.replaceAll(/，/g, ",").replaceAll(/。/g, ",").replace(/\r\n/g, ",").replace(/\n/g, ",");
            $(".zw-node-prompt-panel").find(".zw-textarea").val(prompt);
            nodePrompt.setTextULVal();
            nodePrompt.bindZwATextEvent();
        });
        
        $(".zw-history-list").find(".zw-dd-span-2").find(".zw-btn-flow").click(function(){
            nodePrompt.loadWorkflow(this);
        });
        $(".zw-history-list").find(".zw-dd-span-2").find(".zw-btn-fav").click(function(){
            nodePrompt.favHistoryRecord(this);
        });
        
    },
    async loadWorkflow(e) {
        if(!confirm("确定加载此工作流？")){ return; }
        let recordId = $(e).attr("data");
        try {
            const res = await fetch('/zw_tools/find_local_file_by_id?recordId='+recordId);
            const jsonData = await res.json();
            if(jsonData.code != 0) {
                alert("加载失败："+jsonData.data);
                return;
            }

            let work_flow_json = jsonData.data[0][3];
            const jsonContent = JSON.parse(work_flow_json);

            await app.loadGraphData(
                jsonContent,
                true,
                false,
                "tmp.json"
            );
            alert("加载成功");

        } catch (err) {
            console.error('Failed to write to clipboard:', err);
            alert("加载异常");
        }
    },
    async favHistoryRecord(e) {
        let recordId = $(e).attr("data");
        let is_fav = $(e).find("i").hasClass("zw-red-true") ? "false" : "true";
        const res = await fetch('/zw_tools/fav_local_file?recordId='+recordId+'&is_fav='+is_fav);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("操作失败："+jsonData.data);
            return;   
        }
        $(e).find("i").removeClass("zw-red-true").removeClass("zw-red-false");
        if(is_fav == "true") {
            $(e).find("i").addClass("zw-red-true");
        } else {
            $(e).find("i").addClass("zw-red-false");
        }
    },

    async bindCate0List() {
        const res = await fetch('/zw_tools/tags_cate0_list');
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("加载cate0失败："+jsonData.data);
            return;   
        }
        if(jsonData.data == null){
            $(".zw-tab-ul-cate0").html("");
            $(".zw-tab-ul-cate1").html("");
            $(".zw-tab-ul-cate2").html("");
            return;
        }
        let html ="";
        let child_parent_id = 0;
        for(let i = 0; i < jsonData.data.length; i++){
            let item = jsonData.data[i];
            let recordId = item[0];
            let cate_name = item[1];
            let parent_id = item[3];
            let sort_no = item[4];
            let zw_tag_on = i == 0 ? "zw-tab-ul-nav-on" : "";
            if(i == 0) { child_parent_id = recordId; }

            let data = {
                recordId: recordId,
                cate_name: cate_name,
                parent_id: parent_id,
                sort_no: sort_no
            };
            let jsonItemStr = JSON.stringify(data);
            html +=
            `
                <li class="zw-tab-ul-li"><a href="javascript:;" data='${jsonItemStr}' class="zw-tab-ul-nav ${zw_tag_on}">${cate_name}</a></li>
            `;   
        }
        
        $(".zw-tab-ul-cate0").html(html);

        $(".zw-tab-ul-cate0").find("a").click(function(){
            $(".zw-tab-ul-cate0").find("a").removeClass("zw-tab-ul-nav-on");
            $(this).addClass("zw-tab-ul-nav-on");
            let jsonItem = JSON.parse($(this).attr("data"));
            nodePrompt.bindCate1List(jsonItem.recordId);
        });
        
        nodePrompt.bindCate1List(child_parent_id);
    },
    async bindCate1List(parent_id){
        const res = await fetch('/zw_tools/tags_cate1_list?parent_id='+parent_id);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("加载cate1失败："+jsonData.data);
            return;   
        }
        if(jsonData.data == null){
            $(".zw-tab-ul-cate1").html("");
            $(".zw-tab-ul-cate2").html("");
            return;
        }
        let html ="";
        let child_parent_id = 0;
        for(let i = 0; i < jsonData.data.length; i++){
            let item = jsonData.data[i];
            let recordId = item[0];
            let cate_name = item[1];
            let parent_id = item[3];
            let sort_no = item[4];

            let zw_tag_on = i == 0 ? "zw-tab-ul-nav-sub-a-on" : "";
            if(i == 0) { child_parent_id = recordId;}

            let data = {
                recordId: recordId,
                cate_name: cate_name,
                parent_id: parent_id,
                sort_no: sort_no
            };
            let jsonItemStr = JSON.stringify(data);
            html +=
            `
                <li><a href="javascript:;" data='${jsonItemStr}' class="zw-tab-ul-nav-sub-a ${zw_tag_on}">${cate_name}</a></li>
            `;   
        }
        $(".zw-tab-ul-cate1").html(html);

        $(".zw-tab-ul-cate1").find("a").click(function(){
            $(".zw-tab-ul-cate1").find("a").removeClass("zw-tab-ul-nav-sub-a-on");
            $(this).addClass("zw-tab-ul-nav-sub-a-on");

            let jsonItem = JSON.parse($(this).attr("data"));
            nodePrompt.bindCate2List(jsonItem.recordId);
        });
        nodePrompt.bindCate2List(child_parent_id);
    },
    async bindCate2List(parent_id){
        let is_fav = $(".zw-tab-cond-bar").find(".is_fav").prop("checked") ? "true" : "";
        let enabled_type = $(".zw-tab-cond-bar").find("input[name='enabled_type']:checked").val();
        const res = await fetch('/zw_tools/tags_cate2_list?parent_id='+parent_id+'&is_fav='+is_fav);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("加载cate2失败："+jsonData.data);
            return;   
        }
        if(jsonData.data == null){
            $(".zw-tab-ul-cate2").html("");
            return;
        }
        let html ="";
        for(let i = 0; i < jsonData.data.length; i++){
            let item = jsonData.data[i];
            let recordId = item[0];
            let tag_name_cn = item[1];
            let tag_name_en = item[2];
            let cateId0 = item[3];
            let sort_no = item[5];
            let example_img = item[6];
            let is_fav = item[7];
            let zw_tag_on = i == 0 ? "zw-tag-on" : "";

            let data = {
                recordId: recordId,
                tag_name_cn: tag_name_cn,
                tag_name_en: tag_name_en,
                cateId0: cateId0,
                sort_no: sort_no,
                example_img: example_img,
                is_fav: is_fav
            };
            let jsonItemStr = JSON.stringify(data);
            jsonItemStr = jsonItemStr.replace(/'/g, "`");//转义单引号
            html +=
            `
                <li><a href="javascript:;" class="zw-tab-body-item-a" data='${jsonItemStr}'>${tag_name_cn}</a>
                    <a href="javascript:;" class="zw-tab-body-item-a-fav" data='${recordId}'><i class="zw-red-${is_fav}" title="收藏">❤</i></a>
                    <div class="zw-tab-body-item-a-bar">
                        <div class="zw-tag-name-cn">${tag_name_cn}</div>
                        <div class="zw-tag-name-en">
                            ${tag_name_en} 
                        </div>
                    </div>
                </li>
            `;   
        }
        $(".zw-tab-ul-cate2").html(html);

        $(".zw-tab-ul-cate2").find(".zw-tab-body-item-a").click(function(){
            let data = $(this).attr("data");
            let jsonItem = JSON.parse(data);
            let enabled_type2 = $(".zw-tab-cond-bar").find("input[name='enabled_type']:checked").val();
            let text = enabled_type2 == 0 ? jsonItem.tag_name_cn : jsonItem.tag_name_en;
            let textareaVal = $(".zw-node-prompt-panel").find(".zw-textarea").val().trim();
            if(textareaVal != "" && textareaVal.substring(textareaVal.length-1) != ",") {
                textareaVal += ","+text;
            } else {
                textareaVal += text;
            }
            $(".zw-node-prompt-panel").find(".zw-textarea").val(textareaVal);
          
            nodePrompt.setTextULVal();
            nodePrompt.bindZwATextEvent();
        });
        $(".zw-tab-ul-cate2").find(".zw-tab-body-item-a-fav").click(function(){
            let recordId = $(this).attr("data");
            let is_fav = $(this).find("i").hasClass("zw-red-false") ? "true" : "false";
            nodePrompt.favTag(recordId, is_fav);
            if(is_fav == "true") {
                $(this).find("i").removeClass("zw-red-false");
                $(this).find("i").addClass("zw-red-true");
            } else {
                $(this).find("i").removeClass("zw-red-true");
                $(this).find("i").addClass("zw-red-false");
            }
        });
    },
    async favTag(recordId, is_fav) {
        const res = await fetch('/zw_tools/tags_fav?recordId='+recordId+'&is_fav='+is_fav);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("收藏失败："+jsonData.data);
            return;   
        }
    },
    
    async aiPromptDetail() {
        $("#zw-btn-ai-detail").html("细化中...");
        $("#zw-btn-ai-detail").attr("disabled", "disabled");
        
        var promptText = $("#zw-textarea-0").val();
        if(promptText == "") {return;}

        let data = {
            content: promptText
        };
        if(nodePrompt.cachePromptText.length == 0 
            || nodePrompt.cachePromptText[nodePrompt.cachePromptText.length-1] != data.content){
            if(nodePrompt.cachePromptText.length >= 20){
                nodePrompt.cachePromptText.shift();//删除第一个
            }
            nodePrompt.cachePromptText.push(data.content);  
        }

        let url = '/zw_tools/ai_prompt_detail'
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
        if(jsonData.code != 0) {
            alert("操作失败："+jsonData.data);
            $("#zw-btn-ai-detail").removeAttr("disabled");
            $("#zw-btn-ai-detail").html("AI细化");
            return;   
        }
        let seqNo = jsonData.data;

        nodePrompt.aiBtnTimerCnt = 60;
        nodePrompt.aiPromptDetailQuery(seqNo);
    },
    async aiPromptDetailQuery(seqNo) {
        if( nodePrompt.aiBtnTimerCnt < 0) {
            nodePrompt.aiBtnTimerCnt = 60;
            alert("AI细化超时，请稍后再试");
            $("#zw-btn-ai-detail").html("AI细化");
            $("#zw-btn-ai-detail").removeAttr("disabled");
            return;
        }
        let data = {
            seqNo: seqNo
        };
        $("#zw-btn-ai-detail").html("("+nodePrompt.aiBtnTimerCnt+")细化中..");
        let url = '/zw_tools/ai_prompt_detail_query'
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

        if(jsonData.code == 100) {
            setTimeout(function(){
                nodePrompt.aiBtnTimerCnt--;
                nodePrompt.aiPromptDetailQuery(seqNo);
            }, 1000);
            return; 
        }
        else if(jsonData.code == 0) {
            $("#zw-textarea-0").val(jsonData.data);
            if(nodePrompt.cachePromptText.length >= 20){
                nodePrompt.cachePromptText.shift();//删除第一个
            }
            nodePrompt.cachePromptText.push(jsonData.data);
            nodePrompt.cachePromptIndex = nodePrompt.cachePromptText.length - 1;
    
            $("#zw-btn-ai-detail").html("AI细化");
            $("#zw-btn-ai-detail").removeAttr("disabled");
            return; 
        } else {
            alert("操作失败："+jsonData.data);
            $("#zw-btn-ai-detail").removeAttr("disabled");
            $("#zw-btn-ai-detail").html("AI细化");
        }
    },

    async aiPromptDetailPre() {
        if(nodePrompt.cachePromptText.length == 0) {
            return;
        }
        nodePrompt.cachePromptIndex -= 1;
        if(nodePrompt.cachePromptIndex < 0) {
            nodePrompt.cachePromptIndex = 0;
        }
        
        $("#zw-textarea-0").val(nodePrompt.cachePromptText[nodePrompt.cachePromptIndex]);
    },
    async aiPromptDetailAfter() {
        if(nodePrompt.cachePromptText.length == 0) {
            return;
        } 
        nodePrompt.cachePromptIndex += 1;
        if(nodePrompt.cachePromptIndex > nodePrompt.cachePromptText.length-1) {
            nodePrompt.cachePromptIndex = nodePrompt.cachePromptText.length-1;
        }
        $("#zw-textarea-0").val(nodePrompt.cachePromptText[nodePrompt.cachePromptIndex]);
    },
    async promptFanyi() {
        $("#zw-btn-fanyi").html("翻译中");
        $("#zw-btn-fanyi").attr("disabled", "disabled");
        
        var promptText = $("#zw-textarea-0").val();
        if(promptText == "") {return;}

        let data = {
            content: promptText
        };

        let url = '/zw_tools/prompt_fanyi'
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
        if(jsonData.code != 0) {
            alert("操作失败："+jsonData.data);
        } else {
            $("#zw-textarea-0").val(jsonData.data);
            nodePrompt.setTextULVal();
            nodePrompt.bindZwATextEvent();
        }
        $("#zw-btn-fanyi").removeAttr("disabled");
        $("#zw-btn-fanyi").html("翻译");
    },
}