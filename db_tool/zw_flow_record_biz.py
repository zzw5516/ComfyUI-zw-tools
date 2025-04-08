from .zw_flow_record_dao import create_table_db,find_flow_record_list_db,insert_flow_record_db,delete_flow_record_db,update_fav_status_db,del_checked_flow_record_db,del_all_flow_record_db
import datetime
import json

def create_table():
    create_table_db()
    return "ok"

def find_flow_record_list(pageIndex=0, keywords="", is_fav="false"):
    return find_flow_record_list_db(pageIndex,keywords,is_fav)

def insert_flow_record(input_texts,out_images,work_flow_json):
    is_fav = "false"
    add_time = getCurrTime()    #yyyy-MM-dd HH:mm:ss 获取当前时间
    upd_time = getCurrTime()    #yyyy-MM-dd HH:mm:ss 获取当前时间

    input_texts = json.dumps(input_texts) #json转str
    out_images = json.dumps(out_images) #json转str
    work_flow_json = json.dumps(work_flow_json) #json转str

    return insert_flow_record_db(input_texts,out_images,work_flow_json,is_fav, add_time,upd_time)

def update_fav_status(is_fav,recordId):
    upd_time = getCurrTime()    #yyyy-MM-dd HH:mm:ss 获取当前时间
    return update_fav_status_db(is_fav,upd_time,recordId)

def delete_flow_record(recordId):
    return delete_flow_record_db(recordId)

def del_checked_flow_record(checked_ids):
    print(f'checked_ids=={checked_ids}')
    checked_ids = f'({checked_ids})'
    return del_checked_flow_record_db(checked_ids)
def del_all_flow_record():
    return del_all_flow_record_db()

def getCurrTime():
    # 获取当前日期和时间
    current_time = datetime.datetime.now()

    # 格式化并打印当前时间
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S:%fff")
    return formatted_time