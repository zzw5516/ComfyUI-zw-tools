from .zw_local_file_dao import create_table_db,find_list_db,find_by_id_db,insert_db,delete_db,update_fav_status_db,update_work_flow_db,update_cate_keys_db,del_checked_db,find_list_by_ids_db,update_type_db,find_count_db,update_upload_state_db,find_list_guidang_db,update_gui_dang_db
from .zw_params_dao import find_by_name_db

import datetime
import json
import os
import shutil
import requests
import base64
import threading

import ffmpeg
import re
import time

#remote_api_uri = "http://localhost:8080/ai_comfyui/"
remote_api_uri = "https://www.ai8808.com/"

def create_table():
    create_table_db()
    return "ok"

def find_list(pageIndex=0, keywords="", is_fav="false", is_un_upload="-1", add_time="", cate_keys="", page_size=20):
    return find_list_db(pageIndex,keywords,is_fav,is_un_upload, add_time, cate_keys, "-1", page_size)
def find_by_id(recordId):
    return find_by_id_db(recordId)
def find_count(keywords="", is_fav="false", is_un_upload="-1", add_time="", cate_keys=""):
    total_count = find_count_db(keywords,is_fav,is_un_upload, add_time, cate_keys, "-1")
    return total_count[0][0]
def insert(input_texts,out_images,work_flow_json,prompt_id) -> None:
    cate_keys = find_by_name_db("cate_keys_default")
    if cate_keys == "" or cate_keys == None:
        cate_keys = "其他"
    else :
        cate_keys = cate_keys[2]

    ignore_pre_type = find_by_name_db("ignore_pre_type")
    if ignore_pre_type == None:
        ignore_pre_type = 0
    else :
        ignore_pre_type = int(ignore_pre_type[2])

    is_fav = "false"
    add_time = getCurrTime()    #yyyy-MM-dd HH:mm:ss 获取当前时间
    upd_time = getCurrTime()    #yyyy-MM-dd HH:mm:ss 获取当前时间
    #json_array = json.loads(out_images) //str转json
    #print(type(out_images))
    json_array = out_images 
    input_texts = json.dumps(input_texts) #json转str
    work_flow_json = json.dumps(work_flow_json) #json转str
   

    current_dir = os.getcwd()
    sub_dir_day = getCurrDay()
    for item in json_array:
        # 访问每个字典中的值  
        filename = item["filename"]  
        subfolder = item["subfolder"] 
        file_type = item["type"] 

        #不保存预览图时跳过
        if ignore_pre_type == 1 and file_type == "temp":
            continue
        
        insert_db(input_texts,filename,work_flow_json, subfolder, file_type, is_fav, add_time,upd_time,prompt_id,cate_keys)

def update_fav_status(is_fav,recordId):
    upd_time = getCurrTime()    #yyyy-MM-dd HH:mm:ss 获取当前时间
    return update_fav_status_db(is_fav,upd_time,recordId)

def update_upload_state(checked_ids):
    checked_ids = f'({checked_ids})'
    checked_ids = checked_ids.replace("[",'').replace("]",'')
    update_upload_state_db(checked_ids)
def update_work_flow(workflow, recordId):
    update_work_flow_db(workflow, recordId)
def update_cate_keys(cate_keys, checked_ids):
    cate_keys = f'{cate_keys}'.replace("[",'').replace("]",'')

    for recordId in checked_ids:
        update_cate_keys_db(cate_keys, recordId)
def delete(recordId):
    return delete_db(recordId)

def del_checked(checked_ids):
    checked_ids = f'({checked_ids})'
    checked_ids = checked_ids.replace("[",'').replace("]",'')
    listData = find_list_by_ids_db(checked_ids)

    for item in listData:
        delLocalFile(item)

    return del_checked_db(checked_ids)

def move_tmp_output(checked_ids):
    checked_ids = f'({checked_ids})'
    checked_ids = checked_ids.replace("[",'').replace("]",'')
    listData = find_list_by_ids_db(checked_ids) 

    current_dir = os.getcwd() 
    for item in listData:
        recordId = item[0]
        filename = item[1]
        subfolder = item[2]
        file_type = item[3]

        filename_new = getCurrTimefff()+".png"
        end_path_type = 'image'
        if filename.endswith(".mp4"):
            end_path_type = 'video'
            filename_new = getCurrTimefff()+".mp4"
        file = os.path.join(current_dir, file_type, subfolder, filename)
        if os.path.exists(file):
            move_dir_day = os.path.join(current_dir, 'output', subfolder, )
            os.makedirs(move_dir_day, exist_ok=True) 
            shutil.move(file, os.path.join(move_dir_day, filename_new))
            update_type_db(subfolder, filename_new, recordId)

