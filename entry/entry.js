//@ts-ignore
import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";
//import { uploadPanel } from "../comfyui-zw-tools/ui/js/upload-panel.js";
import { nodePrompt } from "../ui/js/node-prompt.js";
import { imageBrowser } from "../ui/js/image-browser.js";
import { zwTags } from "../ui/js/tags.js";

let prompt_id = 0;
const ext = {
	// Unique name for the extension
	name: "zw_tools.LoggingExtension",
	async init(app) {
		// Any initial setup to run as soon as the page loads
	},
	async setup(app) {
		//console.log("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
		// Any setup to run after the app is created
		//console.log("[logging]", "extension setup");
		let allImages = [];

		const _original_graphToPrompt = app.graphToPrompt;
        app.graphToPrompt = async function () {
            const p = structuredClone(await _original_graphToPrompt.apply(app));
            return p;
        };
		api.addEventListener("execution_start", (e) => {
			//console.log("=============================api.execution_start=============================",e.detail);
			prompt_id = e.detail.prompt_id;
		});
		api.addEventListener("executing", async (e) => {
			//console.log("=============================api.executing=============================");
			
			if(e.detail === null) {
				let tmp_prompt_id = prompt_id;
				//console.log("==============completed=============="+e.target.initialClientId);
				const res = await fetch('/history/' + tmp_prompt_id)
				const jsonData = await res.json()

				//console.log("=====jsonData====="+JSON.stringify(jsonData));
				//console.log("=====jsonData==outputs==="+JSON.stringify(jsonData[prompt_id].outputs));
				

				let data = jsonData[tmp_prompt_id];
				// 初始化一个空数组来存储所有找到的images数组  
				allImages = [];  
				let input_texts = [];  

				// 查找生成的outputs中包含images数组的节点  
				for (let key in data.outputs) {  
					if (data.outputs.hasOwnProperty(key)) { // 确保key是data.outputs的自有属性  
						const value = data.outputs[key];  
						
						// 检查当前值是否包含images数组  
						if (Array.isArray(value.images)) {  
							// 如果包含，将images数组添加到allImages数组中  
							for (let i = 0; i < value.images.length; i++) {  
								allImages.push(value.images[i]);  
							}
						}  
						// 检查当前值是否包含gifs数组  
						if (Array.isArray(value.gifs)) {  
							for (let i = 0; i < value.gifs.length; i++) {  
								allImages.push(value.gifs[i]);  
							}
						}  
					}  
				}  
				//查找用到的提示词
				let prompt = jsonData[tmp_prompt_id].prompt;
				for (let i = 0; i < prompt.length; i++) { 
					let item = prompt[i];
					for (let key in item) {  
						if (item.hasOwnProperty(key)) { // 确保key是data.outputs的自有属性  
							const obj = item[key];  
							
							if (obj.hasOwnProperty("inputs") && obj.hasOwnProperty("class_type")) { 
								if ((obj.class_type == "ZwPrompt" ||obj.class_type == "ZwPromptText" ) &&  obj.inputs.hasOwnProperty("text")) { 
									const value = obj.inputs.text;
									//console.log("value===="+JSON.stringify(value));
									if(value != "") { input_texts.push(value); }
								}
							}
						}
					}
				}
				//提取工作流
				let wkfl = null;
				for (let i = 0; i < prompt.length; i++) { 
					let item = prompt[i];
					for (let key in item) {  
						if (item.hasOwnProperty("extra_pnginfo")) { // 确保key是data.outputs的自有属性  
							wkfl = item["extra_pnginfo"]["workflow"]
							break;
						}
					}
				}
				imageBrowser.saveLocalFile(input_texts, allImages, wkfl, tmp_prompt_id);
				imageBrowser.bindImageBrowserBarItems(allImages);
			}
		});
		// 创建一个按钮
		/* var btn = document.createElement('button');
		btn.innerText = 'ZW一键上传';
		btn.onclick = function() {
			console.log("[logging]", "clicked");
			//console.log(app.graph.nodes);
			//console.log(app.graph.nodes[0].pos);
			//console.log(app.graph.nodes[0].pos[0]);
			//console.log(app.graph.nodes[0].pos[1]);
			//console.log(app.graph.nodes[0].pos[0] + 100);
			//showUploadPanel();
			uploadPanel.showPanel(allImages[0]);
		};
		// 将按钮添加到div中
		document.getElementsByClassName("comfy-menu")[0].appendChild(btn);
		*/
		//alert("dsadsa");
		addCssLink();
		addJSLink();
		//uploadPanel.initHtml();
		//uploadPanel.initEvent();

		nodePrompt.initHtml();
		nodePrompt.initEvent();

		imageBrowser.initHtml();
		imageBrowser.initEvent();
		zwTags.initHtml();
		zwTags.initEvent();
	},
	async addCustomNodeDefs(defs, app) {
		// Add custom node definitions
		// These definitions will be configured and registered automatically
		// defs is a lookup core nodes, add yours into this
		//console.log("[logging]", "add custom node definitions", "current nodes:", Object.keys(defs));
	},
	async getCustomWidgets(app) {
		// Return custom widget types
		// See ComfyWidgets for widget examples
		//console.log("[logging]", "provide custom widgets");
	},
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		// Run custom logic before a node definition is registered with the graph
		//console.log("[logging]", "before register node: ", nodeType, nodeData);

		// This fires for every node definition so only log once
		delete ext.beforeRegisterNodeDef;
	},
	async registerCustomNodes(app) {
		// Register any custom node implementations here allowing for more flexability than a custom node def
		//console.log("[logging]", "register custom nodes");
	},
	loadedGraphNode(node, app) {
		if(!node.doc_enabled) {
			const orig = node.onDrawForeground;
			node.onDrawForeground = function (ctx) { 
				if("ZwPrompt" == node.type || "ZwPromptText" == node.type) {
					drawDocIcon(node, orig, arguments) 
				}
			};
		}

		const oDb = node.onMouseDown
		node.onMouseDown = function(e) {
			oDb?.apply(node, arguments)
			const { canvasX, canvasY } = e

			// 通过node的位置信息判断是否点击了文档图标
			const [nLeft, nTop, nWidth, nHeight] = node.getBounding()
			const iconX = nLeft + nWidth - 22
			const iconY = nTop
			const iconX1 = nLeft + nWidth
			const iconY1 = nTop + 22
			//console.log(canvasX, canvasY, iconX, iconY, iconX1, iconY1)
			if(canvasX >= iconX && canvasX <= iconX1 && canvasY >= iconY && canvasY <= iconY1) {
				console.log('打开文档')
				showNodeDocs(node)
				e.preventDefault()
				e.stopPropagation()
				return false
			}
		}
	},
	nodeCreated(node, app) {
		if(!node.doc_enabled ) {
			let orig = node.onDrawForeground;
			if(!orig)
				orig = node.__proto__.onDrawForeground;
			node.onDrawForeground = function (ctx) {
				if("ZwPrompt" == node.type || "ZwPromptText" == node.type) {
			  		drawDocIcon(node, orig, arguments)
					nodePrompt.bindPromptTextareaEvent();
				}
			};
			node.doc_enabled = true;
			//console.log('=======', node)
		}
	}
};

