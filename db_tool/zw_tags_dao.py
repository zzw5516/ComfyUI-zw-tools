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
            CREATE TABLE IF NOT EXISTS tags
                (
                recordId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                tag_name_cn TEXT, 
                tag_name_en TEXT, 
                cateId0 INTEGER, 
                cateId1 INTEGER, 
                sortNo INTEGER, 
                example_img TEXT,
                is_fav TEXT,
                reserve0 TEXT,
                reserve1 TEXT,
                reserve2 TEXT
                )
            '''
            )
    conn.commit()
    c.close()
    conn.close()
def find_list_db(cateId0=0, cateId1=-1, is_fav=""):
    sql = "SELECT recordId, tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2 FROM tags WHERE 1=1"
    params_list = []
   
    if cateId0 > -1 :
        sql = sql + " AND cateId0 = ? "
        params_list.append(cateId0)

    if cateId1 > -1 :
        sql = sql + " AND cateId1 = ? "
        params_list.append(cateId1)
    if is_fav != "":
        sql = sql + " AND is_fav = ? "
        params_list.append(is_fav)

    sql = sql + " ORDER BY sortNo ASC"
    
    params  = tuple(params_list)    # 将列表转换为元组

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(sql, params)
    data = c.fetchall()
    c.close()
    conn.close()
    return data if data else None

def insert_db(tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO tags (tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2) VALUES (?,?,?,?,?,  ?,?,?,?,?)', 
              (tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2, ))
    conn.commit()
    c.close()
    conn.close()
def update_db(tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2,recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE tags SET tag_name_cn=?, tag_name_en=?,cateId0=?, cateId1=?, sortNo=?, example_img=?, is_fav=?, reserve0=?, reserve1=?, reserve2=? WHERE recordId=?', 
              (tag_name_cn, tag_name_en, cateId0, cateId1, sortNo, example_img, is_fav, reserve0,reserve1,reserve2,recordId, ))
    conn.commit()
    c.close()
    conn.close()
def update_fav_db(is_fav, recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE tags SET is_fav=? WHERE recordId=?', 
              (is_fav, recordId, ))
    conn.commit()
    c.close()
    conn.close()
def delete_db(recordId):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM tags WHERE recordId=?', (recordId, ))
    conn.commit()
    c.close()
    conn.close()
def delete_by_cateId0_db(cateId0):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DELETE FROM tags WHERE cateId0=?', (cateId0, ))
    conn.commit()
    c.close()
    conn.close()