def delLocalFile(item):
    filename = item[1]
    subfolder = item[2]
    file_type = item[3]

    # 获取当前工作目录  
    current_dir = os.getcwd()  
    file = os.path.join(current_dir, file_type, subfolder, filename)
    if os.path.exists(file):
        print(f"remove 当前file: {file}")
        os.remove(file)

    if filename.endswith(".mp4"): #移除视频缩略图
        filename_new = filename.split('.')[0]+".png"
        thumbnail_file = os.path.join(current_dir, file_type, subfolder, filename_new)
        if os.path.exists(thumbnail_file):
            print(f"remove 当前thumbnail_file: {thumbnail_file}")
            os.remove(thumbnail_file)

def upload_local_file(checked_ids):
    try:
        checked_ids = f'({checked_ids})'
        checked_ids = checked_ids.replace("[",'').replace("]",'')

        api_key = find_by_name_db("tuqu_key")[2]
        respData = upload_file_check(api_key)
        if respData == "-100" or respData == "-500":
            return {"code": 500, "data": "网络异常，上传失败"}
        
        if respData["code"] != 0:
            return respData

        update_upload_state_db(checked_ids, 1)

        thread = threading.Thread(target=do_upload_multi_files_by_thread, args=(checked_ids,))
        thread.start()
        return {"code": 0, "data": ""}
    except Exception as e:
        print(f"发生异常:{e}")
        return {"code": 500, "data": "发生异常，上传失败"}
        
def do_upload_multi_files_by_thread(checked_ids):
    try:
        listData = find_list_by_ids_db(checked_ids) 
        api_key = find_by_name_db("tuqu_key")[2]

       

        url_upload_file = remote_api_uri+"api_comfyui/upload_file"
        url_upload_info = remote_api_uri+"api_comfyui/upload_info"

        current_dir = os.getcwd()  
        for item in listData:
            filename = item[1]
            subfolder = item[2]
            file_type = item[3]
            
            file = os.path.join(current_dir, file_type, subfolder, filename)
            if os.path.exists(file):

                if filename.endswith(".mp4"):
                    print("文件是 MP4 格式")
                    upload_by_video(item, url_upload_file,url_upload_info, api_key)
                else:
                    print("文件不是 MP4 格式")
                    upload_by_img(item, file, url_upload_file,url_upload_info, api_key)
                
        update_upload_state_db(checked_ids, 2)
    except Exception as e:
        print(f"do_upload_multi_files_by_thread发生异常:{e}")
def upload_by_video(item, url_upload_file,url_upload_info, api_key):
    current_dir = os.getcwd()  
    filename = item[1]
    subfolder = item[2]
    file_type = item[3]
    file = os.path.join(current_dir, file_type, subfolder, filename)
    #文件名去除后缀
    filename_video_thumb = filename.split('.')[0] + ".png"
    video_thumb = os.path.join(current_dir, file_type, subfolder, filename_video_thumb)
    if os.path.exists(video_thumb) == False:
        get_thumbnail(file, video_thumb)

    respData = upload_file(video_thumb, url_upload_file, api_key) #先单独上传文件
    print(f"####upload v_file-img/{filename_video_thumb}:resp:{respData}:type:{type(respData)}")
    if respData == "-100" or respData == "-500":
        return
    return_filename_thumb = respData["data"]

    #上传
    respData = upload_file(file, url_upload_file, api_key) #先单独上传文件
    print(f"####upload v_file/{filename}:resp:{respData}:type:{type(respData)}")
    
    if respData == "-100" or respData == "-500":
        return
    return_filename = respData["data"]
    # 使用base64进行编码
    flow_data = {
        "filename": return_filename,
        "filenameThumb": return_filename_thumb,
        "flowData": item
    }
    # 将Python字典转换为JSON字符串  
    json_str = json.dumps(flow_data)
    base64FlowData = base64.b64encode(json_str.encode('utf-8')).decode('utf-8')
    upload_result(url_upload_info, api_key, base64FlowData)#再更新文件信息

