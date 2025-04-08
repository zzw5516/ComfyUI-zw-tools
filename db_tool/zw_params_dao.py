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
            CREATE TABLE IF NOT EXISTS params
                (
                recordId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                param_name TEXT, 
                param_value TEXT
                )
            '''
            )
    conn.commit()
    c.close()
    conn.close()
def find_by_name_db(param_name):
    sql = "SELECT recordId, param_name, param_value FROM params WHERE "
    params_list = []
    
    sql = sql + " param_name = ? "
    params_list.append(param_name)
    
    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data[0] if data else None

def insert_db(param_name, param_value):
    upload_state = 0
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO params (param_name, param_value) VALUES (?,?)', 
              (param_name, param_value, ))
    conn.commit()
    c.close()
    conn.close()
def update_db(param_name, param_value):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE params SET param_value=? WHERE param_name=?', 
              (param_value, param_name, ))
    conn.commit()
    c.close()
    conn.close()

def delete_db(param_name):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM params WHERE param_name=?', (param_name, ))
    conn.commit()
    c.close()
    conn.close()
