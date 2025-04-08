from . import Translator
import requests
import json
import random
import re

class BaiduTranslator(Translator.TranslatorInterface):
     def translate(self,appid:str,secretKey:str,text: str) -> str:
        if not has_chinese(text) :
            print("no chinese")
            return text

        url='https://fanyi-api.baidu.com/api/trans/vip/translate'
       
        salt = generate_random_string()
        #print(f'text=={repr(text)}')
        text = text.replace("\n","\\n")
        text = text.replace("\r\n","\\r\\n")

        postdata={
            "appid":appid,
            "from": self.lang_from,
            "to": self.lang_to,
            "q": text,
            "salt": salt,# 随机数
            "sign":self.encrypt_string_to_md5(appid+text+salt+secretKey)
            }
      
        try:    
            resdata= requests.post(url,headers=self.headers,data=postdata)  
            jsonObj=json.loads(resdata.content.decode('utf-8'))
            #print(f'jsonObj=2={jsonObj}')
            if('error_code'in jsonObj):
                print(f'trans_result erro:{resdata}')
                return text
            text = jsonObj['trans_result'][0]['dst']
            #print(f'text=2={repr(text)}')
            text = text.replace(" \ r \ n ","\r\n")
            text = text.replace(" \ n ","\n")
            return text
            
        except requests.exceptions.RequestException as e:
            print(e)
            return "Internet Error:百度翻译失败，可能需要关闭网络代理.."
        
def generate_random_string():
    # 生成一个10位的随机整数
    random_number = random.randint(1000000000, 9999999999)
    # 将整数转换为字符串
    random_string = str(random_number)
    return random_string
def has_chinese(text):
    # 使用Unicode编码范围判断是否为中文字符
    chinese_regex = re.compile("[\u4e00-\u9fa5]+")
    if chinese_regex.search(text):
        return True
    else:
        return False
    
if __name__ == '__main__':
    appid='---'
    secretKey='----'
    text="红色的气球\r\n黑色的气球\r\n黑色的气球".replace("\r\n","\\r\\n")
    baidu_translator = BaiduTranslator()
    res = Translator.translate_text(baidu_translator, appid,secretKey,text)
    print(res.replace(" \ r \ n ","\r\n"))
            