app.registerExtension(ext);

const cacheNodePositonMap = new Map();
const drawDocIcon = function(node, orig, restArgs) {
  	let ctx = restArgs[0];
 	const r = orig?.apply?.(node, restArgs);

 	if (!node.flags.collapsed && node.constructor.title_mode != LiteGraph.NO_TITLE) {
		const docIcon = '📘';
		let fgColor = "white";

		ctx.save();

		ctx.font = "16px sans-serif";
		const sz = ctx.measureText(docIcon);
		ctx.beginPath();
		ctx.fillStyle = fgColor;
		const x = node.size[0] - sz.width - 6;
		const y = -LiteGraph.NODE_TITLE_HEIGHT + 22;
		ctx.fillText(docIcon, x, y);
		ctx.restore();

		const boundary = node.getBounding();
		const [ x1, y1, width, height ] = boundary
		cacheNodePositonMap.set(node.id, {
		x: [x1 + x, x1 + x + sz.width],
		y: [y1 , y1 + 22]
		})

		if (node.has_errors) {
		ctx.save();
		ctx.font = "bold 14px sans-serif";
		const sz2 = ctx.measureText(node.type);
		ctx.fillStyle = 'white';
		ctx.fillText(node.type, node.size[0] / 2 - sz2.width / 2, node.size[1] / 2);
		ctx.restore();
		}
  	}
  	return r
}
const nodeDocsEleMap = new Map();
let activeDocsEle = null;
/**
 * 显示节点文档
 * @param {*} node
 * @returns
 */