def upload_by_img(item,file, url_upload_file,url_upload_info, api_key):
    filename = item[1]
    #上传
    respData = upload_file(file, url_upload_file, api_key) #先单独上传文件
    print(f"####upload tmp_file/{filename}:resp:{respData}:type:{type(respData)}")
    
    if respData == "-100" or respData == "-500":
        return
    return_filename = respData["data"]
    # 使用base64进行编码
    flow_data = {
        "filename": return_filename,
        "flowData": item
    }
    # 将Python字典转换为JSON字符串  
    json_str = json.dumps(flow_data)
    base64FlowData = base64.b64encode(json_str.encode('utf-8')).decode('utf-8')
    upload_result(url_upload_info, api_key, base64FlowData)#再更新文件信息

def upload_file(file_path, url, api_key): 
    try:
        headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
        }  
        # 打开文件以二进制模式读取  
        with open(file_path, 'rb') as file:  
            # 发送POST请求，使用文件内容作为请求体  
            response = requests.post(url,  
                             files={'file': file},  
                             headers=headers,
                             stream=True,  # 允许分块传输 
                             timeout=180) #180s
        
        # 检查响应状态码，如果是 200 则表示上传成功  
        if response.status_code == 200:  
            data = response.json()
            return data
        else:  
            print(f"请求失败，状态码：{response.status_code}")  
            return "-100"
    except requests.exceptions.RequestException as e:
        print(f"upload_file发生异常:{e}")
        return "-500"


def upload_result(url_upload, api_key, base64FlowData):
    headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
     } 
    data = {
        'base64FlowData': base64FlowData,
    }
    try:
        response = requests.post(url_upload, headers=headers, json=data, timeout=40)
        
        if response.status_code == 200:
            resp = response.json()
            #logger.info("上传数据成功：", resp)
            return resp
        else:
            print(f"请求失败，状态码：{response.status_code}")
            return "-100"

    except requests.exceptions.RequestException as e:
        print(f"upload_result发生异常:{e}")
        return "-500"
    
def upload_file_check(api_key):

    try:
        url = remote_api_uri+"api_comfyui/upload_check"
        print(f"####upload_check:{url}")
        headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
        }  
        data = {
            'content': ""
        }
        response = requests.post(url, headers=headers, json=data, timeout=60)
        if response.status_code == 200:
            resp = response.json()
            #logger.info("上传数据成功：", resp)
            return resp
        else:
            print(f"请求失败，状态码：{response.status_code}")
            return "-100"
    except requests.exceptions.RequestException as e:
        print(f"upload_file_check:{e}")
        return "-500"   

def ai_prompt_detail(content):
    api_key = find_by_name_db("tuqu_key")[2]
    url_ai_prompt_detail = remote_api_uri+"api_comfyui/ai_prompt_detail"
    headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
    } 
    data = {
        'content': content,
    }
    try:
        response = requests.post(url_ai_prompt_detail, headers=headers, json=data, timeout=60)
        if response.status_code == 200:
            resp = response.json()
            #logger.info("上传数据成功：", resp)
            return resp
        else:
            print(f"请求失败，状态码：{response.status_code}")
            return "-100"

    except requests.exceptions.RequestException as e:
        print(f"发生异常:{e}")
        return "-500"
def ai_prompt_detail_query(seqNo):
    api_key = find_by_name_db("tuqu_key")[2]
    url_ai_prompt_detail = remote_api_uri+"api_comfyui/ai_prompt_detail_query"
    headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
    } 
    data = {
        'seqNo': seqNo,
    }
    try:
        response = requests.post(url_ai_prompt_detail, headers=headers, json=data, timeout=60)
        if response.status_code == 200:
            resp = response.json()
            #logger.info("上传数据成功：", resp)
            return resp
        else:
            print(f"请求失败，状态码：{response.status_code}")
            return "-100"

    except requests.exceptions.RequestException as e:
        print(f"发生异常:{e}")
        return "-500"
def transCN2EN(content):
    if not has_chinese(content) :
        print("no chinese")
        return content


    api_key = find_by_name_db("tuqu_key")[2]
    url_ai_prompt_detail = remote_api_uri+"api_comfyui/trans_cn_to_en"
    headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
    } 
    data = {
        'content': content,
    }
    try:
        response = requests.post(url_ai_prompt_detail, headers=headers, json=data, timeout=80)
        if response.status_code == 200:
            resp = response.json()
            #logger.info("上传数据成功：", resp)
            if resp["code"] == 0:
                return resp["data"]
            else:
                return content
        else:
            print(f"请求失败，状态码：{response.status_code}")
            return "-100"

    except requests.exceptions.RequestException as e:
        print(f"发生异常:{e}")
        return "-500"
    
