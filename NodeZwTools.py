import os
import sys
from .trans_tool import Translator,baidu
from aiohttp import web
import server
import json
from .db_tool import zw_flow_record_biz
from .db_tool import zw_local_file_biz
from .db_tool import zw_params_biz
from .db_tool import zw_tags_cate_biz
from .db_tool import zw_tags_biz

class ZwPrompt:
    def __init__(self):
        pass  
    @classmethod
    def INPUT_TYPES(s):  
       
        return {"required": {
            "enabled_trans": ("BOOLEAN", {"default": True, "label_on": "开启翻译", "label_off": "关闭翻译"}),
            "text": ("STRING", {"default":"双击 呼出 词库面板","multiline": True,"placeholder": "双击 呼出 词库面板"}),
            "clip": ("CLIP",)
            
        }}
    
    RETURN_TYPES = ("CONDITIONING","STRING")
    FUNCTION = "encode"
    CATEGORY = "ZwTools"
    

    def encode(self, clip, text, enabled_trans):
        print(f'######TO BE TRANS Text={text}')
        if enabled_trans == True:
            text=translate(text)
        
        #print(text)
        tokens = clip.tokenize(text)
        cond, pooled = clip.encode_from_tokens(tokens, return_pooled=True)
        return ([[cond, {"pooled_output": pooled}]],text)
    

def translate(text):
    #CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    #file_path = os.path.join(CURRENT_DIR, 'conf', 'params.json')
   
    #with open(file_path, 'r') as f:  
    #    data = json.load(f)  
    #print(data)    
      
    #trans_server=baidu.BaiduTranslator()
    #return Translator.translate_text(trans_server, '20230327001616698', data["baidu_key"],text) 
    used_trans_type = zw_params_biz.find_used_trans_type_param()
    if used_trans_type == 1:
      baidu_key = zw_params_biz.find_baidu_param()
      baidu_appid = zw_params_biz.find_baidu_appid_param()
      trans_server=baidu.BaiduTranslator()
      respText = Translator.translate_text(trans_server, str(baidu_appid), baidu_key, text) 
      print(f'baidu--respText={respText}')
      return respText
    elif used_trans_type == 2:
      respText = zw_local_file_biz.transCN2EN(text)
      print(f'######API_KEY--respText={respText}')
      return respText
    else:
      print(f'######Unabled--text={text}')
      return text

def translateTest(text, baidu_appid, baidu_key):
    print(f"translateTest baidu_key======{baidu_key}")
    trans_server=baidu.BaiduTranslator()
    return Translator.translate_text(trans_server, str(baidu_appid), baidu_key, text) 



class ZwPromptText:
    def __init__(self):
        pass  
    @classmethod
    def INPUT_TYPES(s):  
       
        return {"required": {
            "enabled_trans": ("BOOLEAN", {"default": True, "label": "开/关翻译"}),
            "text": ("STRING", {"default":"双击 呼出 词库面板","multiline": True, "label": "双击 呼出 词库面板"}),
        }}
    
    RETURN_TYPES = ("STRING",)
    FUNCTION = "encode"
    CATEGORY = "ZwTools"
    

    def encode(self, text, enabled_trans):
        print(f'######TO BE TRANS Text={text}')
        if enabled_trans == True:
            text=translate(text)
        return (text,)















@server.PromptServer.instance.routes.get("/customnode/getNodeInfo")
async def fetch_customnode_node_info(request):
  try:
    node_name = request.rel_url.query["nodeName"]
    data = await request.json()
    table = data['table']
    json_data = data['json']

    if not node_name:
      return web.json_response({"content": ""})
    
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(CURRENT_DIR, 'docs', node_name + '.md')
    if os.path.exists(file_path):
      with open(file_path, 'r', encoding='utf-8') as file:
        return web.json_response({"content": file.read()})
    else:
      return web.json_response({"content": ""})
  except Exception as e:
    print(e)
    return web.json_response({"content": ""})

#-----------params-------------------------------------------
@server.PromptServer.instance.routes.get("/zw_tools/get_params")
async def fetch_zw_tools_get_params(request):
  try:
    baidu_key = zw_params_biz.find_baidu_param()
    baidu_appid = zw_params_biz.find_baidu_appid_param()
    tuqu_key = zw_params_biz.find_tuqu_param()
    cate_keys = zw_params_biz.find_cate_keys_default_param()
    used_trans_type = zw_params_biz.find_used_trans_type_param()
    ignore_pre_type = zw_params_biz.find_ignore_pre_type_param()
    return web.json_response({"baidu_key": baidu_key,
                              "tuqu_key": tuqu_key,
                              "baidu_appid": str(baidu_appid),
                              "cate_keys": cate_keys,
                              "used_trans_type": used_trans_type,
                              "ignore_pre_type": ignore_pre_type
                              })

  except Exception as e:
    print(e)
    return web.json_response({"baidu_key": "error1", "tuqu_key": "error2"})
  
