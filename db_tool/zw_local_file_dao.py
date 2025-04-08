import sqlite3
import os

# 获取脚本文件的完整路径  
script_path = os.path.abspath(__file__)  
# 获取脚本文件所在的目录  
script_dir = os.path.dirname(script_path)  
DB_PATH = script_dir+'/zw_tools_local.db'

def create_table_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
            '''
            CREATE TABLE IF NOT EXISTS local_file
                (
                recordId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                input_texts TEXT, 
                filename TEXT, 
                work_flow_json TEXT, 
                subfolder TEXT, 
                type TEXT,
                is_fav TEXT,
                add_time TEXT,
                upd_time TEXT,
                prompt_id TEXT,
                upload_state INTEGER,
                cate_keys TEXT,
                is_gui_dang INTEGER DEFAULT 0
                )
            '''
            )
    conn.commit()
    c.close()
    conn.close()
def find_list_db(pageIndex=0, keywords="", is_fav="false", is_un_upload="-1", add_time='', cate_keys='', is_gui_dang="-1", page_size=20 ):
    sql = "SELECT recordId, input_texts, filename, work_flow_json, subfolder, type, is_fav,prompt_id,upload_state,cate_keys,is_gui_dang FROM local_file WHERE 1=1"
    params_list = []

    if is_fav == "true" :
        sql = sql + " AND is_fav = 'true' "
    if is_un_upload != "-1" :
        sql = sql + " AND upload_state = "+is_un_upload
    if is_gui_dang != "-1" :
        sql = sql + " AND is_gui_dang = "+is_gui_dang

    if add_time is not None and add_time != '':
        sql = sql + " AND add_time >= ? "
        sql = sql + " AND add_time <= ? "
        add_time_min = add_time + " 00:00:00"
        add_time_max = add_time + " 23:59:59"
        params_list.append(add_time_min)
        params_list.append(add_time_max)

    if keywords is not None and keywords != '':
        keywords = f"%{keywords}%"
        sql = sql + " AND input_texts LIKE ?"
        params_list.append(keywords)

    if cate_keys is not None and cate_keys != '':
        cate_keys = f"%{cate_keys}%"
        sql = sql + " AND cate_keys LIKE ?"
        params_list.append(cate_keys)

    sql = sql + " ORDER BY recordId DESC LIMIT ?,?"

    params_list.append(pageIndex*page_size)  
    params_list.append(page_size)  

    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None

def find_list_guidang_db(num=2000, is_gui_dang=-1):
    sql = "SELECT recordId, filename, subfolder, type, add_time FROM local_file WHERE type='output'"
    params_list = []
    
    if is_gui_dang != -1 :
        sql = sql + " AND is_gui_dang = ?"
        params_list.append(is_gui_dang)  
    sql = sql + " ORDER BY recordId DESC LIMIT 0,?"
    params_list.append(num)  
    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None

def find_by_id_db(recordId):
    sql = "SELECT recordId, input_texts, filename, work_flow_json, subfolder, type, is_fav,prompt_id,upload_state,cate_keys FROM local_file WHERE"
    params_list = []
    
    sql = sql + " recordId = ? "
    params_list.append(recordId)
    sql = sql + " ORDER BY recordId DESC LIMIT 0,1"
    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data[0] else None
def find_count_db(keywords="", is_fav="false", is_un_upload="-1", add_time='', cate_keys='', is_gui_dang="-1"):
    sql = "SELECT COUNT(recordId) FROM local_file WHERE 1=1"
    params_list = []
   
    if is_fav == "true" :
        sql = sql + " AND is_fav = 'true' "
    if is_un_upload != "-1" :
        sql = sql + " AND upload_state = "+is_un_upload
    if is_gui_dang != "-1" :
        sql = sql + " AND is_gui_dang = "+is_gui_dang

    if add_time is not None and add_time != '':
        sql = sql + " AND add_time >= ? "
        sql = sql + " AND add_time <= ? "
        add_time_min = add_time + " 00:00:00"
        add_time_max = add_time + " 23:59:59"
        params_list.append(add_time_min)
        params_list.append(add_time_max)

    if keywords is not None and keywords != '':
        keywords = f"%{keywords}%"
        sql = sql + " AND input_texts LIKE ?"
        params_list.append(keywords)

    if cate_keys is not None and cate_keys != '':
        cate_keys = f"%{cate_keys}%"
        sql = sql + " AND cate_keys LIKE ?"
        params_list.append(cate_keys)

    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None

def find_list_by_ids_db(recordIds):
    sql = "SELECT recordId, filename, subfolder, type, prompt_id, work_flow_json, input_texts, is_fav,cate_keys FROM local_file WHERE recordId IN "+recordIds
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None
def insert_db(input_texts, filename, work_flow_json,subfolder,img_type,is_fav,add_time,upd_time,prompt_id,cate_keys):
    upload_state = 0
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO local_file (input_texts, filename, work_flow_json, subfolder,type,is_fav, add_time, upd_time,prompt_id,upload_state,cate_keys) VALUES (?, ?, ?, ?, ?,  ?,?,?,?,?,?)', 
              (input_texts, filename, work_flow_json,subfolder,img_type,is_fav,add_time,upd_time,prompt_id,upload_state,cate_keys, ))
    conn.commit()
    c.close()
    conn.close()
def update_fav_status_db(is_fav,upd_time,recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE local_file SET is_fav=?, upd_time=? WHERE recordId=?', 
              (is_fav,upd_time,recordId, ))
    conn.commit()
    c.close()
    conn.close()

def update_type_db(subfolder_db, filename_new, recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE local_file SET type="output",subfolder=?,filename=? WHERE recordId =?',
              (subfolder_db, filename_new, recordId, ))
    conn.commit()
    c.close()
    conn.close()

def update_upload_state_db(recordIds, state):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE local_file SET upload_state='+str(state)+' WHERE recordId IN '+recordIds)
    conn.commit()
    c.close()
    conn.close()
def update_work_flow_db(workflow, recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE local_file SET work_flow_json=? WHERE recordId = ?',
              (workflow, recordId, ))
    conn.commit()
    c.close()
    conn.close()

def update_cate_keys_db(cate_keys, recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE local_file SET cate_keys=? WHERE recordId = ?',
              (cate_keys, recordId, ))
    conn.commit()
    c.close()
    conn.close()

def update_gui_dang_db(subfolder, is_gui_dang, recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE local_file SET subfolder=?, is_gui_dang=? WHERE recordId=?', 
              (subfolder, is_gui_dang, recordId, ))
    conn.commit()
    c.close()
    conn.close()
def delete_db(recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM local_file WHERE recordId=?', (recordId, ))
    conn.commit()
    c.close()
    conn.close()

def del_checked_db(checked_ids):
    sql = 'DELETE FROM local_file WHERE recordId IN '+checked_ids
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql)
    conn.commit()
    c.close()
    conn.close()
