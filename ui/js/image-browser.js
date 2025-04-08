export const imageBrowser = {
    // Unique name for the extension
	name: "imageBrowser",
    isShowImageBrowserBar:true,
    imageBrowserBarZoomObj:null,
    imageBrowserZoomObj:null,
    pageIndex:0,
    async initHtml() {
        let html = 
        `
        <div class="zw-image-browser">

            <div class="zw-close-box"><span>zw-tools本地文件管理</span><button type="button" id="zw-btn-close" class="zw-btn zw-btn-close" title="关闭">×</button></div>
            <div class="zw-conent">
                <div class="zw-ib-srch-box">
                    <div class="zw-ib-srch-box-left">
                        <label><input type="checkbox" class="zw-chkbox zw-ib-chkbox-all" value="true"/>全选</label>
                        <button type="button" class="zw-btn zw-btn-ib-del-checked"> 删除选中</button>
                        <button type="button" class="zw-btn zw-btn-ib-tmp-save" title="将预览时生成的图片转存至OUTPUT"> TMP转存</button>
                        <button type="button" class="zw-btn zw-btn-ib-upload" > 上传至云端</button>
                        <button type="button" class="zw-btn zw-btn-ib-edit-cate-keys"> 修改分类</button>
                        <div class="zw-edit-box zw-edit-box-cate-keys" style="left: calc(50% - 270px);width: 540px;height: 280px;" >
                            <div class="zw-edit-title">编辑文件所属分类</div>
                            <ul class="zw-param-ul">
                                <li>
                                    <div class="zw-select-box">
                                        <a href="javascript:;" class="zw-a-cate zw-a-on"><span>女士</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>日本动画片</span></a>
                                        <a href="javascript:;" class="zw-a-cate zw-a-on"><span>户外</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>漫画</span></a>
        
                                        <a href="javascript:;" class="zw-a-cate"><span>摄影</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>戏服</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>男人</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>动画</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>盔甲</span></a>
                                                                     
                                        <a href="javascript:;" class="zw-a-cate"><span>运输</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>建筑学</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>城市</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>卡通</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>车</span></a>
                                                                    
                                        <a href="javascript:;" class="zw-a-cate"><span>食物</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>天文学</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>现代艺术</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>猫</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>机器人</span></a>
                                                                     
                                        <a href="javascript:;" class="zw-a-cate"><span>景观</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>狗</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>龙</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>幻想</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>跑车</span></a>
                                                                     
                                        <a href="javascript:;" class="zw-a-cate"><span>后世界末日</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>真实感</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>恐怖</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>名人</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>游戏角色</span></a>
                                                                     
                                        <a href="javascript:;" class="zw-a-cate"><span>科幻</span></a>
                                        <a href="javascript:;" class="zw-a-cate"><span>其他</span></a>
                                    </div> 
                                </li>
                            </ul>
                            <div class="zw-edit-bar">
                                <span>单个编辑时显示所属分类，多个编辑时一律不显示</span>
                                <button type="button" class="zw-btn zw-edit-box-cate-keys-save">保存</button>
                                <button type="button" class="zw-btn zw-edit-box-cate-keys-cancel">取消</button>
                            </div>
                        </div>
                    </div>
                    <div class="zw-ib-srch-box-right">
                        <label><input type="checkbox" class="zw-chkbox zw-chkbox-ib-fav" value="true"/>已收藏</label>
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
                        <select name="zw-slc-upload-state" class="zw-select" >
                            <option value="-1">上传状态</option>
                            <option value="0">未上传</option>
                            <option value="1">上传中</option>
                            <option value="2">已上传</option>
                        </select>
                        <input type="text" class="zw-text" placeholder="请输入关键字" style="width:112px;"/><button type="button" class="zw-btn zw-btn-ib-search">搜索</button>
                        <button type="button" class="zw-btn zw-btn-ib-page-bar-pic-t">小图</button>   
                    </div>
                </div>
                <div class="zw-ib-image-box" id="zw-ib-image-box" >
                    <ul class="zw-image-ul-ib">
                        
                    </ul>
                </div>
                <div class="zw-param-box" style="display: none;" id="zw-param-box" >
                    <ul class="zw-param-ul">
                        <li>
                            <b>翻译使用类型：</b>
                            <label><input type="radio" name="used_trans_type" class="zw-rdo zw-fy-type" value="0" checked />禁用</label>
                            <label><input type="radio" name="used_trans_type" class="zw-rdo zw-fy-type" value="1"/>百度翻译</label>
                            <label><input type="radio" name="used_trans_type" class="zw-rdo zw-fy-type" value="2"/>AI8808 API_KEY翻译</label>
                            <button type="button" class="zw-btn zw-param-save-trans-type" style="margin-left: 21px;">保存参数</button>
                        </li>
                        <li class="zw-fy-baidu">
                            <b>百度翻译APPID</b>
                            <input type="text" name="baidu_appid" class="zw-text" placeholder="用于翻译提示词"> 
                        </li>
                        <li class="zw-fy-baidu">
                            <b>百度翻译KEY</b>
                            <input type="text" name="baidu_key" class="zw-text" placeholder="用于翻译提示词"> 
                            <button type="button" id="zw-baidu-key" class="zw-btn">测试</button>
                            <button type="button" class="zw-btn zw-param-save-baidu_key">保存参数</button>
                            <a href="https://www.ai8808.com/article/html/20250408/20250408152656.html?f=comfyui" target="_blank">申请教程</a>
                        </li>
                        <li class="zw-fy-ai8808">
                            <b>AI8808 API_KEY</b>
                            <input type="text" name="tuqu_key" class="zw-text" placeholder="用于AI提示词细化或翻译或云端保存"> 
                            <button type="button" id="zw-tuqu-key" class="zw-btn">测试</button>
                            <button type="button" class="zw-btn zw-param-save-tuqu_key">保存参数</button>
                            <a href="https://www.ai8808.com/user/register?f=comfyui" target="_blank">访问AI8808.com极速申请</a>
                        </li>
                        <li>
                            <b>AI生成文件时：</b>
                            <label><input type="radio" name="ignore_pre_type" class="zw-rdo" value="0" checked />保存预览图记录</label>
                            <label><input type="radio" name="ignore_pre_type" class="zw-rdo" value="1"/>忽略预览图记录</label>
                            <button type="button" class="zw-btn zw-param-save-ignore_pre_type" style="margin-left: 63px;">保存参数</button>
                            <a href="javascript:;">测试预览或视频生成测试有大量预览图时建议选择【忽略】</a>
                        </li>
                        <li>
                            <b>AI生成文件时<br>默认所属分类：</b>
                            <div class="zw-select-box">
                                <a href="javascript:;" class="zw-a-cate zw-a-on"><span>女士</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>日本动画片</span></a>
                                <a href="javascript:;" class="zw-a-cate zw-a-on"><span>户外</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>漫画</span></a>

                                <a href="javascript:;" class="zw-a-cate"><span>摄影</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>戏服</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>男人</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>动画</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>盔甲</span></a>
															 
                                <a href="javascript:;" class="zw-a-cate"><span>运输</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>建筑学</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>城市</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>卡通</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>车</span></a>
															
                                <a href="javascript:;" class="zw-a-cate"><span>食物</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>天文学</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>现代艺术</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>猫</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>机器人</span></a>
															 
                                <a href="javascript:;" class="zw-a-cate"><span>景观</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>狗</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>龙</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>幻想</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>跑车</span></a>
															 
                                <a href="javascript:;" class="zw-a-cate"><span>后世界末日</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>真实感</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>恐怖</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>名人</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>游戏角色</span></a>
															 
                                <a href="javascript:;" class="zw-a-cate"><span>科幻</span></a>
                                <a href="javascript:;" class="zw-a-cate"><span>其他</span></a>
                            </div>
                            <div class="zw-btn-cate-keys-save-box">
                                <button type="button" class="zw-btn zw-param-save-cate-keys">保存默认分类</button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="zw-ib-page-bar">
                    <div class="zw-ib-page-bar-info">
                        <span class="zw-ib-page-bar-total-count"></span>
                        <span class="zw-ib-page-bar-page-size">
                            , 每页
                            <select class="zw-select zw-select-page-size" name="zw-select-page-size">
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
                        <span class="zw-ib-page-bar-page-index"></span>
                    </div>
                    <button type="button" class="zw-btn zw-btn-ib-page-bar-prev">上一页</button>
                    <button type="button" class="zw-btn zw-btn-ib-page-bar-next">下一页</button>
                </div>
                <div class="zw-ib-bottom-btn-bar">
                    <span class="zw-bars-msg"></span>
                    <span class="zw-bars-msg2"></span>
                    <button type="button" class="zw-btn zw-btn-ib-page-bar-param-guidang" title="归档操作：只是让output文件夹内看起来更简洁，文件依旧存在，依旧可以使用此文件管理器查看管理">文件归档</button>
                    <button type="button" class="zw-btn zw-btn-ib-page-bar-param-show">参数设置</button>
                    <button type="button" class="zw-btn zw-btn-ib-page-bar-param-cancel">取消/返回</button>
                </div>
            </div>
        </div>
        <div class="zw-image-browser-bar">
            <div class="zw-image-browser-bar-left">
                <ul class="zw-ib-bar-img-ul">
                </ul>
            </div>
            <div class="zw-image-browser-bar-left-btn">
                <button type="button" class="zw-btn zw-btn-ib-bar-clear">清空</button>
            </div>
        </div>
        <div class="zw-image-browser-bar-right" draggable="false">
            <div class="zw-qark-btn-box">
                <button type="button" class="zw-btn zw-btn-ib-bar-0">+ 放大</button>
                <button type="button" class="zw-btn zw-btn-ib-bar-1">- 缩小</button>
                <button type="button" class="zw-btn zw-btn-ib-bar-close" >收缩</button>
            </div>
            <div class="zw-circle-btn-box">
                <button type="button" class="zw-btn zw-btn-ib-bar-m" title="ZW文件管理">
                    <span class="zw-fg-min">ZW</span>
                </button>
                
            </div>
        </div>
        <div class="zw-mask-layer" id="zw-mask-layer-image-zoom">
            <div class="zw-image-zoom-box">
                <div class="zw-image-zoom-l">
                    <a href="javascript:;" class="zw-zoom-a-prev"></a>
                </div>
                <div class="zw-image-zoom-c">
                    <a href="javascript:;" class="zw-image-zoom-box-img" target=_blank><img src="css/ComfyUI_temp_fnpfy_00016_.png"><video src="" controls="controls"></a>
                    <a href="javascript:;" class="zw-image-zoom-box-close">×</a>
                </div>
                <div class="zw-image-zoom-r">
                    <a href="javascript:;" class="zw-zoom-a-next"></a>
                </div>
            </div>
        </div>
        <div class="zw-mask-layer" id="zw-mask-layer-image-browser">
            <div class="zw-image-zoom-box">
                <div class="zw-image-zoom-l">
                    <a href="javascript:;" class="zw-zoom-a-prev"></a>
                </div>
                <div class="zw-image-zoom-c">
                    <a href="javascript:;" class="zw-image-zoom-box-img" target=_blank><img src="css/ComfyUI_temp_fnpfy_00016_.png"><video src="" controls="controls"></a>
                    <a href="javascript:;" class="zw-image-zoom-box-close">×</a>
                </div>
                <div class="zw-image-zoom-r">
                    <a href="javascript:;" class="zw-zoom-a-next"></a>
                </div>
            </div>
        </div>
        `;
       
        $("body").append(html);
    },
    async initEvent() {
        imageBrowser.setImageBrowserBarLocalHeight();
        $(".comfy-menu").css("top","10px");

        $(".zw-image-browser").find(".zw-btn-close").click(function () {
            $(".zw-image-browser").hide();
        });
        $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-close").click(function () {
            $("#zw-mask-layer-image-zoom").hide();
        });
        $("#zw-mask-layer-image-zoom").click(function () {
            $("#zw-mask-layer-image-zoom").hide();
        });
        $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-close").click(function () {
            $("#zw-mask-layer-image-browser").hide();
        });
        $("#zw-mask-layer-image-browser").click(function () {
            $("#zw-mask-layer-image-browser").hide();
        });

        $(".zw-image-browser-bar-left-btn").find(".zw-btn-ib-bar-clear").click(function () {
            $(".zw-ib-bar-img-ul").html("");
        });
        $(".zw-image-browser-bar-right").find(".zw-btn-ib-bar-close").click(function () {
            if(imageBrowser.isShowImageBrowserBar){
                $(".zw-image-browser-bar").hide();
                imageBrowser.isShowImageBrowserBar = false;
                $(".zw-image-browser-bar-right").find(".zw-btn-ib-bar-close").text("展开");

                $(".zw-image-browser-bar").css("height", "63px");
            } else {
                $(".zw-image-browser-bar").show();
                imageBrowser.isShowImageBrowserBar = true;
                $(".zw-image-browser-bar-right").find(".zw-btn-ib-bar-close").text("收缩");
                imageBrowser.setImageBrowserBarLocalHeight();
            }
        });
        $(".zw-image-browser-bar-right").find(".zw-btn-ib-bar-0").click(function () {
            let barHeight = $(".zw-image-browser-bar").height();
            $(".zw-image-browser-bar").css("height", (barHeight+10)+"px");
            var  imgMaxH = barHeight - 24;
            $(".zw-image-browser-bar").find(".zw-ib-bar-img-ul").find("img").css("max-height", (parseInt(imgMaxH)+10)+"px");
            $(".zw-image-browser-bar").find(".zw-ib-bar-img-ul").find("video").css("max-height", (parseInt(imgMaxH)+10)+"px");

            localStorage.setItem("zw-imageBrowserBarHeight", $(".zw-image-browser-bar").height());
        });
        $(".zw-image-browser-bar-right").find(".zw-btn-ib-bar-1").click(function () {
            if($(".zw-image-browser-bar").height() <= 63) {
                return;
            }
            let barHeight = $(".zw-image-browser-bar").height();
            $(".zw-image-browser-bar").css("height", (barHeight-10)+"px");
            var  imgMaxH = barHeight - 24;
            $(".zw-image-browser-bar").find(".zw-ib-bar-img-ul").find("img").css("max-height", (parseInt(imgMaxH)-10)+"px");
            $(".zw-image-browser-bar").find(".zw-ib-bar-img-ul").find("video").css("max-height", (parseInt(imgMaxH)-10)+"px");

            localStorage.setItem("zw-imageBrowserBarHeight", $(".zw-image-browser-bar").height());
        });
        $(".zw-image-browser-bar-right").find(".zw-btn-ib-bar-m").click(function () {
            if($(".zw-image-browser").css("display") == "none") {
                $(".zw-image-browser").show();
                $(".zw-ib-srch-box").find(".zw-text").val("");
                imageBrowser.bindLocalFileList();
            } else {
                $(".zw-image-browser").hide();
            }
        });
        imageBrowser.setMoveDiv($(".zw-image-browser-bar-right"));

        
        $("#zw-mask-layer-image-zoom").find(".zw-zoom-a-prev").click(function(event) {
            event.stopPropagation(); // 阻止事件冒泡  
            let currA = imageBrowser.imageBrowserBarZoomObj;
            if(currA.parent().prev()) {
                imageBrowser.imageBrowserBarZoomObj = currA.parent().prev().find("a");
                imageBrowser.zoomImageBarItem();
            }
        });
        $("#zw-mask-layer-image-zoom").find(".zw-zoom-a-next").click(function(event) {
            event.stopPropagation(); // 阻止事件冒泡  
            let currA = imageBrowser.imageBrowserBarZoomObj;
            if(currA.parent().next()) {
                imageBrowser.imageBrowserBarZoomObj = currA.parent().next().find("a");
                imageBrowser.zoomImageBarItem();
            }
        });
        $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").click(function(event) {
            event.stopPropagation(); // 阻止事件冒泡  
        });
        //----------------------------search----------------------------------------
        $(".zw-ib-srch-box-right").find(".zw-btn-ib-search").click(function () {
            imageBrowser.pageIndex = 0;
            imageBrowser.bindLocalFileList();
        });
        $(".zw-ib-page-bar-page-size").find('select[name="zw-select-page-size"]').change(function () {
            imageBrowser.pageIndex = 0;
            imageBrowser.bindLocalFileList();
        });
        
        $(".zw-btn-ib-page-bar-prev").click(function () {
            if (imageBrowser.pageIndex > 0) {
                imageBrowser.pageIndex--;
            }
            if(imageBrowser.pageIndex < 0) {
                imageBrowser.pageIndex = 0;
            }

            imageBrowser.bindLocalFileList();
        });
        $(".zw-btn-ib-page-bar-next").click(function () {
            imageBrowser.pageIndex++;
            imageBrowser.bindLocalFileList();
        });
        $(".zw-btn-ib-del-checked").click(function () {
            imageBrowser.delCheckedImage();
        });
        $(".zw-btn-ib-tmp-save").click(function () {
            let checkedCnt = $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").length;
            if(checkedCnt == 0){
                alert("请选择要转存的文件");
                return;
            }
            let unTmpCount = 0;
            $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
                if($(this).parent().parent().find(".zw-is-temp").length  <= 0) {
                    unTmpCount++; 
                }
            });
            if(unTmpCount > 0) {
                alert("请不要选择非TEMP文件");
                return;
            }

            if(!confirm("确定将TEMP文件夹中的文件转存到OUTPUT文件夹？")){ return; }
            imageBrowser.moveTmpToOutput();
        });
        $("#zw-mask-layer-image-browser").find(".zw-zoom-a-prev").click(function(event) {
            event.stopPropagation(); // 阻止事件冒泡  
            let currA = imageBrowser.imageBrowserZoomObj;
            if(currA.parent().prev()) {
                imageBrowser.imageBrowserZoomObj = currA.parent().prev().find("a");
                imageBrowser.zoomImageBrowserItem();
            }
        });
        $("#zw-mask-layer-image-browser").find(".zw-zoom-a-next").click(function(event) {
            event.stopPropagation(); // 阻止事件冒泡  
            let currA = imageBrowser.imageBrowserZoomObj;
            if(currA.parent().next()) {
                imageBrowser.imageBrowserZoomObj = currA.parent().next().find("a");
                imageBrowser.zoomImageBrowserItem();
            }
        });
        $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").click(function(event) {
            event.stopPropagation(); // 阻止事件冒泡  
        });
        $(".zw-btn-ib-upload").click(function() {
            imageBrowser.uploadImage();
        });
        $(".zw-btn-ib-page-bar-param-guidang").click(function() {
            imageBrowser.fileGuidang();
        });
        $(".zw-btn-ib-page-bar-pic-t").click(function() {
            let text = $(".zw-btn-ib-page-bar-pic-t").text();
            if("小图" == text){
                $(".zw-image-ul-ib").addClass("zw-image-ul-ib-half");
                $(".zw-btn-ib-page-bar-pic-t").text("大图");
            } else {
                $(".zw-image-ul-ib").removeClass("zw-image-ul-ib-half");
                $(".zw-btn-ib-page-bar-pic-t").text("小图");
            }
        });
        
        /** params */
        $(".zw-fy-type").click(function() {
            let type = $(this).val();
            if(type == 0) {
                $(".zw-fy-baidu").hide();
            } else if(type == 1) {
                $(".zw-fy-baidu").show();
            } else {
                $(".zw-fy-baidu").hide();
            }
        });
        $(".zw-btn-ib-page-bar-param-show").click(function() {
            $('.zw-ib-srch-box').hide();
            $('.zw-ib-image-box').hide();
            $('.zw-btn-ib-page-bar-param-show').hide();
            $('.zw-btn-ib-page-bar-param-guidang').hide();
            $('.zw-ib-page-bar').hide();

            $('.zw-param-box').css("display", 'flex');
            $('.zw-btn-ib-page-bar-param-cancel').css("display",'inline-block');

            imageBrowser.getParams();
        });
        $(".zw-btn-ib-page-bar-param-cancel").click(function() {
            $('.zw-ib-srch-box').show();
            $('.zw-ib-image-box').show();
            $('.zw-btn-ib-page-bar-param-show').css("display",'inline-block');
            $('.zw-btn-ib-page-bar-param-guidang').css("display",'inline-block');
            $('.zw-ib-page-bar').show();

            $('.zw-param-box').hide();
            $('.zw-btn-ib-page-bar-param-cancel').hide();
        });
        $('.zw-param-box').find(".zw-select-box").find("a").click(function() {
            if($(this).hasClass("zw-a-on")) {
                $(this).removeClass("zw-a-on");
            } else {
                let checkedCnt = $(".zw-param-box").find(".zw-select-box").find(".zw-a-on").length;
                if(checkedCnt >=5) {
                    alert("最多选择5个");
                    return;
                }
                $(this).addClass("zw-a-on"); 
            }
        });
        $(".zw-param-save-trans-type").click(function() {
            imageBrowser.saveParamsTransType();
        });
        $(".zw-param-save-baidu_key").click(function() {
            imageBrowser.saveParamsBaiduKey();
        });
        $(".zw-param-save-tuqu_key").click(function() {
            imageBrowser.saveParamsTuquKey();
        });
        $(".zw-param-save-ignore_pre_type").click(function() {
            imageBrowser.saveParamsIgnorePreType();
        });
        
        $(".zw-param-save-cate-keys").click(function() {
            imageBrowser.saveParamsCateKeys();
        });
        $("#zw-baidu-key").bind('click', () => {
            imageBrowser.testBaidu();
        });
        $("#zw-tuqu-key").bind('click', () => {
            imageBrowser.testTuqu();
        });

        /** cate-keys */
        $(".zw-btn-ib-edit-cate-keys").click(function() {
            imageBrowser.bindCateKeys();
        });
        $(".zw-edit-box-cate-keys").find(".zw-select-box").find("a").click(function() {
            if($(this).hasClass("zw-a-on")) {
                $(this).removeClass("zw-a-on");
            } else {
                let checkedCnt = $(".zw-edit-box-cate-keys").find(".zw-select-box").find(".zw-a-on").length;
                if(checkedCnt >=5) {
                    return;
                }
                $(this).addClass("zw-a-on");
            }
        });
        $(".zw-edit-box-cate-keys").find(".zw-edit-box-cate-keys-save").click(function() {
            imageBrowser.saveCateKeys();
        });
        $(".zw-edit-box-cate-keys").find(".zw-edit-box-cate-keys-cancel").click(function() {
            $(".zw-edit-box-cate-keys").hide();
        });
    },
    async setMoveDiv(divObj){
         //var $draggable = $('#draggable');
         var $draggable = divObj;
         var offsetX, offsetY, initialX, initialY;

        var posX = localStorage.getItem("zw-bar-btn-posX");
        var posY = localStorage.getItem("zw-bar-btn-posY");
        if(posX != null && posY != null) {
            $draggable.css({
                right: posX,
                bottom: posY
            });
        }

        $draggable.on('mousedown', function (e) {
            // 获取当前窗口的宽度和高度
            var width = $(window).width();
            var height = $(window).height();
             // 获取鼠标按下时的坐标
             offsetX = e.pageX - $draggable.offset().left;
             offsetY = e.pageY - $draggable.offset().top;

             // 获取 DIV 初始位置
             initialX = $draggable.offset().left;
             initialY = $draggable.offset().top;

             // 绑定鼠标移动事件
             $(document).on('mousemove.draggable', function (moveEvent) {
                 // 计算新的位置
                 var newX = moveEvent.pageX - offsetX;
                 var newY = moveEvent.pageY - offsetY;

                // 已知left 和top值 和 对象高宽 计算出 right 和 buttom值
                var rightX = width - newX - $draggable.width();
                var bottomY = height - newY - $draggable.height(); 
                if(rightX < 0) {
                    rightX = 0;
                }
                if(bottomY < 0 ) {
                    bottomY = 0;
                }
                $draggable.css({
                    right: rightX,
                    bottom: bottomY
                });
                
             });

             // 绑定鼠标松开事件
             $(document).on('mouseup.draggable', function () {
                 // 解绑鼠标移动事件
                 $(document).off('mousemove.draggable mouseup.draggable');
                 localStorage.setItem("zw-bar-btn-posX", $draggable.css('right'));
                 localStorage.setItem("zw-bar-btn-posY", $draggable.css('bottom'));
             });

             // 阻止默认事件和冒泡
             e.preventDefault();
             return false;
        });

    },
    async bindCateKeys() {
        let checkedCnt = $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").length;
        if(checkedCnt == 0){
            alert("请选择至少一个文件");
            return;
        }
        
        let singleCateKey = "";
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
            singleCateKey = $(this).parent().attr("cateKeys");
        });
        $(".zw-edit-box-cate-keys").find(".zw-select-box").find("a").removeClass("zw-a-on");
        if(checkedCnt == 1) {
            $(".zw-edit-box-cate-keys").find(".zw-select-box").find("a").each(function () {
                let text = $(this).text();
                if(singleCateKey != "" && singleCateKey.indexOf(text) >= 0) {
                    $(this).addClass("zw-a-on");
                }
            });
        }

        $(".zw-edit-box-cate-keys").show();
     },
     async saveCateKeys() {
        let checkedCnt = $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").length;
        if(checkedCnt == 0){
            alert("请选择至少一个");
            return;
        }
        let checked_ids = [];
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
            let recordId = $(this).parent().attr("data");
            checked_ids.push(recordId);
        });

        
        let checked_keys_cnt = $(".zw-edit-box-cate-keys").find(".zw-select-box").find(".zw-a-on").length
        if(checked_keys_cnt == 0){
            alert("请选择至少一个");
            return;
        }
        if(checked_keys_cnt > 5){
            alert("最多只能选择5个");
            return;
        }
        
        if(!confirm("确定保存？")) return;
        let checked_keys = [];
        $(".zw-edit-box-cate-keys").find(".zw-select-box").find(".zw-a-on").each(function () {
            let text = $(this).text();
            checked_keys.push(text);
        });
        let data = {
            checked_ids: checked_ids,
            checked_keys: checked_keys
        };
        let url = '/zw_tools/local_file_cate_keys'
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
        if(jsonData.code == 0) {
            alert("保存成功");
            $(".zw-edit-box-cate-keys").hide();
            imageBrowser.bindLocalFileList();
        } else {
            alert(jsonData.data);
        }
     },
    async setImageBrowserBarLocalHeight() {
       let height = localStorage.hasOwnProperty("zw-imageBrowserBarHeight") ? localStorage.getItem("zw-imageBrowserBarHeight") : 63;
       $(".zw-image-browser-bar").css("height", height+"px");
       $(".zw-image-browser-bar").find(".zw-ib-bar-img-ul").find("img").css("max-height", (height-24)+"px");
       $(".zw-image-browser-bar").find(".zw-ib-bar-img-ul").find("video").css("max-height", (height-24)+"px");
       if($(".pysssss-image-feed--bottom").length > 0) { $(".pysssss-image-feed--bottom").hide(); }
    },
    async bindImageBrowserBarItems(images) {
       let html = "";
       for(let i=0; i < images.length; i++) {
            let objImg = images[i];

            let imgUrl = objImg != "" ? location.href + "view?filename="+objImg.filename+"&subfolder="+objImg.subfolder+"&type="+objImg.type+"&rand="+Math.random() : "";
            if(objImg.filename.indexOf(".mp4") > -1) {
                html += `
                    <li><a href="javascript:;" class="zw-ib-bar-a"><video src="${imgUrl}"></video></a><a href="javascript:;" class="zw-ib-bar-a-del" title="仅从工具栏移除，不删除文件">×</a></li>
                `;
            } else {
                html += `
                    <li><a href="javascript:;" class="zw-ib-bar-a"><img src="${imgUrl}"></a><a href="javascript:;" class="zw-ib-bar-a-del" title="仅从工具栏移除，不删除文件">×</a></li>
                `;
            }
       }

       $(".zw-ib-bar-img-ul").prepend(html);

       imageBrowser.bindImageBrowserBarItemsEvents();
       imageBrowser.setImageBrowserBarLocalHeight();
    },
    async bindImageBrowserBarItemsEvents(){
        $(".zw-ib-bar-img-ul").find(".zw-ib-bar-a-del").unbind("click");
        $(".zw-ib-bar-img-ul").find(".zw-ib-bar-a-del").click(function () {
            $(this).parent().remove();
        });

        $(".zw-ib-bar-img-ul").find(".zw-ib-bar-a").unbind("click");
        $(".zw-ib-bar-img-ul").find(".zw-ib-bar-a").click(function () {
            imageBrowser.imageBrowserBarZoomObj = $(this);
            imageBrowser.zoomImageBarItem();
        });
    },
    async zoomImageBarItem(){
        let currA = imageBrowser.imageBrowserBarZoomObj;
        let isVideo = currA.find("video").length > 0 ? true : false;
        let containerTag = isVideo ? "video" : "img";
        let imgUrl = currA.find(containerTag).attr("src");
        if(isVideo){
            $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").find("img").hide();
            $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").find("video").show();
        } else {
            $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").find("img").show();
            $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").find("video").hide();
        }

        $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").find(containerTag).attr("src", imgUrl);
        $("#zw-mask-layer-image-zoom").find(".zw-image-zoom-box-img").attr("href", imgUrl);
        $("#zw-mask-layer-image-zoom").show();
        
        if(currA.parent().prev().length > 0){
            $("#zw-mask-layer-image-zoom").find(".zw-zoom-a-prev").show();
        } else {
            $("#zw-mask-layer-image-zoom").find(".zw-zoom-a-prev").hide();
        }
        if(currA.parent().next().length > 0){
            $("#zw-mask-layer-image-zoom").find(".zw-zoom-a-next").show();
        } else {
            $("#zw-mask-layer-image-zoom").find(".zw-zoom-a-next").hide();
        }
    },
    async zoomImageBrowserItem(){
        let currA = imageBrowser.imageBrowserZoomObj;
        let isVideo = currA.find("video").length > 0 ? true : false;
        let containerTag = isVideo ? "video" : "img";
        let imgUrl = currA.find(containerTag).attr("src");
        if(isVideo){
            $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").find("img").hide();
            $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").find("video").show();
        } else {
            $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").find("img").show();
            $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").find("video").hide();
        }

        $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").find(containerTag).attr("src", imgUrl);
        $("#zw-mask-layer-image-browser").find(".zw-image-zoom-box-img").attr("href", imgUrl);
        $("#zw-mask-layer-image-browser").show();
        
        if(currA.parent().prev().length > 0){
            $("#zw-mask-layer-image-browser").find(".zw-zoom-a-prev").show();
        } else {
            $("#zw-mask-layer-image-browser").find(".zw-zoom-a-prev").hide();
        }
        if(currA.parent().next().length > 0){
            $("#zw-mask-layer-image-browser").find(".zw-zoom-a-next").show();
        } else {
            $("#zw-mask-layer-image-browser").find(".zw-zoom-a-next").hide();
        }
    },
    async saveLocalFile(input_texts, out_images, flow, prompt_id) {
        let data = {
            input_texts: input_texts,
            out_images: out_images,
            flow: flow,
            prompt_id: prompt_id
        };
        let url = '/zw_tools/save_local_file'
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
    },
    async bindLocalFileList() {
        let keywords = $(".zw-ib-srch-box").find(".zw-text").val();
        let is_fav = $(".zw-ib-srch-box").find(".zw-chkbox-ib-fav").prop("checked") ? "true" : "false";
        let upload_state = $(".zw-ib-srch-box").find('select[name="zw-slc-upload-state"]').val();
        let add_time = $(".zw-ib-srch-box").find('.zw-date-ib-add-day').val();
        let cate_keys = $(".zw-ib-srch-box").find('.zw-select-ib-cate-key').val();
        let page_size = $(".zw-ib-page-bar-page-size").find('select[name="zw-select-page-size"]').val();

        if(upload_state === undefined) {
            upload_state = "-1";
        }
        let url = '/zw_tools/find_local_file_list?pageIndex='+imageBrowser.pageIndex
                                                            +"&keywords="+keywords
                                                            +"&is_fav="+is_fav
                                                            +"&upload_state="+upload_state
                                                            +"&add_time="+add_time
                                                            +"&cate_keys="+cate_keys
                                                            +"&page_size="+page_size;
        const res = await fetch(url);
        const jsonData = await res.json()
        
        if(jsonData.code != 0) return;

        $(".zw-ib-page-bar-total-count").html("共"+jsonData.total_count+"条");
        $(".zw-ib-page-bar-page-index").html(", 当前"+(imageBrowser.pageIndex+1) +"/"+(Math.ceil(jsonData.total_count/parseInt(page_size)))+"页");

        if(jsonData.data == null || jsonData.data.length == 0) {
            if(imageBrowser.pageIndex > 0) {
                imageBrowser.pageIndex--;
            }
            $(".zw-image-ul-ib").html("<li>找不着着着...</li>");
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
            let subfolder = item[4];
            let type = item[5];
            let is_fav = item[6];
            
            let upload_state = item[8];
            let cate_keys = item[9];
            let is_gui_dang = item[10]==1 ? "【档】" : "";

            let upload_state_label = "未上传";
            if(upload_state == 1){
                upload_state_label = "上传中";
            } else if(upload_state == 2){
                upload_state_label = "已上传";
            }
            upload_state_label = upload_state_label +is_gui_dang;

            let imgUrl = location.href + "view?filename="+filename+"&subfolder="+subfolder+"&type="+type+"&rand="+Math.random();

            let fileContainer = `<img class="" src="${imgUrl}" title="${prompt0}">`;
            if(filename.indexOf(".mp4") > -1) {
               fileContainer = `<video src="${imgUrl}" controls="controls" title="${prompt0}"></video>`;
            } 
            html += 
            `
                <li>
                    <a href="javascript:;" class="zw-a-imb-ib">${fileContainer}</a>
                    <a href="javascript:;" class="zw-a-imb-ib-checkbox" data="${recordId}" cateKeys="${cate_keys}"><i class="zw-a-imb-false">✔</i></a>
                    <a href="javascript:;" class="zw-a-imb-ib-fav" data="${recordId}"><i class="zw-red-${is_fav}">❤</i></a>
                    <a href="javascript:;" class="zw-a-imb-ib-state"><i class="zw-upload-state-${upload_state}">${upload_state_label}</i></a>
                    <span class="zw-is-${type}">TEMP</span>
                </li>
            `;          
        }
        $(".zw-image-ul-ib").html(html);
       
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").click(function(){
            if($(this).find("i").hasClass("zw-a-imb-false")){
                $(this).find("i").removeClass("zw-a-imb-false").addClass("zw-a-imb-true");
            } else {
                $(this).find("i").removeClass("zw-a-imb-true").addClass("zw-a-imb-false");
            }
            let checkedCnt = $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").length;
            let checkboxCnt = $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").length;
            $(".zw-ib-chkbox-all").prop("checked", checkedCnt == checkboxCnt);
        });
        $(".zw-ib-chkbox-all").click(function () {
            if($(this).prop("checked")) {
                $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find("i").removeClass("zw-a-imb-false").addClass("zw-a-imb-true");
            } else {
                $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find("i").removeClass("zw-a-imb-true").addClass("zw-a-imb-false");
            }
        });
        
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-fav").click(function(){
            imageBrowser.favLocalFile(this);
        });
        $(".zw-image-ul-ib").find(".zw-a-imb-ib").click(function(){ 
            imageBrowser.imageBrowserZoomObj = $(this);
            imageBrowser.zoomImageBrowserItem();
        });
        
    },
    async favLocalFile(e) {
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
    async delCheckedImage() {
        let checked_ids = [];
        let checkedCnt = $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").length;
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
            let recordId = $(this).parent().attr("data");
            checked_ids.push(recordId);
        });

        let data = {
            checked_ids: checked_ids
        };
        if(checkedCnt == 0) {
            alert("请先选择要删除的文件！");
            return;
        }
       
        if(!confirm("确定删除选中的文件？")) return;

        let url = '/zw_tools/del_checked_local_file'
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
            return;   
        }
        $(".zw-ib-chkbox-all").prop("checked", false);
        imageBrowser.bindLocalFileList();
    },
    async moveTmpToOutput() {
        let checked_ids = [];
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
            let recordId = $(this).parent().attr("data");
            if($(this).parent().parent().find(".zw-is-temp").length > 0) {
                checked_ids.push(recordId);
            }
        });

        let data = {
            checked_ids: checked_ids
        };
        let url = '/zw_tools/move_tmp_output_local_file'
        const res = await fetch(url, 
            {
                method:'POST', 
                headers: {
                'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            }
        );
        const jsonData = await res.json();
        if(jsonData.code != 0) {
            alert("操作失败："+jsonData.data);
            return;   
        }
        
        imageBrowser.bindLocalFileList();
    },
    async fileGuidang() {
        if(!confirm("后台将按照日期对output目录下文件进行归档，确定归档？")) return;
        const res = await fetch('/zw_tools/file_gui_dang')
        const jsonData = await res.json()
        if(jsonData.code == 0) {
           alert("归档请求成功，具体进度请查看output目录");
        } else if(jsonData.code == 100) {
            alert(jsonData.data);
        } else {
            alert("归档操作失败");
        }
    },async getParams() {
        const res = await fetch('/zw_tools/get_params')
        const jsonData = await res.json()
        let used_trans_type = jsonData.used_trans_type;
        let cate_keys = jsonData.cate_keys;
        let ignore_pre_type = jsonData.ignore_pre_type;
        $(".zw-param-ul").find("input[name='baidu_key']").val(jsonData.baidu_key);
        $(".zw-param-ul").find("input[name='baidu_appid']").val(jsonData.baidu_appid);
        $(".zw-param-ul").find("input[name='tuqu_key']").val(jsonData.tuqu_key);
        $(".zw-param-ul").find("input[name='used_trans_type'][value='"+used_trans_type+"']").prop('checked', true);
        $(".zw-param-ul").find("input[name='ignore_pre_type'][value='"+ignore_pre_type+"']").prop('checked', true);
        $(".zw-param-ul").find(".zw-select-box").find("a").removeClass("zw-a-on");
        $(".zw-param-ul").find(".zw-select-box").find("a").each(function () {
            let cate_key = $(this).text();
            if(cate_keys != "" && cate_keys.indexOf(cate_key) >= 0) {
                $(this).addClass("zw-a-on");
            }
        });
        
        if(used_trans_type == 0) {
            $(".zw-fy-baidu").hide();
        } else if(used_trans_type == 1) {
            $(".zw-fy-baidu").show();
        } else {
            $(".zw-fy-baidu").hide();
        }
        $(".zw-fy-ai8808").show();
    },
    async saveParamsBaiduKey() {
        let baidu_key = $(".zw-param-ul").find("input[name='baidu_key']").val();
        let baidu_appid = $(".zw-param-ul").find("input[name='baidu_appid']").val();
        if(baidu_key == "") {
            alert("请输入百度翻译key");
            return;
        }
        
        if(baidu_appid == "") {
            alert("请输入百度翻译appid");
            return;
        }
        if(!confirm("确定保存？")) return;
        let data = {
            baidu_key: baidu_key,
            baidu_appid: baidu_appid
        };
        const res = await fetch('/zw_tools/save_params_baidu_key',
            {
            method:'POST', 
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });
        const jsonData = await res.json()
        if(jsonData.code == 0) {
           alert("保存成功");
        } else {
            alert("保存失败");
        }
    },
    async saveParamsTuquKey() {
        let tuqu_key = $(".zw-param-ul").find("input[name='tuqu_key']").val();
        if(tuqu_key == "") {
            alert("请输入API_KEY");
            return;
        }

        if(!confirm("确定保存？")) return;
        let data = {
            tuqu_key: tuqu_key
        };
        const res = await fetch('/zw_tools/save_params_tuqu_key',
            {
            method:'POST', 
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });
        const jsonData = await res.json()
        if(jsonData.code == 0) {
           alert("保存成功");
        } else {
            alert("保存失败");
        }
    },
    async saveParamsTransType() {
        if(!confirm("确定保存？")) return;
        let used_trans_type = $(".zw-param-ul").find("input[name='used_trans_type']:checked").val();

        let data = {
            used_trans_type: used_trans_type
        };
        const res = await fetch('/zw_tools/save_params_used_trans_type',
            {
            method:'POST', 
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });
        const jsonData = await res.json()
        if(jsonData.code == 0) {
           alert("保存成功");
        } else {
            alert("保存失败");
        }
    },
    async saveParamsIgnorePreType() {
        if(!confirm("确定保存？")) return;
        let ignore_pre_type = $(".zw-param-ul").find("input[name='ignore_pre_type']:checked").val();

        let data = {
            ignore_pre_type: ignore_pre_type
        };
        const res = await fetch('/zw_tools/save_params_ignore_pre_type',
            {
            method:'POST', 
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });
        const jsonData = await res.json()
        if(jsonData.code == 0) {
           alert("保存成功");
        } else {
            alert("保存失败");
        }
    },
    async saveParamsCateKeys() {
        
        let checked_keys_cnt = $(".zw-param-ul").find(".zw-select-box").find(".zw-a-on").length
        if(checked_keys_cnt == 0){
            alert("请选择至少一个");
            return;
        }
        if(checked_keys_cnt > 5){
            alert("最多只能选择5个");
            return;
        }
        if(!confirm("确定保存？")) return;
        let cate_keys = "";
        $(".zw-param-ul").find(".zw-select-box").find(".zw-a-on").each(function () {
            let text = $(this).text();
            if(cate_keys != "") {
                cate_keys += ",";
            }
            cate_keys += text;
        });

        let data = {
            cate_keys: cate_keys
        };
        const res = await fetch('/zw_tools/save_params_cate_keys',
            {
            method:'POST', 
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });
        const jsonData = await res.json()
        if(jsonData.code == 0) {
           alert("保存成功");
        } else {
            alert("保存失败");
        }
    },
    async testBaidu() {
        let baidu_key = $(".zw-param-ul").find("input[name='baidu_key']").val();
        let baidu_appid = $(".zw-param-ul").find("input[name='baidu_appid']").val();
        if(baidu_key == "") {
            alert("请先填入参数");
            $(".zw-param-ul").find("input[name='baidu_key']").focus();
            return;
        }
        if(baidu_appid == "") {
            alert("请先填入参数");
            $(".zw-param-ul").find("input[name='baidu_appid']").focus();
            return;
        }
        const res = await fetch('/zw_tools/test_baidu?baidu_key='+baidu_key+'&baidu_appid='+baidu_appid);
        const jsonData = await res.json()
        if(jsonData.code == 0) {
            alert("测试成功:"+jsonData.data);
        } else {
            alert("测试失败:"+jsonData.data);
        }
    },

    async testTuqu() {
        let tuqu_key = $(".zw-param-ul").find("input[name='tuqu_key']").val();
        if(tuqu_key == "") {
            alert("请先填入参数");
            $(".zw-param-ul").find("input[name='tuqu_key']").focus();
            return;
        }
        const res = await fetch('/zw_tools/test_api_key?tuqu_key='+tuqu_key);
        const jsonData = await res.json()
        if(jsonData.code == 0) {
            alert("测试成功:KEY有效");
        } else {
            alert("测试失败:"+jsonData.data);
        }
    },
    async uploadImage() {
        let tmpCount = 0;
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
            if($(this).parent().parent().find(".zw-is-temp").length  > 0) {
                tmpCount++; 
            }
        });
        if(tmpCount > 0) {
            alert("请不要选择TEMP文件");
            return;
        }

        let checked_ids = [];
        $(".zw-image-ul-ib").find(".zw-a-imb-ib-checkbox").find(".zw-a-imb-true").each(function () {
            let recordId = $(this).parent().attr("data");
            checked_ids.push(recordId);
        });
        if(checked_ids.length == 0) {
            alert("请先选择要上传到云端的文件！");
            return;
        }
       
        if(!confirm("确定上传？")) return;

        let data = {
            checked_ids: checked_ids
        };
        let url = '/zw_tools/upload_local_file'
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
        if(jsonData.code == 0) {
            imageBrowser.bindLocalFileList();
        } else {
            alert("上传失败："+jsonData.data);
        }
    },
};