@server.PromptServer.instance.routes.post("/zw_tools/save_params_baidu_key")
async def fetch_zw_tools_save_params_baidu_key(request):
  try:
    data = await request.json()
    baidu_key = data["baidu_key"]
    baidu_appid = data["baidu_appid"]
    
    zw_params_biz.update_baidu_key(baidu_key)
    zw_params_biz.update_baidu_appid(str(baidu_appid))
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})

@server.PromptServer.instance.routes.post("/zw_tools/save_params_tuqu_key")
async def fetch_zw_tools_save_params_tuqu_key(request):
  try:
    data = await request.json()
    tuqu_key = data["tuqu_key"]
   
    zw_params_biz.update_tuqu_key(tuqu_key)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})
  
@server.PromptServer.instance.routes.post("/zw_tools/save_params_used_trans_type")
async def fetch_zw_tools_save_params_used_trans_type(request):
  try:
    data = await request.json()
    used_trans_type = data["used_trans_type"]
   
    zw_params_biz.update_used_trans_type(used_trans_type)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})
@server.PromptServer.instance.routes.post("/zw_tools/save_params_ignore_pre_type")
async def fetch_zw_tools_save_params_ignore_pre_type(request):
  try:
    data = await request.json()
    ignore_pre_type = data["ignore_pre_type"]
   
    zw_params_biz.update_ignore_pre_type(ignore_pre_type)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})
   
@server.PromptServer.instance.routes.post("/zw_tools/save_params_cate_keys")
async def fetch_zw_tools_save_params_cate_keys(request):
  try:
    data = await request.json()
    cate_keys = data["cate_keys"]
   
    zw_params_biz.update_cate_keys_default(cate_keys)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})
@server.PromptServer.instance.routes.get("/zw_tools/test_baidu")
async def fetch_zw_tools_test_baidu(request):
  try:
    baidu_key = request.rel_url.query["baidu_key"]
    baidu_appid = request.rel_url.query["baidu_appid"]
    text = "测试文本"
    _text = translateTest(text, str(baidu_appid), baidu_key)
    code = 0 if text != _text else 500

    return web.json_response({"code": code, "data": f"{text}->{_text}"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
    
@server.PromptServer.instance.routes.get("/zw_tools/test_api_key")
async def fetch_zw_tools_test_api_key(request):
  try:
    tuqu_key = request.rel_url.query["tuqu_key"]
    resp = zw_local_file_biz.api_key_test(tuqu_key)
    if resp == "-100" or resp == "-500":
      return web.json_response({"code": 500, "data": "网络异常"})
    else:
      return web.json_response(resp)
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})   

#----------------flow_record------------------------------------------  
@server.PromptServer.instance.routes.post("/zw_tools/save_flow_record")
async def fetch_zw_save_flow_record(request):
  try:
    data = await request.json()
    input_texts = data["input_texts"]
    out_images = data["out_images"]
    flow = data["flow"]

    zw_flow_record_biz.insert_flow_record(input_texts,out_images,flow)

    return web.json_response({"code": 0, "data": ""})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.get("/zw_tools/find_flow_record_list")
async def fetch_zw_find_flow_record_list(request):
  try:
    pageIndex = int(request.rel_url.query["pageIndex"])
    keywords = request.rel_url.query["keywords"]
    is_fav = request.rel_url.query["is_fav"]
    print(f'is_fav=11=={is_fav}')
    listData = zw_flow_record_biz.find_flow_record_list(pageIndex, keywords,is_fav)
    return web.json_response({"code": 0, "data": listData})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.get("/zw_tools/del_flow_record")
async def fetch_zw_del_flow_record(request):
  try:
    recordId = request.rel_url.query["recordId"]

    zw_flow_record_biz.delete_flow_record(recordId)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  

@server.PromptServer.instance.routes.get("/zw_tools/fav_flow_record")
async def fetch_zw_fav_flow_record(request):
  try:
    recordId = request.rel_url.query["recordId"]
    is_fav = request.rel_url.query["is_fav"]
    zw_flow_record_biz.update_fav_status(is_fav,recordId)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.get("/zw_tools/del_checked_flow_record")
async def fetch_zw_del_checked_flow_record(request):
  try:
    checked_ids = request.rel_url.query["checked_ids"]
    zw_flow_record_biz.del_checked_flow_record(checked_ids)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  

@server.PromptServer.instance.routes.get("/zw_tools/del_all_flow_record")
async def fetch_zw_del_all_flow_record(request):
  try:
    zw_flow_record_biz.del_all_flow_record()
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
  

