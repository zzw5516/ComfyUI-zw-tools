import sqlite3
import os

# 获取脚本文件的完整路径  
script_path = os.path.abspath(__file__)  
# 获取脚本文件所在的目录  
script_dir = os.path.dirname(script_path)  
DB_PATH = script_dir+'/zw_tools_tags.db'

def create_table_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
            '''
            CREATE TABLE IF NOT EXISTS tags_cate
                (
                recordId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                cate_name TEXT, 
                cate INTEGER, 
                parent_id INTEGER, 
                sort_no INTEGER
                )
            '''
            )
    conn.commit()
    c.close()
    conn.close()
def find_list_db(cate=-1, parent_id=-1):
    sql = "SELECT recordId, cate_name, cate, parent_id, sort_no FROM tags_cate WHERE 1=1 "

    params_list = []

    if cate > -1:
        sql = sql + " AND cate = ? "
        params_list.append(cate)

    if parent_id > -1:
        sql = sql + " AND parent_id = ? "
        params_list.append(parent_id)

    params  = tuple(params_list)    # 将列表转换为元组
    sql = sql + " ORDER BY sort_no ASC "

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None
def find_by_id_db(recordId):
    sql = "SELECT recordId, cate_name, cate, parent_id, sort_no FROM tags_cate WHERE 1=1 "

    params_list = []
    
    sql = sql + " AND recordId = ? "
    params_list.append(recordId)

    params  = tuple(params_list)    # 将列表转换为元组
    sql = sql + " ORDER BY sort_no ASC "

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data[0] if data else None
def find_by_name_db(cate_name, cate):
    sql = "SELECT recordId, cate_name, cate, parent_id, sort_no FROM tags_cate WHERE 1=1 "

    params_list = []
    
    sql = sql + " AND cate_name = ? "
    params_list.append(cate_name)
    sql = sql + " AND cate = ? "
    params_list.append(cate)

    params  = tuple(params_list)    # 将列表转换为元组
    sql = sql + " ORDER BY sort_no ASC "

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data[0] if data else None
def insert_db(cate_name, cate, parent_id, sort_no):
    upload_state = 0
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO tags_cate (cate_name, cate, parent_id, sort_no) VALUES (?,?,?,?)', 
              (cate_name, cate, parent_id, sort_no, ))
    conn.commit()
    c.close()
    conn.close()
def update_db(cate_name, cate, parent_id, sort_no,recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE tags_cate SET cate_name=?, cate=?, parent_id=?, sort_no=? WHERE recordId=?', 
              (cate_name, cate, parent_id, sort_no,recordId, ))
    conn.commit()
    c.close()
    conn.close()

def delete_db(recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM tags_cate WHERE recordId=?', (recordId, ))
    conn.commit()
    c.close()
    conn.close()
def delete_by_parent_id_db(parent_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM tags_cate WHERE parent_id=?', (parent_id, ))
    conn.commit()
    c.close()
    conn.close()
