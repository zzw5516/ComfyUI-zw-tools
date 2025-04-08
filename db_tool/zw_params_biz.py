from .zw_params_dao import create_table_db,find_by_name_db,insert_db,update_db
import datetime
import json
import os
import shutil
import requests
import base64
import threading

baidu_appid = "baidu_appid"
baidu_key = "baidu_key"
tuqu_key = "tuqu_key"
cate_keys_default = "cate_keys_default" #默认分类
used_trans_type = "used_trans_type" #0 禁用 1 百度 2 API_KEY
ignore_pre_type = "ignore_pre_type" #0 保存预览图记录 1 忽略预览图记录

def create_table():
    create_table_db()
    return "ok"

def find_baidu_param():
    param = find_by_name_db(baidu_key)
    if param == None:
        return ""
    else:
        return param[2]
def update_baidu_key(param_value):
    paramOld = find_by_name_db(baidu_key)
    if paramOld == None:
        insert_db(baidu_key, param_value)
    else:
        update_db(baidu_key, param_value)

def find_tuqu_param():
    param = find_by_name_db(tuqu_key)
    if param == None:
        return ""
    else:
        return param[2]

def update_tuqu_key(param_value):
    paramOld = find_by_name_db(tuqu_key)
    if paramOld == None:
        insert_db(tuqu_key, param_value)
    else:
        update_db(tuqu_key, param_value)


def find_cate_keys_default_param():
    param = find_by_name_db(cate_keys_default)
    if param == None:
        return ""
    else:
        return param[2]

def update_cate_keys_default(param_value):
    paramOld = find_by_name_db(cate_keys_default)
    if paramOld == None:
        insert_db(cate_keys_default, param_value)
    else:
        update_db(cate_keys_default, param_value)

def find_used_trans_type_param():
    param = find_by_name_db(used_trans_type)
    if param == None:
        return 0
    else:
        return int(param[2])

def update_used_trans_type(param_value):
    paramOld = find_by_name_db(used_trans_type)
    if paramOld == None:
        insert_db(used_trans_type, param_value)
    else:
        update_db(used_trans_type, param_value)

def find_ignore_pre_type_param():
    param = find_by_name_db(ignore_pre_type)
    if param == None:
        return 0
    else:
        return int(param[2])

def update_ignore_pre_type(param_value):
    paramOld = find_by_name_db(ignore_pre_type)
    if paramOld == None:
        insert_db(ignore_pre_type, param_value)
    else:
        update_db(ignore_pre_type, param_value)

def find_baidu_appid_param():
    param = find_by_name_db(baidu_appid)
    if param == None:
        return 0
    else:
        return int(param[2])

def update_baidu_appid(param_value):
    paramOld = find_by_name_db(baidu_appid)
    if paramOld == None:
        insert_db(baidu_appid, param_value)
    else:
        update_db(baidu_appid, param_value)

