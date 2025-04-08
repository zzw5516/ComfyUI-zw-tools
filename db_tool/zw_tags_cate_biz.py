from .zw_tags_cate_dao import create_table_db,find_list_db,find_by_id_db,delete_by_parent_id_db,insert_db,delete_db,update_db,find_by_name_db
from .zw_tags_dao import delete_by_cateId0_db
import datetime
import json
import os
import shutil
import requests
import base64
import threading

def create_table():
    create_table_db()
    return "ok"

def find_list(parent_id=-1):
    cate = -1
    return find_list_db(cate, parent_id)

def find_by_name(cate_name, cate):
    return find_by_name_db(cate_name, cate)

def insert(cate_name, cate, parent_id, sort_no) -> None:
    insert_db(cate_name, cate, parent_id, sort_no)

def update(cate_name, cate, parent_id, sort_no,recordId):
    return update_db(cate_name, cate, parent_id, sort_no,recordId)

def delete(recordId) -> None:

    cate = find_by_id_db(recordId)
    if cate[3] == 0: #'parent_id'
        cate = -1
        childList = find_list_db(cate, recordId)
        if childList != None:
            for child in childList:
                childId = child[0]
                delete_by_cateId0_db(child[0])
    else:
        delete_by_cateId0_db(recordId)
    delete_db(recordId)
    delete_by_parent_id_db(recordId)
def getCurrTime():
    # 获取当前日期和时间
    current_time = datetime.datetime.now()

    # 格式化并打印当前时间
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S:%fff")
    return formatted_time