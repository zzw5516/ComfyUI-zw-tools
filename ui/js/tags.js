export const zwTags = {
    // Unique name for the extension
	name: "zwTags",
    scrollY: 0,
    textarea: null,
    pageIndex:0,
    async initHtml() {
        let html = `
                <div class="zw-tags-box">
                    <div class="zw-close-box"><span>zw-tools提示词维护</span><button type="button" class="zw-btn zw-btn-close" title="关闭">×</button></div>
                    <div class="zw-conent ">
                        <div class="zw-col-box">
                            <div class="zw-col0">
                                <div class="zw-col-btn-bar">
                                    <button type="button" class="zw-btn zw-btn-cate0-add">新增</button>
                                    <button type="button" class="zw-btn zw-btn-cate0-edit">修改</button>
                                    <button type="button" class="zw-btn zw-btn-cate0-del">删除</button>
                                </div>
                                <div class="zw-col-title">
                                    <a class="head">大分类</a>
                                </div>
                                <ul class="zw-ul-list0 zw-cate0">loading...</ul>
                            </div>
                            <div class="zw-col1">
                                <div class="zw-col-btn-bar">
                                    <button type="button" class="zw-btn zw-btn-cate1-add">新增</button>
                                    <button type="button" class="zw-btn zw-btn-cate1-edit">修改</button>
                                    <button type="button" class="zw-btn zw-btn-cate1-del">删除</button>
                                </div>
                                <div class="zw-col-title">
                                    <a class="head">子分类</a>
                                </div>
                                <ul class="zw-ul-list0 zw-cate1"></ul>
                            </div>
                            <div class="zw-col2">
                                <div class="zw-col-btn-bar">
                                    <button type="button" class="zw-btn zw-btn-cate2-add">新增</button>
                                    <button type="button" class="zw-btn zw-btn-cate2-edit">修改</button>
                                    <button type="button" class="zw-btn zw-btn-cate2-del">删除</button>
                                    <label style="color:#AAA;font-size: 13px;cursor: pointer; color:red;"><input type="checkbox" class="chkbox is_fav">仅显示已收藏</label>
                                </div>
                                <div class="zw-col-title">
                                    <a class="head"><span class="zw-sp0">排序号</span><span class="zw-sp1">中文词</span><span class="zw-sp2">英文词/值</span><span class="zw-sp3">示例图</span></a>
                                </div>
                                <ul class="zw-ul-list0  zw-cate2"></ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="zw-edit-box zw-edit-box-cate0" >
                    <div class="zw-edit-title">添加/编辑大分类</div>
                    <ul class="zw-param-ul">
                        <li>
                            <b>分类名称</b>
                            <input type="text" name="cate_name" class="zw-text" placeholder="" maxlength="18"> 
                            <input type="hidden" name="recordId" >
                            <input type="hidden" name="parent_id" >
                        </li>
                        <li>
                            <b>分类排序</b>
                            <input type="text" name="sort_no" class="zw-text" placeholder="仅数字" maxlength="5"> 
                        </li>
                    </ul>
                    <div class="zw-edit-bar">
                        <button type="button" class="zw-btn zw-edit-box-cate0-save">保存</button>
                        <button type="button" class="zw-btn zw-btn-cancel">取消</button>
                    </div>
                </div>
                <div class="zw-edit-box zw-edit-box-cate1">
                    <div class="zw-edit-title">添加/编辑子分类</div>
                    <ul class="zw-param-ul">
                        <li>
                            <b>父级分类</b>
                            <input type="text" name="cate_name_parent" class="zw-text" placeholder="" maxlength="18" readonly> 
                        </li>
                        <li>
                            <b>分类名称</b>
                            <input type="text" name="cate_name" class="zw-text" placeholder="" maxlength="18"> 
                            <input type="hidden" name="recordId" >
                            <input type="hidden" name="parent_id" >
                        </li>
                        <li>
                            <b>分类排序</b>
                            <input type="text" name="sort_no" class="zw-text" placeholder="仅数字" maxlength="5"> 
                        </li>
                    </ul>
                    <div class="zw-edit-bar">
                        <button type="button" class="zw-btn zw-edit-box-cate1-save">保存</button>
                        <button type="button" class="zw-btn zw-btn-cancel">取消</button>
                    </div>
                </div>
                <div class="zw-edit-box zw-edit-box-cate2">
                    <div class="zw-edit-title">添加/编辑提示词</div>
                    <ul class="zw-param-ul">
                        <li>
                            <b>分类</b>
                            <input type="text" name="cate_name_parent" class="zw-text" placeholder="" maxlength="18" readonly> 
                        </li>
                        <li>
                            <b>中文词</b>
                            <input type="text" name="tag_name_cn" class="zw-text" placeholder=""> 
                            <input type="hidden" name="recordId" >
                            <input type="hidden" name="cateId0" >
                        </li>
                        <li>
                            <b>英文词/值</b>
                            <input type="text" name="tag_name_en" class="zw-text" placeholder=""> 
                        </li>
                        
                        <li>
                            <b>示例图</b>
                            <input type="text" name="example_img" class="zw-text" placeholder="完整图片URL"> 
                        </li>
                        <li>
                            <b>分类排序</b>
                            <input type="text" name="sort_no" class="zw-text" placeholder="仅数字" maxlength="5"> 
                        </li>
                        <li>
                            <b>收藏</b>
                            <label style="color:#AAA;font-size: 13px;cursor: pointer;"><input type="checkbox" name="is_fav" class="chkbox is_fav"></label>
                        </li>
                    </ul>
                    <div class="zw-edit-bar">
                        <button type="button" class="zw-btn zw-edit-box-cate2-save">保存</button>
                        <button type="button" class="zw-btn zw-btn-cancel">取消</button>
                    </div>
                </div>
        `;
        $("body").append(html);
    },
    async initEvent() {
        $(".zw-tags-box").find(".zw-btn-close").click(function () {
            $(".zw-tags-box").hide();
            $(".zw-edit-box").hide();
        });
        //zwTags.bindCate0List();
        $(".zw-btn-cate0-add").click(function () {
            $(".zw-edit-box-cate0").find("input[name='recordId']").val(0);
            $(".zw-edit-box-cate0").find("input[name='cate_name']").val("");
            $(".zw-edit-box-cate0").find("input[name='parent_id']").val(0);
            $(".zw-edit-box-cate0").find("input[name='sort_no']").val(1);
            $(".zw-edit-box-cate0").show();
        });
        $(".zw-btn-cate0-edit").click(function () {
            $(".zw-edit-box-cate0").show();
            zwTags.bindCate0Info();
        });
        $(".zw-btn-cate0-del").click(function () {
            zwTags.delCate0();
        });
        $(".zw-edit-box-cate0-save").click(function () {
            zwTags.saveCate0Info();
        });
        $(".zw-edit-box").find(".zw-btn-cancel").click(function () {
            $(this).parent().parent().hide();
        });

        $(".zw-btn-cate1-add").click(function () {
            let e = $(".zw-cate0").find(".zw-tag-on").eq(0);
            let jsonItem = JSON.parse(e.attr("data"));
            $(".zw-edit-box-cate1").find("input[name='cate_name_parent']").val(jsonItem.cate_name);
            $(".zw-edit-box-cate1").find("input[name='recordId']").val(0);
            $(".zw-edit-box-cate1").find("input[name='cate_name']").val("");
            $(".zw-edit-box-cate1").find("input[name='parent_id']").val(jsonItem.recordId);
            $(".zw-edit-box-cate1").find("input[name='sort_no']").val(1);
            $(".zw-edit-box-cate1").show();
        });
        $(".zw-btn-cate1-edit").click(function () {
            $(".zw-edit-box-cate1").show();
            zwTags.bindCate1Info();
        });
        $(".zw-btn-cate1-del").click(function () {
            zwTags.delCate1();
        });
        $(".zw-edit-box-cate1-save").click(function () {
            zwTags.saveCate1Info();
        });

        $(".zw-btn-cate2-add").click(function () {
            let e = $(".zw-cate1").find(".zw-tag-on").eq(0);
            let jsonItem = JSON.parse(e.attr("data"));
            $(".zw-edit-box-cate2").find("input[name='cate_name_parent']").val(jsonItem.cate_name);
            $(".zw-edit-box-cate2").find("input[name='recordId']").val(0);
            $(".zw-edit-box-cate2").find("input[name='tag_name_en']").val("");
            $(".zw-edit-box-cate2").find("input[name='tag_name_cn']").val("");
            $(".zw-edit-box-cate2").find("input[name='cateId0']").val(jsonItem.recordId);
            $(".zw-edit-box-cate2").find("input[name='sort_no']").val(1);
            $(".zw-edit-box-cate2").find("input[name='is_fav']").prop("checked",false);
            $(".zw-edit-box-cate2").find("input[name='example_img']").val("");
            $(".zw-edit-box-cate2").show();
        });
        $(".zw-btn-cate2-edit").click(function () {
            $(".zw-edit-box-cate2").show();
            zwTags.bindCate2Info();
        });
        $(".zw-btn-cate2-del").click(function () {
            zwTags.delCate2();
        });
        $(".zw-edit-box-cate2-save").click(function () {
            zwTags.saveCate2Info();
        });
        $(".zw-col2").find(".is_fav").click(function () {
            zwTags.bindCate0List();
        });
    },
    async bindCate0List() {
        const res = await fetch('/zw_tools/tags_cate0_list');
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("加载cate0失败："+jsonData.data);
            return;   
        }
        if(jsonData.data == null){
            $(".zw-cate0").html("");
            $(".zw-cate1").html("");
            $(".zw-cate2").html("");
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
            let zw_tag_on = i == 0 ? "zw-tag-on" : "";
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
                <li class="zw-li-list0"><a href="javascript:;" data='${jsonItemStr}' class="${zw_tag_on}">[${sort_no}]${cate_name}</a></li>
            `;   
        }
        $(".zw-cate0").html(html);

        $(".zw-cate0").find("a").click(function(){
            $(".zw-cate0").find("a").removeClass("zw-tag-on");
            $(this).addClass("zw-tag-on");
            let jsonItem = JSON.parse($(this).attr("data"));
            zwTags.bindCate1List(jsonItem.recordId);
        });
        zwTags.bindCate1List(child_parent_id);
    },
    async bindCate0Info() {
        let e = $(".zw-cate0").find(".zw-tag-on").eq(0);
        let jsonItem = JSON.parse(e.attr("data"));
        $(".zw-edit-box-cate0").find("input[name='recordId']").val(jsonItem.recordId);
        $(".zw-edit-box-cate0").find("input[name='cate_name']").val(jsonItem.cate_name);
        $(".zw-edit-box-cate0").find("input[name='sort_no']").val(jsonItem.sort_no);
        $(".zw-edit-box-cate0").find("input[name='parent_id']").val(jsonItem.parent_id);
    },
    async saveCate0Info() {
        let recordId = $(".zw-edit-box-cate0").find("input[name='recordId']").val(); 
        let cate_name = $(".zw-edit-box-cate0").find("input[name='cate_name']").val();
        let parent_id = $(".zw-edit-box-cate0").find("input[name='parent_id']").val();
        let sort_no =  $(".zw-edit-box-cate0").find("input[name='sort_no']").val();
        if(cate_name == "") {
            alert("分类名称不能为空");
            return;
        }
        if(sort_no == ""){
            alert("排序号不能为空");
            return;
        }
        if(isNaN(sort_no)){
            alert("排序号必须是数字");
            return;
        }

        let url = recordId == 0 ? '/zw_tools/tags_cate0_add' : '/zw_tools/tags_cate0_edit'
        let data = {
            recordId: recordId,
            cate_name: cate_name,
            parent_id: parent_id,
            sort_no: sort_no
        };

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
        if(jsonData.code == 0) {
            zwTags.bindCate0List();
            $(".zw-edit-box-cate0").hide();
        } else {
            alert("保存失败");
        }
    },
    async delCate0() {
        if(!confirm("确定删除大分类？")) return;

        let e = $(".zw-cate0").find(".zw-tag-on").eq(0);
        let jsonItem = JSON.parse(e.attr("data"));
        let recordId = jsonItem.recordId;
        const res = await fetch('/zw_tools/tags_cate0_del?recordId='+recordId);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("删除失败："+jsonData.data);
            return;   
        }
        zwTags.bindCate0List();
    },

    async bindCate1List(parent_id) {
        const res = await fetch('/zw_tools/tags_cate1_list?parent_id='+parent_id);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("加载cate1失败："+jsonData.data);
            return;   
        }
        if(jsonData.data == null){
            $(".zw-cate1").html("");
            $(".zw-cate2").html("");
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

            let zw_tag_on = i == 0 ? "zw-tag-on" : "";
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
                <li class="zw-li-list0"><a href="javascript:;" data='${jsonItemStr}' class="${zw_tag_on}">[${sort_no}]${cate_name}</a></li>
            `;   
        }
        $(".zw-cate1").html(html);

        $(".zw-cate1").find("a").click(function(){
            $(".zw-cate1").find("a").removeClass("zw-tag-on");
            $(this).addClass("zw-tag-on");

            let jsonItem = JSON.parse($(this).attr("data"));
            zwTags.bindCate2List(jsonItem.recordId);
        });
        zwTags.bindCate2List(child_parent_id);
    },
    async bindCate1Info() {
        let e0 = $(".zw-cate0").find(".zw-tag-on").eq(0);
        let jsonItem0 = JSON.parse(e0.attr("data"));
        $(".zw-edit-box-cate1").find("input[name='cate_name_parent']").val(jsonItem0.cate_name);

        let e = $(".zw-cate1").find(".zw-tag-on").eq(0);
        let jsonItem = JSON.parse(e.attr("data"));
        
        $(".zw-edit-box-cate1").find("input[name='recordId']").val(jsonItem.recordId);
        $(".zw-edit-box-cate1").find("input[name='cate_name']").val(jsonItem.cate_name);
        $(".zw-edit-box-cate1").find("input[name='sort_no']").val(jsonItem.sort_no);
        $(".zw-edit-box-cate1").find("input[name='parent_id']").val(jsonItem0.recordId);
    },
    async saveCate1Info() {
        let recordId = $(".zw-edit-box-cate1").find("input[name='recordId']").val(); 
        let cate_name = $(".zw-edit-box-cate1").find("input[name='cate_name']").val();
        let parent_id = $(".zw-edit-box-cate1").find("input[name='parent_id']").val();
        let sort_no =  $(".zw-edit-box-cate1").find("input[name='sort_no']").val();
        if(cate_name == "") {
            alert("分类名称不能为空");
            return;
        }
        if(sort_no == ""){
            alert("排序号不能为空");
            return;
        }
        if(isNaN(sort_no)){
            alert("排序号必须是数字");
            return;
        }

        let url = recordId == 0 ? '/zw_tools/tags_cate1_add' : '/zw_tools/tags_cate1_edit'
        let data = {
            recordId: recordId,
            cate_name: cate_name,
            parent_id: parent_id,
            sort_no: sort_no
        };

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
        if(jsonData.code == 0) {
            zwTags.bindCate1List(parent_id);
            $(".zw-edit-box-cate1").hide();
        } else {
            alert("保存失败");
        }
    },
    async delCate1() {
        if(!confirm("确定删除小分类？")) return;

        let e = $(".zw-cate1").find(".zw-tag-on").eq(0);
        let jsonItem = JSON.parse(e.attr("data"));
        let recordId = jsonItem.recordId;
        let parent_id = jsonItem.parent_id;
        const res = await fetch('/zw_tools/tags_cate1_del?recordId='+recordId);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("删除失败："+jsonData.data);
            return;   
        }
        zwTags.bindCate1List(parent_id);
    },
    
    
    async bindCate2List(parent_id) {
        let is_fav = $(".zw-col2").find(".is_fav").prop("checked") ? "true" : "";
        const res = await fetch('/zw_tools/tags_cate2_list?parent_id='+parent_id+'&is_fav='+is_fav);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("加载cate2失败："+jsonData.data);
            return;   
        }
        if(jsonData.data == null){
            $(".zw-cate2").html("");
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
            //jsonItemStr = jsonItemStr.replace(/'/g, "`");//转义单引号
            html +=
            `
                <li class="zw-li-list0">
                    <a href="javascript:;" data='${jsonItemStr}' class="${zw_tag_on}">
                        <span class="zw-sp0">${sort_no}</span>
                        <span class="zw-sp1" title="${tag_name_cn}">${tag_name_cn}</span>
                        <span class="zw-sp2" title="${tag_name_en}">${tag_name_en}</span>
                        <span class="zw-sp3"><i class="zw-red-${is_fav}" title="收藏">❤</i><img src="${example_img}"></span>
                    </a>
                </li>
            `;   
        }
        $(".zw-cate2").html(html);

        $(".zw-cate2").find("a").click(function(){
            $(".zw-cate2").find("a").removeClass("zw-tag-on");
            $(this).addClass("zw-tag-on");
        });
    },
    async bindCate2Info() {
        let e0 = $(".zw-cate1").find(".zw-tag-on").eq(0);
        let jsonItem0 = JSON.parse(e0.attr("data"));
        $(".zw-edit-box-cate2").find("input[name='cate_name_parent']").val(jsonItem0.cate_name);

        let e = $(".zw-cate2").find(".zw-tag-on").eq(0);
        let jsonItem = JSON.parse(e.attr("data"));
        
        $(".zw-edit-box-cate2").find("input[name='recordId']").val(jsonItem.recordId);
        $(".zw-edit-box-cate2").find("input[name='tag_name_cn']").val(jsonItem.tag_name_cn);
        $(".zw-edit-box-cate2").find("input[name='tag_name_en']").val(jsonItem.tag_name_en);
        $(".zw-edit-box-cate2").find("input[name='cateId0']").val(jsonItem.cateId0);
        $(".zw-edit-box-cate2").find("input[name='sort_no']").val(jsonItem.sort_no);
        $(".zw-edit-box-cate2").find("input[name='example_img']").val(jsonItem.example_img);
        $(".zw-edit-box-cate2").find("input[name='is_fav']").prop("checked", jsonItem.is_fav == "true");
    },
    async saveCate2Info() {
        let recordId = $(".zw-edit-box-cate2").find("input[name='recordId']").val(); 
        let tag_name_cn = $(".zw-edit-box-cate2").find("input[name='tag_name_cn']").val();
        let tag_name_en = $(".zw-edit-box-cate2").find("input[name='tag_name_en']").val();
        let cateId0 = $(".zw-edit-box-cate2").find("input[name='cateId0']").val();
        let sort_no =  $(".zw-edit-box-cate2").find("input[name='sort_no']").val();
        let example_img =  $(".zw-edit-box-cate2").find("input[name='example_img']").val();
        let is_fav =  $(".zw-edit-box-cate2").find("input[name='is_fav']").prop("checked") ? "true" : "false";
        
        if(tag_name_cn == "") {
            alert("中文提示词不能为空");
            return;
        }
        if(tag_name_en == ""){
            alert("英文提示词不能为空");
            return;
        }
       
        if(sort_no == ""){
            alert("排序号不能为空");
            return;
        }
        if(isNaN(sort_no)){
            alert("排序号必须是数字");
            return;
        }

        let url = recordId == 0 ? '/zw_tools/tags_cate2_add' : '/zw_tools/tags_cate2_edit'
        let data = {
            recordId: recordId,
            tag_name_cn: tag_name_cn,
            tag_name_en: tag_name_en,
            cateId0: cateId0,
            sort_no: sort_no,
            example_img: example_img,
            is_fav:is_fav
        };

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
        if(jsonData.code == 0) {
            zwTags.bindCate2List(cateId0);
            $(".zw-edit-box-cate2").hide();
        } else {
            alert("保存失败");
        }
    },
    async delCate2() {
        if(!confirm("确定删除明细项？")) return;

        let e = $(".zw-cate2").find(".zw-tag-on").eq(0);
        let jsonItem = JSON.parse(e.attr("data"));
        let recordId = jsonItem.recordId;
        console.log("recordId="+recordId);
        let cateId0 = jsonItem.cateId0;
        const res = await fetch('/zw_tools/tags_cate2_del?recordId='+recordId);
        const jsonData = await res.json()
        if(jsonData.code != 0) {
            alert("删除失败："+jsonData.data);
            return;   
        }
        zwTags.bindCate2List(cateId0);
    },
}