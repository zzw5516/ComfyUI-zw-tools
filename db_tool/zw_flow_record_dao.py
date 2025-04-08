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
            CREATE TABLE IF NOT EXISTS flow_record
                (
                recordId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                input_texts TEXT, 
                out_images TEXT, 
                work_flow_json TEXT, 
                is_fav TEXT,
                add_time TEXT,
                upd_time TEXT
                )
            '''
            )
    conn.commit()
    c.close()
    conn.close()
def find_flow_record_list_db(pageIndex=0, keywords="", is_fav="false"):
    sql = "SELECT recordId, input_texts, out_images,is_fav FROM flow_record WHERE 1=1"
    params_list = []
   
    if keywords is not None and keywords != '':
        keywords = f"%{keywords}%"
        sql = sql + " AND input_texts LIKE ? "
        params_list.append(keywords)

    if is_fav == "true" :
        sql = sql + " AND is_fav = 'true' "

    sql = sql + " ORDER BY recordId DESC LIMIT ?,30"

    params_list.append(pageIndex*30)  
    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None

def insert_flow_record_db(input_texts,out_images,work_flow_json,is_fav,add_time,upd_time):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO flow_record (input_texts, out_images, work_flow_json, is_fav, add_time, upd_time) VALUES (?, ?, ?, ?, ?, ?)', 
              (input_texts, out_images, work_flow_json, is_fav,add_time,upd_time, ))
    conn.commit()
    c.close()
    conn.close()
def update_fav_status_db(is_fav,upd_time,recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE flow_record SET is_fav=?, upd_time=? WHERE recordId=?', 
              (is_fav,upd_time,recordId, ))
    conn.commit()
    c.close()
    conn.close()
def delete_flow_record_db(recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM flow_record WHERE recordId=?', (recordId, ))
    conn.commit()
    c.close()
    conn.close()

def del_checked_flow_record_db(checked_ids):
    sql = 'DELETE FROM flow_record WHERE recordId IN '+checked_ids
    print(sql)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql)
    conn.commit()
    c.close()
    conn.close()

def del_all_flow_record_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM flow_record')
    conn.commit()
    c.close()
    conn.close()