#-------local file manager--------- --------- --------- ------------- 
@server.PromptServer.instance.routes.post("/zw_tools/save_local_file")
async def fetch_zw_save_local_file(request):
  try:
    data = await request.json()
    input_texts = data["input_texts"]
    out_images = data["out_images"]
    flow = data["flow"]
    prompt_id = data["prompt_id"]
    zw_local_file_biz.insert(input_texts,out_images,flow,prompt_id)
    return web.json_response({"code": 0, "data": ""})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  

@server.PromptServer.instance.routes.get("/zw_tools/find_local_file_list")
async def fetch_zw_find_local_file_list(request):
  try:
    pageIndex = int(request.rel_url.query["pageIndex"])
    keywords = request.rel_url.query["keywords"]
    is_fav = request.rel_url.query["is_fav"]
    upload_state = request.rel_url.query["upload_state"]
    add_time = request.rel_url.query["add_time"]
    cate_keys = request.rel_url.query["cate_keys"]
    page_size = int(request.rel_url.query["page_size"])

    total_count = zw_local_file_biz.find_count(keywords,is_fav,upload_state, add_time, cate_keys)
    listData = zw_local_file_biz.find_list(pageIndex, keywords,is_fav,upload_state, add_time, cate_keys, page_size)

    return web.json_response({"code": 0, "data": listData, "total_count":total_count})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 

@server.PromptServer.instance.routes.get("/zw_tools/find_local_file_by_id")
async def fetch_zw_find_local_file_by_id(request):
  try:
    recordId = request.rel_url.query["recordId"]
    data = zw_local_file_biz.find_by_id(recordId)
    return web.json_response({"code": 0, "data": data})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.get("/zw_tools/fav_local_file")
async def fetch_zw_fav_local_file(request):
  try:
    recordId = request.rel_url.query["recordId"]
    is_fav = request.rel_url.query["is_fav"]
    zw_local_file_biz.update_fav_status(is_fav,recordId)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/del_checked_local_file")
async def fetch_zw_del_checked_local_file(request):
  try:
    data = await request.json()
    checked_ids = data["checked_ids"]
    zw_local_file_biz.del_checked(checked_ids)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/move_tmp_output_local_file")
async def fetch_zw_move_tmp_output_local_file(request):
  try:
    data = await request.json()
    checked_ids = data["checked_ids"]
    zw_local_file_biz.move_tmp_output(checked_ids)
    return web.json_response({"code": 0, "data": "OK"})
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.get("/zw_tools/file_gui_dang")
async def fetch_zw_file_gui_dang(request):
  try:
    resp = zw_local_file_biz.file_gui_dang()
    return web.json_response(resp)  
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/upload_local_file")
async def fetch_zw_upload_local_file(request):
  try:
    data = await request.json()
    checked_ids = data["checked_ids"]
    resp = zw_local_file_biz.upload_local_file(checked_ids)
    return web.json_response(resp)
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/local_file_cate_keys")
async def fetch_zw_local_file_cate_keys(request):
  try:
    data = await request.json()
    checked_ids = data["checked_ids"]
    checked_keys = data["checked_keys"]
    zw_local_file_biz.update_cate_keys(checked_keys, checked_ids)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 


@server.PromptServer.instance.routes.post("/zw_tools/ai_prompt_detail")
async def ai_prompt_detail(request):
  try:
    data = await request.json()
    content = data["content"]
    resp = zw_local_file_biz.ai_prompt_detail(content)
    if resp == "-100" or resp == "-500":
      return web.json_response({"code": 500, "data": "失败，服务维护中，请稍后片刻后重试"})
    else:
      if resp["code"] == 0:
        return web.json_response({"code": 0, "data": resp["data"]}) 
      else:
        return web.json_response({"code": 500, "data": resp["data"]})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
@server.PromptServer.instance.routes.post("/zw_tools/ai_prompt_detail_query")
async def ai_prompt_detail_query(request):
  try:
    data = await request.json()
    seqNo = data["seqNo"]
    resp = zw_local_file_biz.ai_prompt_detail_query(seqNo)
    if resp == "-100" or resp == "-500":
      return web.json_response({"code": 0, "data": "失败，服务维护中，请稍后片刻后重试"})
    else:
      if resp["code"] == 0 or resp["code"] == 100:
        return web.json_response({"code": resp["code"], "data": resp["data"]}) 
      else:
        return web.json_response({"code": 500, "data": resp["data"]})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/prompt_fanyi")
async def prompt_fanyi(request):
  try:
    data = await request.json()
    content = data["content"]
    text = translate(content)
    return web.json_response({"code": 0, "data": text}) 
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  