def has_chinese(text):
    # 使用Unicode编码范围判断是否为中文字符
    chinese_regex = re.compile("[\u4e00-\u9fa5]+")
    if chinese_regex.search(text):
        return True
    else:
        return False

def api_key_test(api_key):
    url_ai_prompt_detail = remote_api_uri+"api_comfyui/api_key_test"
    # print(f"url_ai_prompt_detail===={url_ai_prompt_detail}, api_key===={api_key}")
    headers = {    
            'x-api-key': api_key  # 将校验和作为头部发送  
    } 
    data = {
        'content': "",
    }
    try:
        response = requests.post(url_ai_prompt_detail, headers=headers, json=data, timeout=40)
        if response.status_code == 200:
            resp = response.json()
            #logger.info("上传数据成功：", resp)
            print(f"ZwTools:api_key_test resp===={resp}")
            return resp
        else:
            print(f"请求失败，状态码：{response.status_code}")
            return "-100"

    except requests.exceptions.RequestException as e:
        print(f"发生异常:{e}")
        return "-500"

def getCurrTime():
    # 获取当前日期和时间
    current_time = datetime.datetime.now()

    # 格式化并打印当前时间
    #formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S:%fff")
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
    return formatted_time
def getCurrDay():
    # 获取当前日期和时间
    current_time = datetime.datetime.now()

    # 格式化并打印当前时间
    formatted_time = current_time.strftime("%Y-%m-%d")
    return formatted_time

def getCurrTimefff():
    # 获取当前日期和时间
    current_time = datetime.datetime.now()

    # 格式化并打印当前时间
    formatted_time = current_time.strftime("%Y%m%d%H%M%S%fff")
    return formatted_time
def get_thumbnail(input_video_path, output_image_path):
    (
        ffmpeg
        .input(input_video_path)
        .output(output_image_path, vframes=1)
        .run()
    )

def file_gui_dang(): 
    listData = find_list_guidang_db(50, 0)
    if listData == None:
        return {"code": 100, "data": "均已归档，没有需要归档的文件"}

    thread = threading.Thread(target=file_gui_dang_by_thread)
    thread.start()

    return {"code": 0, "data": "OK"}

def file_gui_dang_by_thread():
    listData = find_list_guidang_db(50, 0)
    current_dir = os.getcwd()
    while listData != None:
        for item in listData:
            recordId = item[0]
            filename = item[1]
            subfolder = item[2]
            file_type = item[3]
            add_time = item[4]

            #将‘yyyy-MM-dd HH:mm:ss’ 字符串转换 成‘yyyy-MM-dd’格式字符串
            sub_dir_day = add_time.split(' ')[0]
            bak = 'bak'

            end_path_type = 'image'
            if filename.endswith(".mp4"):
                end_path_type = 'video'
            file = os.path.join(current_dir, file_type, subfolder, filename)
            if os.path.exists(file):
                move_dir_day = os.path.join(current_dir, file_type, subfolder, bak, sub_dir_day, end_path_type)
                os.makedirs(move_dir_day, exist_ok=True)
                shutil.move(file, os.path.join(move_dir_day, filename))
               
            #截取filename文件名，不要后缀,生成视频时自带的缩略图
            filename_new = filename.split('.')[0]+".png"
            fileThumb = os.path.join(current_dir, file_type, subfolder, filename_new)    
            if os.path.exists(fileThumb):
                move_dir_day = os.path.join(current_dir, file_type, subfolder, bak, sub_dir_day, end_path_type)
                os.makedirs(move_dir_day, exist_ok=True)
                shutil.move(fileThumb, os.path.join(move_dir_day, filename_new))
            
            subfolder_db = f'{bak}/{sub_dir_day}/{end_path_type}/'
            if subfolder != "":
                subfolder_db = f'{subfolder}/{bak}/{sub_dir_day}/{end_path_type}/'

            print(f'filename={filename}-->subfolder={subfolder_db}')    

            update_gui_dang_db(subfolder_db, 1, recordId)

        listData = find_list_guidang_db(50, 0)