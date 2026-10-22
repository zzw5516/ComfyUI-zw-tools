//@ts-ignore
import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";
// 显式引入 jQuery，避免依赖 ComfyUI 扫描 /extensions 时的文件加载顺序。
import "../ui/js/jquery.min.js";
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
		// 新版前端的 graphToPrompt 结果可能包含 Vue/响应式代理对象，
		// structuredClone 会抛出 "could not be cloned"，并影响所有调用该方法的模块。
		// 这里保留克隆行为，但增加 JSON 克隆兜底，避免把异常抛给其它扩展。
		const _original_graphToPrompt = app.graphToPrompt;
		app.graphToPrompt = async function (...args) {
			const prompt = await _original_graphToPrompt.apply(app, args);
			try {
				return typeof structuredClone === "function" ? structuredClone(prompt) : prompt;
			} catch (cloneError) {
				try {
					return JSON.parse(JSON.stringify(prompt));
				} catch (jsonError) {
					console.warn("[zw-tools] graphToPrompt 克隆失败，返回原始结果:", cloneError);
					return prompt;
				}
			}
		};
		api.addEventListener("execution_start", (e) => {
			const detail = e && e.detail;
			if (detail && typeof detail === "object" && detail.prompt_id) {
				prompt_id = detail.prompt_id;
			} else if (detail) {
				prompt_id = detail;
			}
		});
		api.addEventListener("executing", async (e) => {
			const detail = e ? e.detail : null;
			// 旧版前端把节点 id 直接作为 detail，执行结束时为 null；
			// 新版前端仍会映射成 null，这里同时兼容直接传 { node: null, prompt_id } 的实现。
			const isExecutionFinished = detail === null
				|| (detail && typeof detail === "object" && detail.node === null && !detail.display_node);
			if (!isExecutionFinished) return;

			const tmp_prompt_id = (detail && typeof detail === "object" && detail.prompt_id)
				? detail.prompt_id
				: prompt_id;
			if (!tmp_prompt_id) return;

			try {
				const res = await fetch('/history/' + encodeURIComponent(tmp_prompt_id));
				if (!res.ok) return;

				const jsonData = await res.json();
				const data = jsonData ? jsonData[tmp_prompt_id] : null;
				if (!data) return;

				const allImages = [];
				const input_texts = [];
				const outputs = data.outputs || {};

				// 收集本次执行生成的所有图片/动图
				for (const key of Object.keys(outputs)) {
					const value = outputs[key] || {};
					if (Array.isArray(value.images)) {
						allImages.push(...value.images);
					}
					if (Array.isArray(value.gifs)) {
						allImages.push(...value.gifs);
					}
				}

				// 查找本次执行用到的 ZwPrompt / ZwPromptText 提示词
				const prompt = Array.isArray(data.prompt) ? data.prompt : [];
				for (const item of prompt) {
					if (!item || typeof item !== "object") continue;
					for (const key of Object.keys(item)) {
						const obj = item[key];
						if (!obj || typeof obj !== "object") continue;
						if (obj.inputs && obj.class_type
							&& (obj.class_type === "ZwPrompt" || obj.class_type === "ZwPromptText")
							&& Object.prototype.hasOwnProperty.call(obj.inputs, "text")) {
							const value = obj.inputs.text;
							if (value) input_texts.push(value);
						}
					}
				}

				// 提取工作流
				let wkfl = null;
				for (const item of prompt) {
					if (!item || typeof item !== "object") continue;
					if (Object.prototype.hasOwnProperty.call(item, "extra_pnginfo")) {
						wkfl = item["extra_pnginfo"] && item["extra_pnginfo"]["workflow"];
						break;
					}
				}

				if (imageBrowser && typeof imageBrowser.saveLocalFile === "function") {
					await imageBrowser.saveLocalFile(input_texts, allImages, wkfl, tmp_prompt_id);
				}
				if (imageBrowser && typeof imageBrowser.bindImageBrowserBarItems === "function") {
					imageBrowser.bindImageBrowserBarItems(allImages);
				}
			} catch (err) {
				console.error("[zw-tools] 保存生成记录失败:", err);
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
		// 只处理本插件的两个节点，避免影响其它节点。
		if (!node || (node.type !== "ZwPrompt" && node.type !== "ZwPromptText")) return;

		if (!node.doc_enabled) {
			const orig = node.onDrawForeground;
			node.onDrawForeground = function (ctx) { 
				drawDocIcon(node, orig, arguments);
			};
			node.doc_enabled = true;
		}

		if (node._zwDocMouseDownBound) return;
		node._zwDocMouseDownBound = true;

		const oDb = node.onMouseDown;
		node.onMouseDown = function(e) {
			const result = typeof oDb === "function" ? oDb.apply(node, arguments) : undefined;
			if (!e || typeof e.canvasX !== "number" || typeof e.canvasY !== "number") return result;

			// 通过node的位置信息判断是否点击了文档图标
			const bounds = node.getBounding ? node.getBounding() : null;
			if (!bounds) return result;
			const [nLeft, nTop, nWidth] = bounds;
			const iconX = nLeft + nWidth - 22;
			const iconY = nTop;
			const iconX1 = nLeft + nWidth;
			const iconY1 = nTop + 22;
			if(e.canvasX >= iconX && e.canvasX <= iconX1 && e.canvasY >= iconY && e.canvasY <= iconY1) {
				showNodeDocs(node);
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				return false;
			}
			return result;
		};
	},
	nodeCreated(node, app) {
		// 新建节点也绑定文档图标事件（旧版只对从工作流加载的节点生效）。
		if (!node || (node.type !== "ZwPrompt" && node.type !== "ZwPromptText")) return;
		ext.loadedGraphNode(node, app);
	}
};

app.registerExtension(ext);

const cacheNodePositonMap = new Map();
const drawDocIcon = function(node, orig, restArgs) {
	const ctx = restArgs ? restArgs[0] : null;
	const r = typeof orig === "function" ? orig.apply(node, restArgs) : undefined;
	// 新版前端仍然通过 window.LiteGraph 暴露常量，这里做兼容保护。
	const litegraph = typeof window !== "undefined" ? window.LiteGraph : undefined;
	if (!ctx || !litegraph) return r;

	const size = node.size || [0, 0];
	const titleMode = node.constructor ? node.constructor.title_mode : undefined;
	const collapsed = node.flags ? node.flags.collapsed : false;

	if (!collapsed && titleMode != litegraph.NO_TITLE) {
		const docIcon = '📘';
		let fgColor = "white";

		ctx.save();

		ctx.font = "16px sans-serif";
		const sz = ctx.measureText(docIcon);
		ctx.beginPath();
		ctx.fillStyle = fgColor;
		const x = size[0] - sz.width - 6;
		const y = -(litegraph.NODE_TITLE_HEIGHT || 30) + 22;
		ctx.fillText(docIcon, x, y);
		ctx.restore();

		const boundary = node.getBounding ? node.getBounding() : null;
		if (boundary) {
			const [ x1, y1 ] = boundary;
			cacheNodePositonMap.set(node.id, {
				x: [x1 + x, x1 + x + sz.width],
				y: [y1 , y1 + 22]
			});
		}

		if (node.has_errors) {
			ctx.save();
			ctx.font = "bold 14px sans-serif";
			const sz2 = ctx.measureText(node.type);
			ctx.fillStyle = 'white';
			ctx.fillText(node.type, size[0] / 2 - sz2.width / 2, size[1] / 2);
			ctx.restore();
		}
	}
	return r;
}
const nodeDocsEleMap = new Map();
let activeDocsEle = null;

const escapeHtml = function(text) {
	return String(text).replace(/[&<>"']/g, (ch) => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
	}[ch]));
};

