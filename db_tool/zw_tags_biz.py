from .zw_tags_dao import create_table_db,find_list_db,insert_db,delete_db,update_db, update_fav_db
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

def find_list(cateId0, is_fav):
    cateId1 = -1
    return find_list_db(cateId0,cateId1,is_fav)

def insert(tag_name_cn, tag_name_en, cateId0,sortNo, example_img, is_fav) -> None:
    cateId1 = ""
    reserve0 = ""
    reserve1 = ""
    reserve2 = ""
    insert_db(tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2)

def update(tag_name_cn, tag_name_en, cateId0,sortNo, example_img, is_fav, recordId):
    cateId1 = ""
    reserve0 = ""
    reserve1 = ""
    reserve2 = ""
    return update_db(tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2,recordId)
def update_fav(is_fav, recordId):
    return update_fav_db(is_fav, recordId)
def delete(recordId):
    print(f"delete recordId:{recordId}")
    return delete_db(recordId)