const showNodeDocs = async function(node) {

	const ele = nodeDocsEleMap.get(node.id)
	const [nLeft, nTop, nWidth, nHeight] = node.getBounding()
	if(ele) {
	  ele.style.display = 'block'
	  // 更新位置
	  // ele.style.left = (nLeft + nWidth + 20) + 'px'
	  activeDocsEle = ele
	  return
	}
	const divWrap = document.createElement('div')
	divWrap.style.position = 'absolute'
  
	divWrap.style.left = 'calc(50% - 400px)'
	divWrap.style.top = '20px'
	divWrap.style.width = '800px'
	divWrap.style.height = window.innerHeight - 100 + 'px'
	divWrap.style.backgroundColor = 'var(--comfy-menu-bg)'
	divWrap.style.color = 'white'
	divWrap.style.padding = '10px'
	divWrap.style.borderRadius = '10px'
	divWrap.style.zIndex = '9999'
	divWrap.style.overflow = 'hidden'
	divWrap.style.boxShadow = '3px 3px 8px rgba(0, 0, 0, 0.4)'
  
	document.body.appendChild(divWrap)
  
	const buttonClose = document.createElement('button')
	/**
	  background-color: rgba(0, 0, 0, 0);
	  padding: 0;
	  border: none;
	  cursor: pointer;
	  font-size: inherit;
	 */
	buttonClose.style.backgroundColor = 'rgba(0, 0, 0, 0)'
	buttonClose.style.padding = '0'
	buttonClose.style.border = 'none'
	buttonClose.style.cursor = 'pointer'
	buttonClose.style.fontSize = '36px'
	buttonClose.innerText = '×'
	buttonClose.className = 'comfy-close-menu-btn'
  
	buttonClose.onclick = function() {
	  divWrap.style.display = 'none'
	}
  
	const divButtonWrap = document.createElement('div')
  
	divButtonWrap.style.display = 'flex'
	divButtonWrap.style.justifyContent = 'flex-end'
	divButtonWrap.style.height = '32px'
	divButtonWrap.appendChild(buttonClose)
  
	const divContentWrap = document.createElement('div')
	divContentWrap.style.background = 'var(--comfy-input-bg)'
	divContentWrap.style.height = 'calc(100% - 44px)'
	divContentWrap.style.padding = '10px'
	divContentWrap.style.borderRadius = '10px'
	divContentWrap.style.overflowX = 'hidden'
	divContentWrap.style.overflowY = 'auto'
  
	divWrap.appendChild(divButtonWrap)
	divWrap.appendChild(divContentWrap)
  
  
	const res = await fetch('/customnode/getNodeInfo?nodeName=' + node.type)
	const jsonData = await res.json()
	console.log(marked, jsonData)
	const html = marked.parse(jsonData.content);
  
	divContentWrap.innerHTML = html || node.description || '暂无文档'
  

	if (activeDocsEle) {
	  	hideActiveDocs()
	}
	activeDocsEle = divWrap
  
	nodeDocsEleMap.set(node.id, divWrap)
  }
