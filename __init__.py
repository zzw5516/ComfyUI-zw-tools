from .NodeZwTools import *

WEB_DIRECTORY = "./"
NODE_CLASS_MAPPINGS = {
    'ZwPrompt': ZwPrompt,
    'ZwPromptText': ZwPromptText
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "ZwPrompt": "ZwPrompt",
    "ZwPromptText": "ZwPromptText"
}

# import folder_paths
# import shutil
# comfy_path = os.path.dirname(folder_paths.__file__)
# extension_path = os.path.join(comfy_path, 'custom_nodes','comfyui-zw-tools')
# upload_panel_path_dir = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/js/')
# css_path_dir = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/css/')
# os.makedirs(css_path_dir, exist_ok=True)
# os.makedirs(upload_panel_path_dir, exist_ok=True)

# mycss_path = os.path.join(extension_path, 'ui/css/zw.css')
# css_path = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/css/zw.css')
# shutil.copy(mycss_path, css_path)

# jqery_path_f = os.path.join(extension_path,'ui/js/jquery.min.js')
# jqery_path_t = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/js/jquery.min.js')
# shutil.copy(jqery_path_f, jqery_path_t)

# upload_panel_path_f = os.path.join(extension_path,'ui/js/upload-panel.js')
# upload_panel_path_t = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/js/upload-panel.js')
# shutil.copy(upload_panel_path_f, upload_panel_path_t)

# node_prompt_path_f = os.path.join(extension_path,'ui/js/node-prompt.js')
# node_prompt_path_t = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/js/node-prompt.js')
# shutil.copy(node_prompt_path_f, node_prompt_path_t)

# image_browser_path_f = os.path.join(extension_path,'ui/js/image-browser.js')
# image_browser_path_t = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/js/image-browser.js')
# shutil.copy(image_browser_path_f, image_browser_path_t)

# tags_path_f = os.path.join(extension_path,'ui/js/tags.js')
# tags_path_t = os.path.join(comfy_path, "web",'extensions/comfyui-zw-tools/ui/js/tags.js')
# shutil.copy(tags_path_f, tags_path_t)

from .db_tool import zw_params_biz
zw_params_biz.create_table()
from .db_tool import zw_flow_record_biz
zw_flow_record_biz.create_table()
from .db_tool import zw_local_file_biz
zw_local_file_biz.create_table()
from .db_tool import zw_tags_cate_biz
zw_tags_cate_biz.create_table()
from .db_tool import zw_tags_biz
zw_tags_biz.create_table()

# from server import PromptServer
# # 获取插件目录路径
# plugin_dir = os.path.dirname(os.path.abspath(__file__))
# assets_path = os.path.join(plugin_dir, "ui")

# # 让 ComfyUI 加载自定义 JS 和 CSS
# def get_custom_styles():
#     return [f"/custom_nodes/ComfyUI-zw-tools/ui/css/zw.css"]

# def get_custom_scripts():
#     return [f"/custom_nodes/ComfyUI-zw-tools/ui/js/jquery.min.js"]

# PromptServer.instance.script_paths += get_custom_scripts()
# PromptServer.instance.style_paths += get_custom_styles()

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS','WEB_DIRECTORY']