const renderMarkdown = function(content) {
	if (!content) return '';
	// 旧版 ComfyUI 页面里有全局 marked；新版前端已经不再暴露它。
	const markedLib = (typeof globalThis !== "undefined" && globalThis.marked)
		? globalThis.marked
		: (typeof window !== "undefined" ? window.marked : undefined);
	if (markedLib && typeof markedLib.parse === "function") {
		try {
			return markedLib.parse(content);
		} catch (err) {
			console.warn("[zw-tools] Markdown 渲染失败，使用纯文本显示:", err);
		}
	}
	return `<pre style="white-space:pre-wrap;word-break:break-word;margin:0;">${escapeHtml(content)}</pre>`;
};

/**
 * 显示节点文档
 * @param {*} node
 * @returns
 */
const showNodeDocs = async function(node) {

	const ele = nodeDocsEleMap.get(node.id)
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
  
  
	let content = '';
	try {
		const res = await fetch('/customnode/getNodeInfo?nodeName=' + encodeURIComponent(node.type));
		if (res.ok) {
			const jsonData = await res.json();
			content = (jsonData && jsonData.content) || '';
		}
	} catch (err) {
		console.warn("[zw-tools] 读取节点文档失败:", err);
	}
	const html = renderMarkdown(content);

	divContentWrap.innerHTML = html || node.description || '暂无文档';
  

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

// 新版前端仍然通过 window.LGraphCanvas 暴露画布类，但不是所有版本都保证存在，
// 因此这里先做存在性检查，避免扩展加载时直接抛异常。
const LGraphCanvasCtor = typeof window !== "undefined" ? window.LGraphCanvas : undefined;
if (LGraphCanvasCtor && LGraphCanvasCtor.prototype && typeof LGraphCanvasCtor.prototype.processMouseDown === "function") {
	const processMouseDown = LGraphCanvasCtor.prototype.processMouseDown;
	LGraphCanvasCtor.prototype.processMouseDown = function(e) {
		const result = processMouseDown.apply(this, arguments);
		if (!e || typeof e.canvasX !== "number" || typeof e.canvasY !== "number") return result;

		const { canvasX, canvasY } = e;
		const nodes = (app.graph && app.graph._nodes) || [];
		let isClickDoc = false;

		for (const node of nodes) {
			if (!node || typeof node.getBounding !== "function") continue;
			const bounds = node.getBounding();
			if (!bounds) continue;

			const [nL, nT, nW] = bounds;
			const iconX = nL + nW - 22;
			const iconY = nT;
			const iconX1 = nL + nW;
			const iconY1 = nT + 22;

			if(canvasX >= iconX && canvasX <= iconX1 && canvasY >= iconY && canvasY <= iconY1) {
				isClickDoc = true;
				break;
			}
		}

		if(!isClickDoc) {
			hideActiveDocs();
		}
		return result;
	};
}
const addCssLink = function() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	// 使用当前模块 URL 计算样式路径，插件目录被重命名或 ComfyUI 部署在子路径下也能正确加载。
	try {
		link.href = new URL('../ui/css/zw.css', import.meta.url).href;
	} catch (e) {
		link.href = "./extensions/ComfyUI-zw-tools/ui/css/zw.css";
	}
	document.head.appendChild(link);
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