const hideActiveDocs = function() {
	if(activeDocsEle === null || activeDocsEle === undefined) return;
	activeDocsEle.style.display = 'none';
}
const processMouseDown = LGraphCanvas.prototype.processMouseDown;
LGraphCanvas.prototype.processMouseDown = function(e) {
  //console.log('🚀 ~ arguments:', arguments)
  processMouseDown.apply(this, arguments)
  const { canvasX, canvasY } = e
  const nodes = app.graph._nodes
  let isClickDoc = false
  for(let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const [nL, nT, nW, nH] = node.getBounding()
    const iconX = nL + nW - 22
    const iconY = nT
    const iconX1 = nL + nW
    const iconY1 = nT + 22

    if(canvasX >= iconX && canvasX <= iconX1 && canvasY >= iconY && canvasY <= iconY1) {
      isClickDoc = true
      break
    }
  }

  if(!isClickDoc) {
    hideActiveDocs()
  }
}
const addCssLink = function() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = "./extensions/ComfyUI-zw-tools/ui/css/zw.css";
	document.head.appendChild(link);
}
const addJSLink = function() {
	const scrt = document.createElement('script');
	scrt.type = 'text/javascript';
	scrt.src = "./extensions/ComfyUI-zw-tools/ui/js/jquery.min.js";
	document.head.appendChild(scrt);
}
const showUploadPanel = function() {
	const divWrap = document.createElement('div');
	divWrap.className = 'upload-panel';
	divWrap.style.display = 'block';
  
	document.body.appendChild(divWrap);
  
	const buttonClose = document.createElement('button');
	/**
	  background-color: rgba(0, 0, 0, 0);
	  padding: 0;
	  border: none;
	  cursor: pointer;
	  font-size: inherit;
	 */
	buttonClose.style.backgroundColor = 'rgba(0, 0, 0, 0)'
	buttonClose.style.padding = '0'
	buttonClose.style.border = 'none'
	buttonClose.style.cursor = 'pointer'
	buttonClose.style.fontSize = '36px'
	buttonClose.innerText = '×'
	buttonClose.className = 'comfy-close-menu-btn'
  
	buttonClose.onclick = function() {
	  divWrap.style.display = 'none'
	}
  
	const divButtonWrap = document.createElement('div')
  
	divButtonWrap.style.display = 'flex'
	divButtonWrap.style.justifyContent = 'flex-end'
	divButtonWrap.style.height = '32px'
	divButtonWrap.appendChild(buttonClose)
  
	const divContentWrap = document.createElement('div')
	divContentWrap.style.background = 'var(--comfy-input-bg)'
	divContentWrap.style.height = 'calc(100% - 50px)'
	divContentWrap.style.padding = '10px'
	divContentWrap.style.borderRadius = '10px'
	divContentWrap.style.overflowX = 'hidden'
	divContentWrap.style.overflowY = 'auto'
  
	divWrap.appendChild(divButtonWrap)
	divWrap.appendChild(divContentWrap)

	const divImages = document.createElement('div')
	divImages.style.background = 'var(--comfy-input-bg)'
	divImages.style.height = 'calc(100% - 100px)'
	divImages.style.padding = '0px'
	divImages.style.borderRadius = '0px'
	divImages.style.overflowX = 'hidden'
	divImages.style.overflowY = 'auto'
	divImages.className='zw-images';

	const divBars = document.createElement('div')
	divBars.style.background = 'var(--comfy-input-bg)'
	divBars.style.height = '50px'
	divBars.style.padding = '10px'
	divBars.style.borderRadius = '10px'
	divBars.style.overflowX = 'hidden'
	divBars.style.overflowY = 'auto'
	divBars.className='zw-bar';

	divContentWrap.appendChild(divImages);
	divContentWrap.appendChild(divBars);

	const ulBox = document.createElement('ul');
	divImages.appendChild(ulBox);
	ulBox.style.display = 'flex';
	ulBox.style.listStyle = 'none';
	ulBox.style.flexWrap = 'wrap';
	ulBox.style.justifyContent = 'left';
	ulBox.style.padding = '0';
	ulBox.style.margin = '0';

	for(var i = 0; i < 10; i++){
		const liBox = document.createElement('li');
		liBox.style.width = '100px';
		liBox.style.height = '130px';
		liBox.style.marginRight = '10px';
		liBox.style.marginBottom = '10px';
		liBox.innerHTML = `<img src="https://picsum.photos/200/300?random=${i}" alt="" style="width: 100%; height: 100%;">`;
		ulBox.appendChild(liBox);
	}

	const btnUpload = document.createElement('button');
	btnUpload.innerText = '上传';
	btnUpload.onclick = function() {
		console.log('上传');
	};
	divBars.appendChild(btnUpload);

	const btnSetting = document.createElement('button');
	btnSetting.innerText = '设置';
	btnSetting.onclick = function() {
		console.log('设置');
		divSetting.style.display = 'block';
	};
	divBars.appendChild(btnSetting);

	/** 设置divSetting */
	const divSetting = document.createElement('div');
	divSetting.style.display = 'none';
	divSetting.style.background = 'var(--comfy-input-bg)';
	divSetting.style.height = '50px';
	divSetting.id = 'divSetting';
	divBars.appendChild(divSetting);

	const divSpan = document.createElement('span');
	divSpan.innerText = '百度翻译KEY';

	const inputKey = document.createElement('input');
	inputKey.type = 'text';
	inputKey.value = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
	inputKey.style.width = '200px';
	inputKey.style.height = '30px';
	inputKey.style.marginRight = '10px';
	inputKey.style.marginBottom = '10px';

	const btnTest = document.createElement('button');
	btnTest.innerText = '测试';
	btnTest.onclick = function() {
		console.log('测试');
	};

	const btnSave = document.createElement('button');
	btnSave.innerText = '保存';
	btnSave.onclick = function() {
		console.log('保存');
		divSetting.style.display = 'none';
	};

	divSetting.appendChild(divSpan);
	divSetting.appendChild(inputKey);
	divSetting.appendChild(btnTest);
	divSetting.appendChild(btnSave);
};