#----------cate0----------------------------------
@server.PromptServer.instance.routes.get("/zw_tools/tags_cate0_list")
async def tags_cate0_list(request):
  try:
    parent_id = 0
    list = zw_tags_cate_biz.find_list(0)
    return web.json_response({"code": 0, "data": list}) 
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/tags_cate0_add")
async def tags_cate0_add(request):
  try:
    data = await request.json()
    cate_name = data["cate_name"]
    parent_id = data["parent_id"]
    sort_no = data["sort_no"]
    cate = 0
    zw_tags_cate_biz.insert(cate_name, cate, parent_id, sort_no)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
@server.PromptServer.instance.routes.post("/zw_tools/tags_cate0_edit")
async def tags_cate0_edit(request):
  try:
    data = await request.json()
    recordId = data["recordId"]
    cate_name = data["cate_name"]
    parent_id = data["parent_id"]
    sort_no = data["sort_no"]
    cate = 0
    zw_tags_cate_biz.update(cate_name, cate, parent_id, sort_no, recordId)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
@server.PromptServer.instance.routes.get("/zw_tools/tags_cate0_del")
async def tags_cate0_del(request):
  try:
    recordId = request.rel_url.query["recordId"]
    zw_tags_cate_biz.delete(int(recordId))
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
  
#-----------------cate1--------------------------------------
@server.PromptServer.instance.routes.get("/zw_tools/tags_cate1_list")
async def tags_cate1_list(request):
  try:
    parent_id = request.rel_url.query["parent_id"]
    list = zw_tags_cate_biz.find_list(int(parent_id))
    return web.json_response({"code": 0, "data": list}) 
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/tags_cate1_add")
async def tags_cate1_add(request):
  try:
    data = await request.json()
    cate_name = data["cate_name"]
    parent_id = data["parent_id"]
    sort_no = data["sort_no"]
    cate = 1
    zw_tags_cate_biz.insert(cate_name, cate, parent_id, sort_no)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
@server.PromptServer.instance.routes.post("/zw_tools/tags_cate1_edit")
async def tags_cate1_edit(request):
  try:
    data = await request.json()
    recordId = data["recordId"]
    cate_name = data["cate_name"]
    parent_id = data["parent_id"]
    sort_no = data["sort_no"]
    cate = 1
    zw_tags_cate_biz.update(cate_name, cate, parent_id, sort_no, recordId)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
@server.PromptServer.instance.routes.get("/zw_tools/tags_cate1_del")
async def tags_cate1_del(request):
  try:
    recordId = request.rel_url.query["recordId"]
    zw_tags_cate_biz.delete(int(recordId))
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
  
#-----------------cate2：tags--------------------------------------
@server.PromptServer.instance.routes.get("/zw_tools/tags_cate2_list")
async def tags_cate2_list(request):
  try:
    parent_id = request.rel_url.query["parent_id"]
    is_fav = request.rel_url.query["is_fav"]
    list = zw_tags_biz.find_list(int(parent_id), is_fav)
    return web.json_response({"code": 0, "data": list}) 
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
  
@server.PromptServer.instance.routes.post("/zw_tools/tags_cate2_add")
async def tags_cate2_add(request):
  try:
    data = await request.json()
    tag_name_cn = data["tag_name_cn"]
    tag_name_en = data["tag_name_en"]
    cateId0 = data["cateId0"]
    sort_no = data["sort_no"]
    example_img = data["example_img"]
    is_fav = data["is_fav"]
    zw_tags_biz.insert(tag_name_cn, tag_name_en, cateId0, sort_no, example_img, is_fav)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"})  
@server.PromptServer.instance.routes.post("/zw_tools/tags_cate2_edit")
async def tags_cate2_edit(request):
  try:
    data = await request.json()
    recordId = data["recordId"]
    tag_name_cn = data["tag_name_cn"]
    tag_name_en = data["tag_name_en"]
    cateId0 = data["cateId0"]
    sort_no = data["sort_no"]
    example_img = data["example_img"]
    is_fav = data["is_fav"]
    zw_tags_biz.update(tag_name_cn, tag_name_en, cateId0, sort_no, example_img, is_fav, recordId)
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
@server.PromptServer.instance.routes.get("/zw_tools/tags_cate2_del")
async def tags_cate2_del(request):
  try:
    recordId = request.rel_url.query["recordId"]
    zw_tags_biz.delete(int(recordId))
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 

@server.PromptServer.instance.routes.get("/zw_tools/tags_fav")
async def tags_tags_fav(request):
  try:
    recordId = request.rel_url.query["recordId"]
    is_fav = request.rel_url.query["is_fav"]
    zw_tags_biz.update_fav(is_fav, int(recordId))
    return web.json_response({"code": 0, "data": "OK"})
    
  except Exception as e:
    print(e)
    return web.json_response({"code": 500, "data": "发生异常"}) 
