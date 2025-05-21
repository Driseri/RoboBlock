'use strict';

var BlocklyDuino = {};
BlocklyDuino.selectedToolbox = "toolbox_arduino_all";
BlocklyDuino.selectedCard = "nano";
BlocklyDuino.content = "on";
BlocklyDuino.workspace = null;

BlocklyDuino.init = function() {
	Code.initLanguage();
	BlocklyDuino.loadConfig();
	BlocklyDuino.workspace = Blockly.inject('content_blocks',{grid:{snap:true},sounds:true,media:'media/',toolbox:BlocklyDuino.buildToolbox(),zoom:{controls:true,wheel:true}});
	BlocklyDuino.workspace.addChangeListener(function () {
		const $btn = $('#btn_compile');
		if ($btn.hasClass('btn-success')) {
			$btn.removeClass('btn-success btn-danger');
		}
	});
	BlocklyDuino.bindFunctions();
	BlocklyDuino.workspace.render();
	BlocklyDuino.workspace.addChangeListener(BlocklyDuino.renderArduinoCodePreview);
	BlocklyDuino.loadFile();
	window.addEventListener('unload', BlocklyDuino.backupBlocks, false);
};
BlocklyDuino.loadFile = function() {
	var urlFile = BlocklyDuino.getStringParamFromUrl('url', '');
	if (urlFile.endsWith(".py")) {
		$.get(urlFile, function(data) { 
			$('#codeORblock').bootstrapToggle("off");
			$('a[href="#content_code"]').tab('show');
			$('#btn_print').addClass("hidden");
			$('#btn_preview').addClass("hidden");
			$('#btn_search').removeClass("hidden");
			
			 $('#btn_fakeload').addClass("hidden");
			 $('#btn_new').addClass("hidden");
			 $('#btn_example').addClass("hidden");
			$('#toner').addClass("hidden");
			$('#btn_saveXML').addClass("hidden");
			
			window.localStorage.content="off";
			editor.session.setMode("ace/mode/python");
			editor.setOptions({
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});
			editor.setValue(data,1)
		}, 'text')
	}
	if (urlFile.endsWith(".ino")) {
		$.get(urlFile, function(data) { 
			$('#codeORblock').bootstrapToggle("off");
			$('a[href="#content_code"]').tab('show');
			$('#btn_print').addClass("hidden");
			$('#btn_preview').addClass("hidden");
			$('#btn_search').removeClass("hidden");
			
			 $('#btn_fakeload').addClass("hidden");
			 $('#btn_new').addClass("hidden");
			 $('#btn_example').addClass("hidden");
			$('#toner').addClass("hidden");
			$('#btn_saveXML').addClass("hidden");
			
			window.localStorage.content="off";
			editor.session.setMode("ace/mode/c_cpp");
			editor.setOptions({
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});
			editor.setValue(data,1)
		}, 'text')
	}
	var loadOnce = null;
	try {loadOnce = window.localStorage.loadOnceBlocks} catch (e) {}
	if (urlFile) {
		$.get( urlFile, function(data){BlocklyDuino.loadBlocks(data)}, 'text')
	} else {
		BlocklyDuino.loadBlocks()
	}
};
BlocklyDuino.save_com = function() {
	$("#portserie").blur();
	var com=$("#portserie").val();
	window.localStorage.com = com;
};
BlocklyDuino.renderArduinoCodePreview = function() {
	var prog = window.localStorage.prog;
	if (prog != "python") {
		$('#pre_previewArduino').text(Blockly.Arduino.workspaceToCode(BlocklyDuino.workspace));
		$('#pre_previewArduino').html(prettyPrintOne($('#pre_previewArduino').html(), 'cpp'));
	} else {
		$('#pre_previewArduino').text(Blockly.Python.workspaceToCode(BlocklyDuino.workspace));
		$('#pre_previewArduino').html(prettyPrintOne($('#pre_previewArduino').html(), 'py'));
	}
};
BlocklyDuino.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};
BlocklyDuino.addReplaceParamToUrl = function(url, param, value) {
	var re = new RegExp("([?&])" + param + "=.*?(&|$)", "i");
	var separator = url.indexOf('?') !== -1 ? "&" : "?";
	if (url.match(re)) {
		return url.replace(re, '$1' + param + "=" + value + '$2');
	}
	else {
		return url + separator + param + "=" + value;
	}
};
BlocklyDuino.loadBlocks = function(defaultXml) {
	if (defaultXml) {
		var xml = Blockly.Xml.textToDom(defaultXml);
		Blockly.Xml.domToWorkspace(xml,BlocklyDuino.workspace);
	} else {
		var loadOnce = null;
		try {
			loadOnce = window.localStorage.loadOnceBlocks;
		} catch (e) {}
		if (loadOnce != null) {
			delete window.localStorage.loadOnceBlocks;
			var xml = Blockly.Xml.textToDom(loadOnce);
			Blockly.Xml.domToWorkspace(xml,BlocklyDuino.workspace);
		}
	}
};
BlocklyDuino.load = function(event) {
    var files = event.target.files;
    if (files.length != 1) {
        return;
    }
    
    var reader = new FileReader();
    reader.onloadend = function(event) {
        var target = event.target;
        if (target.readyState == 2) {
            var fileName = files[0].name;
            
            // Handle code files (ino, py)
            if (fileName.endsWith("ino")) {
                $('#codeORblock').bootstrapToggle("off");
                $('a[href="#content_code"]').tab('show');
                $('#btn_print').addClass("hidden");
                $('#btn_preview').addClass("hidden");
                $('#btn_search').removeClass("hidden");
                
                $('#btn_fakeload').addClass("hidden");
                $('#btn_new').addClass("hidden");
                $('#btn_example').addClass("hidden");
                $('#toner').addClass("hidden");
                $('#btn_saveXML').addClass("hidden");
                
                window.localStorage.content = "off";
                editor.session.setMode("ace/mode/c_cpp");
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
                editor.setValue(target.result, 1);
                return;
            }
            
            if (fileName.endsWith("py")) {
                $('#codeORblock').bootstrapToggle("off");
                $('a[href="#content_code"]').tab('show');
                $('#btn_print').addClass("hidden");
                $('#btn_preview').addClass("hidden");
                $('#btn_search').removeClass("hidden");
                
                $('#btn_fakeload').addClass("hidden");
                $('#btn_new').addClass("hidden");
                $('#btn_example').addClass("hidden");
                $('#toner').addClass("hidden");
                $('#btn_saveXML').addClass("hidden");
                
                window.localStorage.content = "off";
                editor.session.setMode("ace/mode/python");
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                });
                editor.setValue(target.result, 1);
                return;
            }

            try {
                // Load blocks from the uploaded file
                var newBlocksXml = Blockly.Xml.textToDom(target.result);
                Blockly.Xml.domToWorkspace(newBlocksXml, BlocklyDuino.workspace);
                BlocklyDuino.workspace.render();
                window.location.href = "index.html";
            } catch (e) {
                alert(MSG['xmlError'] + '\n' + e);
                return;
            }
        }
    };
    reader.readAsText(files[0]);
};


BlocklyDuino.backupBlocks = function() {
  if (typeof Blockly != 'undefined' && window.localStorage) {
    var xml = Blockly.Xml.workspaceToDom(BlocklyDuino.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.localStorage.loadOnceBlocks = text;
  }
};
BlocklyDuino.loadConfig = function() {
	var card = window.localStorage.card;
	var content=window.localStorage.content;
	var prog = window.localStorage.prog;
	if (card===undefined) {
		window.localStorage.card = BlocklyDuino.selectedCard;
		window.localStorage.prog = profile[BlocklyDuino.selectedCard].prog;
		window.localStorage.toolbox = BlocklyDuino.selectedToolbox;
		$("#boards").val(BlocklyDuino.selectedCard);
		$('#arduino_card_mini_picture').attr("src", profile[BlocklyDuino.selectedCard]['picture']);
		if(BlocklyDuino.selectedCard=="nanooptiboot"||BlocklyDuino.selectedCard=="nano"){
			$("#warning").show();
		}else{
			$("#warning").hide();
		}
		$("#toolboxes").val(BlocklyDuino.selectedToolbox);
		BlocklyDuino.loadToolboxDefinition(BlocklyDuino.selectedToolbox)
	} else {
		var toolbox = window.localStorage.toolbox;
		BlocklyDuino.selectedToolbox = toolbox;
		$("#boards").val(card);
		$('#arduino_card_mini_picture').attr("src", profile[card]['picture']);
		if(card=="nanooptiboot"||card=="nano"){
			$("#warning").show();
		}else{
			$("#warning").hide();
		}
		$("#toolboxes").val(toolbox);
		BlocklyDuino.loadToolboxDefinition(toolbox)
	}
	if (content===undefined) {
		window.localStorage.content = BlocklyDuino.content;
		$('#codeORblock').bootstrapToggle(BlocklyDuino.content);
		$('#btn_search').addClass("hidden")
	} else {
		$('#codeORblock').bootstrapToggle(content);
		if (content=="off") {
			$('a[href="#content_code"]').tab('show');
			$('#btn_search').removeClass("hidden")
		}
		$('#btn_search').addClass("hidden")
	}
	if (prog == "python") {
		$('#btn_bin').addClass("hidden")
	}
};
BlocklyDuino.change_card = function() {
	BlocklyDuino.backupBlocks();
	var card = window.localStorage.card;
	var toolbox = window.localStorage.toolbox;
	$("#boards").blur();
	var new_card = $("#boards").val();
	var new_prog = window.profile[new_card].prog;
	if (window.profile[new_card].cpu != window.profile[card].cpu) {
		if (window.confirm(MSG['arduino_card'] + window.profile[new_card].description + ' ?')){
			$('#arduino_card_mini_picture').attr("src", profile[new_card]['picture']);
			if (new_prog != "python") {
				$('#btn_preview').attr('title', MSG['btn_preview_ino']);
				$('#btn_saveino').attr('title', MSG['btn_save_ino']);
				$('#btn_bin').removeClass("hidden");
				
				window.localStorage.prog = new_prog;
				var new_toolbox = "toolbox_arduino_all"; //by default
				var mystartfile;
					mystartfile= '<xml xmlns="http://www.w3.org/1999/xhtml">';
					mystartfile +=  '<block type="base_setup_loop" x="-4" y="48"></block>';
					mystartfile += '</xml>';
				
				if (window.profile[new_card].cpu == "nano") 
				     new_toolbox = "toolbox_arduino_all"
					 
				else if (window.profile[new_card].cpu == "esp32") 
					new_toolbox = "toolbox_arduino_all-esp32"
					
				else if (window.profile[new_card].cpu == "atmega328p-x") 
				    new_toolbox = "toolbox_arduino_all"	

				else if (window.profile[new_card].cpu == "esp826601") 
					new_toolbox = "toolbox_esp826601"
				
				else if (window.profile[new_card].cpu == "esp826612") 
					new_toolbox = "toolbox_esp826612"

 				 else if (window.profile[new_card].cpu == "leo32u4") 
				 	new_toolbox = "toolbox_leo32u4"
				
				else if (window.profile[new_card].cpu == "atmegang16") 
				 	new_toolbox = "toolbox_arduino_all"

					else if (window.profile[new_card].cpu == "mik32") 
				 	new_toolbox = "toolbox_mik32"
					
					else if (window.profile[new_card].cpu == "stm32duino") 
				 	new_toolbox = "toolbox_stm32"
					
					else if (window.profile[new_card].cpu == "sandeepmistry") 
				 	new_toolbox = "toolbox_sandeepmistry"
					

					
				window.localStorage.toolbox = new_toolbox;
				BlocklyDuino.workspace.clear();
				
				// If CPU has changed and any of the 2 CPUs is an esp (32 or 8266) we need to load blocks for the new board
				if ((window.profile[new_card].cpu != window.profile[card].cpu) /*&& ((window.profile[new_card].cpu.startsWith("esp")) || (window.profile[card].cpu.startsWith("esp")) ) */  )
					BlocklyDuino.loadBlocks(mystartfile);
			    else
					BlocklyDuino.loadBlocks();
				
				BlocklyDuino.loadToolboxDefinition(new_toolbox);
				Blockly.getMainWorkspace().updateToolbox(BlocklyDuino.buildToolbox());
				if (window.localStorage.level==1)
				  $("#btn_level1").trigger("click");
			     else
					 if (	window.localStorage.level==2)
				  $("#btn_level2").trigger("click");
			     else
				  $("#btn_level3").trigger("click");
				 
				 
				BlocklyDuino.workspace.render()
			} else {
				$('#btn_preview').attr('title', MSG['btn_preview_py']);
				$('#btn_saveino').attr('title', MSG['btn_save_py']);
				$('#btn_bin').addClass("hidden");
				if ( window.profile[new_card].cpu == "cortexM0" ) {
					var new_toolbox = "toolbox_microbit";
				} else {
					var new_toolbox = "toolbox_lycee";
				}					
				window.localStorage.prog = new_prog;
				window.localStorage.toolbox = new_toolbox;
				BlocklyDuino.workspace.clear();
				BlocklyDuino.loadToolboxDefinition(new_toolbox);
				Blockly.getMainWorkspace().updateToolbox(BlocklyDuino.buildToolbox());
				BlocklyDuino.workspace.render()
			}
		} else {
			$("#boards").val(card);
			return
		}
	}
	window.localStorage.card = new_card
};
BlocklyDuino.discard = function() {
  var count = BlocklyDuino.workspace.getAllBlocks().length;
  if (count < 4 || window.confirm(MSG['discard'])) {
    BlocklyDuino.workspace.clear();
    BlocklyDuino.workspace.render();
  }
};
BlocklyDuino.Undo = function() {
	if (localStorage.getItem("content") == "on") {
		Blockly.mainWorkspace.undo(0)
	} else {
		editor.undo()
	}
};
BlocklyDuino.Redo = function() {
	if (localStorage.getItem("content") == "on") {
		Blockly.mainWorkspace.undo(1)
	} else {
		editor.redo()
	}	
};
BlocklyDuino.search = function() {
	editor.execCommand("find")
};

/* ------------------------------------------------------------------
 *  Отправляет рабочий скетч POST-запросом
 *  url       – конечная точка вашего API
 *  extraData – любые дополнительные поля (board, userId …)
 * -----------------------------------------------------------------*/
BlocklyDuino.postCode = function (url, extraData = {}) {
  // 1. Берём свежий код
  const code = (window.localStorage.prog !== 'python')
    ? Blockly.Arduino.workspaceToCode(BlocklyDuino.workspace)
    : Blockly.Python.workspaceToCode(BlocklyDuino.workspace);

  // 2. Собираем JSON-объект
  const payload = Object.assign(
    {
      code,                       // сам текст программы
      board: $("#boards").val(),  // пример: модель платы
      timestamp: Date.now()
    },
    extraData                     // переопределяем/добавляем, если нужно
  );

  // 3. Отправляем
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
/* Формирует полный URL GET-запроса
 *   baseUrl    – «https://api.example.com/compile»
 *   extraData  – {userId: 42}  // необязательные доп.поля
 *
 * КОД шифруем Base64 → короче и безопасно для URL.
 */
BlocklyDuino.buildGetUrl = function (baseUrl, extraData = {}) {
  const code = (window.localStorage.prog !== 'python')
    ? Blockly.Arduino.workspaceToCode(BlocklyDuino.workspace)
    : Blockly.Python.workspaceToCode(BlocklyDuino.workspace);

  const params = Object.assign({
      code: btoa(unescape(encodeURIComponent(code))),   // → base64
      board: $('#boards').val(),
      ts: Date.now()
  }, extraData);

  const qs = new URLSearchParams(params).toString();
  return `${baseUrl}?${qs}`;
};

/* ────────────────────────────────────────────── *
 * 1. Делает временный «файл» из текущего кода
 *    → возвращает {file, filename}
 * ────────────────────────────────────────────── */
BlocklyDuino.getTempSourceFile = function () {
  const code = (localStorage.prog !== 'python')
    ? Blockly.Arduino.workspaceToCode(BlocklyDuino.workspace)
    : Blockly.Python.workspaceToCode(BlocklyDuino.workspace);

  const ext  = (localStorage.prog !== 'python') ? '.ino' : '.py';
  const name = 'source_' + Date.now() + ext;

  return {                       // Blob превращаем в File
    file: new File([code], name, {type: 'text/plain'}),
    filename: name
  };
};

/**
 *  BlocklyDuino.compileOnServer
 *  ─────────────────────────────────────────
 *  1. Берёт актуальный скетч → File
 *  2. FormData { file, fqbn }
 *  3. POST https://…/compile/
 *  4. Получает .hex, сохраняет и кэширует ссылку
 */
BlocklyDuino.compileOnServer = async function ({
  apiUrl        = "https://robobocodecompiler-robobo.amvera.io/compile/",   // ваш host
  fqbn          = "arduino:avr:uno",                    // плата по умолчанию
  boardToFqbn   = {}                                    // map id → fqbn
} = {}) {

  const boardValue = document.getElementById('boards').value;
  const fqbnn = boardToFqbn[boardValue] || "arduino:avr:uno";
  /* 1. формируем исходник как File ----------------------- */
  const code   = (localStorage.prog !== "python")
               ? Blockly.Arduino.workspaceToCode(BlocklyDuino.workspace)
               : Blockly.Python.workspaceToCode(BlocklyDuino.workspace);

  const srcFile = new File(
    [code],
    "sketch_" + Date.now() + ".ino",
    {type: "text/plain"}
  );

//   /* 2. уточняем fqbn для выбранной пользователем платы ----- */
//   const boardId = $("#boards").val();                // например "nano" или "uno"
//   if (boardToFqbn[boardId]) fqbn = boardToFqbn[boardId];

  /* 3. собираем multipart/form-data ----------------------- */
  const form = new FormData();
  form.append("file", srcFile);     // ключ должен называться exactly file
  form.append("fqbn", fqbnn);        // в теле; можно и query-параметром

  /* 4. шлём ------------------------------------------------ */
  const resp = await fetch(apiUrl, {method: "POST", body: form});
  if (!resp.ok) throw new Error(resp.status + " " + resp.statusText);

  /* 5. вытаскиваем .hex  ---------------------------------- */
  const blob     = await resp.blob();                     // FileResponse
  const hexFile  = new File([blob], "firmware.hex", {type: blob.type});

  // сохраняем на диск
  //saveAs(hexFile);

  // выдаём URL для дальнейшей прошивки
  const url = URL.createObjectURL(hexFile);
  localStorage.lastBuildUrl  = url;
  localStorage.lastBuildName = hexFile.name;

  return {url, file: hexFile};
};

function boardToFqbn(boardValue) {
	const map = {
		"uno": "arduino:avr:uno",
		"nano": "arduino:avr:nano",
		"nanooptiboot": "arduino:avr:nano",
		"mega": "arduino:avr:mega",
		"leo32u4": "arduino:avr:leonardo",
		"esp32": "esp32:esp32:esp32",
		"esp826601": "esp8266:esp8266:generic",
		"esp826612": "esp8266:esp8266:nodemcuv2",
		"mik32": "mik32:board:base",
		"mik32_16": "mik32:board:base16mb",
		"mik32_32": "mik32:board:base32mb",
		"stm32duino": "STMicroelectronics:stm32:GenF1",
		"sandeepmistry": "arduino:mbed:nano33ble"
	};

	return map[boardValue] || "arduino:avr:uno";
};

BlocklyDuino.bindFunctions = function() {
	$('#btn_compile').on('click', async function () {
	const $btn = $(this).prop('disabled', true).addClass('sending');
	const boardToFqbn = {
		nano:  "arduino:avr:nano",
		uno:   "arduino:avr:uno",
		mega:  "arduino:avr:mega",
		pro16: "arduino:avr:pro:cpu=16MHzatmega328",
		esp32: "esp32:esp32:esp32",
		// …добавляйте остальные
	};

	try {
		await BlocklyDuino.compileOnServer({
		apiUrl: "https://robobocodecompiler-robobo.amvera.io/compile/",
		boardToFqbn
		});

		//  Сделать кнопку зелёной
		$btn.removeClass('btn-danger').addClass('btn-success');

		// 👉 подключаем .hex к кнопке загрузки
    	document.querySelector('[arduino-uploader]').setAttribute('hex-href', localStorage.lastBuildUrl);
		alert("✅ Компиляция прошла успешно. Можно загружать на плату!");
	} catch (e) {
		console.error(e);
		$btn.removeClass('btn-success').addClass('btn-danger');
		alert("Ошибка компиляции: " + e.message);
	} finally {
		$btn.prop('disabled', false).removeClass('sending');
	}
	});
	$('#btn_log').on('click', function () {
	const code = (window.localStorage.prog !== 'python')
		? Blockly.Arduino.workspaceToCode(BlocklyDuino.workspace)
		: Blockly.Python.workspaceToCode(BlocklyDuino.workspace);
		// console.clear();
		console.log('===== Generated code =====\n' + code);
	});
	$('.modal-child').on('show.bs.modal', function () {
		var modalParent = $(this).attr('data-modal-parent');
		$(modalParent).css('opacity', 0)
	}); 
	$('.modal-child').on('hidden.bs.modal', function () {
		var modalParent = $(this).attr('data-modal-parent');
		$(modalParent).css('opacity', 1)
	});
	$('#btn_new').on("click", BlocklyDuino.discard);
	$('#btn_undo').on("click", BlocklyDuino.Undo);
	$('#btn_redo').on("click", BlocklyDuino.Redo);
	$('#btn_print').on("click", BlocklyDuino.workspace_capture);
	
	$('#btn_search').on("click", BlocklyDuino.search);
	$('#boards').on("focus", function() {
		BlocklyDuino.selectedCard = $(this).val()
	});
	$('#btn_preview').on("click", function() {
		$("#toggle").toggle("slide")
	});
	$('#codeORblock').on("change", function() {
		if (window.localStorage.prog!="python") {
			editor.session.setMode("ace/mode/c_cpp");
			editor.setOptions({
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});
		} else {
			editor.session.setMode("ace/mode/python");
			editor.setOptions({
				enableBasicAutocompletion: true,
				enableSnippets: true,
				enableLiveAutocompletion: true
			});
		}
		if (window.localStorage.content=="on") {
			editor.setValue($('#pre_previewArduino').text(),1);
			$('a[href="#content_code"]').tab('show');
			$('#btn_print').addClass("hidden");
			$('#btn_preview').addClass("hidden");
			$('#btn_search').removeClass("hidden");
			
			$('#btn_fakeload').addClass("hidden");
			$('#btn_new').addClass("hidden");
			$('#btn_example').addClass("hidden");
			$('#toner').addClass("hidden");
			$('#btn_saveXML').addClass("hidden");
			
			window.localStorage.content="off"
		} else {
			$('a[href="#content_blocks"]').tab('show');
			$('#btn_print').removeClass("hidden");
			$('#btn_preview').removeClass("hidden");
			$('#btn_search').addClass("hidden");
		
		$('#btn_fakeload').removeClass("hidden");
		$('#btn_new').removeClass("hidden");
		$('#btn_example').removeClass("hidden");
		$('#toner').removeClass("hidden");
		$('#btn_saveXML').removeClass("hidden");
		
			window.localStorage.content="on"
		} 
	});
/* 	Keep code preview window visible when clicked to allow selection
	$('#pre_previewArduino').on("click", function() {
		$("#toggle").toggle("slide");
	}); */
	$('#btn_verify').mouseover(function() {
		document.getElementById("survol").textContent = "Check the code";
	}).mouseout(function() {
		document.getElementById("survol").textContent = "";
	});
	$('#btn_flash').mouseover(function() {
		document.getElementById("survol").textContent = "Upload to robot board";
	}).mouseout(function() {
		document.getElementById("survol").textContent = "";
	});
	$('#btn_bin').mouseover(function() {
		document.getElementById("survol").textContent = "Export as Binary .hex";
	}).mouseout(function() {
		document.getElementById("survol").textContent = "";
	});
	$('#toolboxes').on("focus", function() {
		BlocklyDuino.selectedToolbox = $(this).val();
	});
	$('#toolboxes').on("change", BlocklyDuino.changeToolboxDefinition);	
	$('#configModal').on('hidden.bs.modal', function(e) {
		BlocklyDuino.loadToolboxDefinition(BlocklyDuino.selectedToolbox);
	});
	$('#load').on("change", BlocklyDuino.load);
	$('#btn_fakeload').on("click", function() {
		$('#load').click()
	});
	$('#btn_config').on("click", BlocklyDuino.openConfigToolbox);
	$('#btn_level1').on("click", BlocklyDuino.buildToolboxLevel1);
	$('#btn_level2').on("click", BlocklyDuino.buildToolboxLevel2);
	$('#btn_level3').on("click", BlocklyDuino.buildToolboxLevel3);
	
	$('#select_all').on("click", BlocklyDuino.checkAll);
	$('#btn_valid_config').on("click", BlocklyDuino.changeToolbox);
	$('#btn_example').on("click", BlocklyDuino.buildExamples);
	$('#btn_term').click(function() {
		$('#terminalModal').modal('show');
	});
	if(typeof process === 'undefined') {
		$('#btn_factory').on("click", function() {
			window.open("factory.html","_blank", null);
		});
		$('#btn_saveXML').on("click", BlocklyDuino.saveXmlFile);
		$('#btn_saveino').on("click", function () {
			if (window.localStorage.prog == "arduino") {
				BlocklyDuino.saveino()
			} else {
				BlocklyDuino.savepy()
			}
		});
	}
};
BlocklyDuino.checkAll = function() {
    if(this.checked) {
        $('#modal-body-config input:checkbox[id^=checkbox_]').each(function() {
            this.checked = true;
        });
    } 
      else {
      $('#modal-body-config input:checkbox[id^=checkbox_]').each(function() {
            this.checked = false;
        });
    }
};
BlocklyDuino.openConfigToolbox = function() {
	var modalbody = $("#modal-body-config");
	var loadIds = window.localStorage.toolboxids;
	if (loadIds === undefined || loadIds === "") {
		if ($('#defaultCategories1').length) {
			loadIds = $('#defaultCategories1').html();
		} else {
			loadIds = '';
		}
	}
	modalbody.empty();
	var i=0, n;
	var ligne = "";
	$("#toolbox").children("category").each(function() {
		n = loadIds.search($(this).attr("id"));
		if (n >= 0) {
			ligne = '<input type="checkbox" checked="checked" name="checkbox_' +i+ '" id="checkbox_' +$(this).attr("id")+ '"/> ' +Blockly.Msg[$(this).attr("id")]+ '<br/>';
		} else {
			ligne = '<input type="checkbox" name="checkbox_' +i+ '" id="checkbox_' +$(this).attr("id")+ '"/> ' +Blockly.Msg[$(this).attr("id")]+ '<br/>';
		}
		i++;
		modalbody.append(ligne);
     });
};
BlocklyDuino.changeToolbox = function() {
	BlocklyDuino.backupBlocks();
	var toolboxIds = [];
	window.localStorage.lang = $('#languageMenu').val();
	$('#modal-body-config input:checkbox[id^=checkbox_]').each(function() {
		if (this.checked == true) {
			var xmlid = this.id;
			toolboxIds.push(xmlid.replace("checkbox_", ""))
		}
	});
	window.localStorage.toolboxids = toolboxIds;
	Blockly.getMainWorkspace().updateToolbox(BlocklyDuino.buildToolbox());
	BlocklyDuino.workspace.render();
	$('#configModal').modal('hide')
	window.location.reload();
};

BlocklyDuino.changelanguage = function() {
	window.localStorage.lang = $('#languageMenu').val();
	window.location.reload();
};




BlocklyDuino.buildToolbox = function() {
	var loadIds = window.localStorage.toolboxids;
	if (loadIds === undefined || loadIds === "") {
		if ($('#defaultCategories1').length) {
			loadIds = $('#defaultCategories1').html();
		} else {
			loadIds = '';
		}
	}
	var xmlValue = '<xml id="toolbox">';	
	var xmlids = loadIds.split(",");
	for (var i = 0; i < xmlids.length; i++) {
		if ($('#'+xmlids[i]).length) {
			xmlValue += $('#'+xmlids[i])[0].outerHTML;
		}
	}
	xmlValue += '</xml>';
	return xmlValue;
};


BlocklyDuino.buildToolboxLevel1 = function() {
	var loadIds = []; 
	
	if ($('#defaultCategories1').length) {
			loadIds = $('#defaultCategories1').html();
	} 
	window.localStorage.toolboxids=loadIds;
	window.localStorage.level=1;
	
	var xmlValue = '<xml id="toolbox">';	
	var xmlids = loadIds.split(",");
	for (var i = 0; i < xmlids.length; i++) {
		if ($('#'+xmlids[i]).length) {
			xmlValue += $('#'+xmlids[i])[0].outerHTML;
		}
	}
	xmlValue += '</xml>';
	Blockly.getMainWorkspace().updateToolbox(xmlValue);
	
};

BlocklyDuino.buildToolboxLevel2 = function() {
	var loadIds = []; 
	
	if ($('#defaultCategories2').length) {
			loadIds = $('#defaultCategories2').html();
	} 
	window.localStorage.toolboxids=loadIds;
	window.localStorage.level=2;
	
	
	var xmlValue = '<xml id="toolbox">';	
	var xmlids = loadIds.split(",");
	for (var i = 0; i < xmlids.length; i++) {
		if ($('#'+xmlids[i]).length) {
			xmlValue += $('#'+xmlids[i])[0].outerHTML;
		}
	}
	xmlValue += '</xml>';
	Blockly.getMainWorkspace().updateToolbox(xmlValue);
	
};

BlocklyDuino.buildToolboxLevel3 = function() {
	var loadIds = []; 
	
	if ($('#defaultCategories3').length) {
			loadIds = $('#defaultCategories3').html();
	} 
	
	window.localStorage.toolboxids=loadIds;
	window.localStorage.level=3;
	
	var xmlValue = '<xml id="toolbox">';	
	var xmlids = loadIds.split(",");
	for (var i = 0; i < xmlids.length; i++) {
		if ($('#'+xmlids[i]).length) {
			xmlValue += $('#'+xmlids[i])[0].outerHTML;
		}
	}
	xmlValue += '</xml>';
	Blockly.getMainWorkspace().updateToolbox(xmlValue);
	
	
};



BlocklyDuino.loadToolboxDefinition = function(toolboxFile) {
	$.ajax({
		type: "GET",
		url: "./toolbox/" + toolboxFile + ".xml",
		dataType: "xml",
		async : false
	}).done(function(data){
		var toolboxXml = '<xml id="toolbox" style="display: none">' + $(data).find('toolbox').html() + '</xml>';
		$("#toolbox").remove();
		$('body').append(toolboxXml);	
		$("xml").find("category").each(function() {
			if (!$(this).attr('id')) {
				$(this).attr('id', $(this).attr('name'));
				$(this).attr('name', Blockly.Msg[$(this).attr('name')])
			}
		})
	}).fail(function(data) {
		$("#toolbox").remove()
	})
};
BlocklyDuino.changeToolboxDefinition =  function() {
	BlocklyDuino.loadToolboxDefinition($("#toolboxes").val());
	BlocklyDuino.openConfigToolbox();
};
BlocklyDuino.buildExamples = function() {
	$.ajax({
	    cache: false,
	    url: "./examples/examples.json",
	    dataType: "json",
	    success :  function(data) {
			$("#includedContent").empty();
			$.each(data, function(i, example){
				if (example.visible) {
					var line = "<tr><td>"
							   + "<a href='?url=./examples/"+example.source_url+"'>" + example.source_text + "</a>"
							  // + "</td><td>"
							  // + "<a href='"+example.link_url+"' data-toggle='modal'>"
							 //  + "<img class='vignette' src='./examples/"+example.image+"'></a>"
							   + "</td></tr>";
					$("#includedContent").append(line);
				}
			});
		}
	});
};
Blockly.Variables.flyoutCategory = function(workspace) {
	var variableList = workspace.variableList;
	variableList.sort(goog.string.caseInsensitiveCompare);
	var xmlList = [];
	var button = goog.dom.createDom('button');
	button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
	button.setAttribute('callbackKey', 'CREATE_VARIABLE');
	Blockly.registerButtonCallback('CREATE_VARIABLE', function(button) {
		Blockly.Variables.createVariable(button.getTargetWorkspace());
	});
	xmlList.push(button);
	if (variableList.length > 0) {
		if (window.localStorage.prog!="python") {
			if (Blockly.Blocks['variables_set_init']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'variables_set_init');
				block.setAttribute('gap', 8);
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			if (Blockly.Blocks['variables_set']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'variables_set');
				block.setAttribute('gap', 8);
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			if (Blockly.Blocks['math_change']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'math_change');
				block.setAttribute('gap', 8);
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			if (Blockly.Blocks['variables_const']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'variables_const');
				block.setAttribute('gap', 8);
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			if (Blockly.Blocks['base_define_const']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'base_define_const');
				if (Blockly.Blocks['variables_get']) {
					block.setAttribute('gap', 16);
				}
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			for (var i = 0; i < variableList.length; i++) {
			  if (Blockly.Blocks['variables_get']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'variables_get');
				if (Blockly.Blocks['variables_set']) {
				  block.setAttribute('gap', 8);
				}
				var field = goog.dom.createDom('field', null, variableList[i]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			  }
			}
		} else {
			if (Blockly.Blocks['variables_set']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'variables_set');
				block.setAttribute('gap', 8);
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			if (Blockly.Blocks['math_change']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'math_change');
				block.setAttribute('gap', 8);
				var field = goog.dom.createDom('field', null, variableList[0]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			}
			for (var i = 0; i < variableList.length; i++) {
			  if (Blockly.Blocks['variables_get']) {
				var block = goog.dom.createDom('block');
				block.setAttribute('type', 'variables_get');
				if (Blockly.Blocks['variables_set']) {
				  block.setAttribute('gap', 8);
				}
				var field = goog.dom.createDom('field', null, variableList[i]);
				field.setAttribute('name', 'VAR');
				block.appendChild(field);
				xmlList.push(block);
			  }
			}
		}
	}
  return xmlList;
};
BlocklyDuino.workspace_capture = function() {
	var ws = BlocklyDuino.workspace.svgBlockCanvas_.cloneNode(true);
	ws.removeAttribute("width");
	ws.removeAttribute("height");
	ws.removeAttribute("transform");
	var styleElem = document.createElementNS("http://www.w3.org/2000/svg", "style");
	styleElem.textContent = Blockly.Css.CONTENT.join('') ;
	ws.insertBefore(styleElem, ws.firstChild);
	var bbox = BlocklyDuino.workspace.svgBlockCanvas_.getBBox();
	var canvas = document.createElement( "canvas" );
	canvas.width = Math.ceil(bbox.width+10);
	canvas.height = Math.ceil(bbox.height+10);
	var ctx = canvas.getContext( "2d" );
	var xml = new XMLSerializer().serializeToString(ws);
	xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+bbox.width+'" height="'+bbox.height+'" viewBox="' + bbox.x + ' ' + bbox.y + ' '  + bbox.width + ' ' + bbox.height + '"><rect width="100%" height="100%" fill="white"></rect>'+xml+'</svg>';
	var img = new Image();
	img.setAttribute( "src", 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml))));
	img.onload = function() {
		ctx.drawImage( img, 5, 5 );
		var canvasdata = canvas.toDataURL("image/png",1);
		var datenow = Date.now();
		var a = document.createElement("a");
		a.download = "capture"+datenow+".png";
		a.href = canvasdata;
		document.body.appendChild(a);
		a.click();
	}	
};
BlocklyDuino.cardPicture_change = function() {
 //	if($("#pinout").val()=="nanooptiboot"||$("#pinout").val()=="nano"||$("#pinout").val()=="nona4809"){
// 		$("#warning").show();
// 	}else{
// 		$("#warning").hide();
// 	}
	if ($("#pinout").val()) {
		$('#arduino_card_mini_picture').attr("src", profile[$("#pinout").val()]['picture'])
	} else {
		$('#arduino_card_mini_picture').attr("src", "")
	}
	
	if($("#pinout").val()=="nano")
		document.getElementById('infoboard').innerHTML=MSG[$("#pinout").val()];
	else
		document.getElementById('infoboard').innerHTML="";
		
};
BlocklyDuino.saveino = function() {
    var code = $('#pre_previewArduino').text();
    var datenow = Date.now();
    var filename = "arduino" + datenow + ".ino";
    var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
};
BlocklyDuino.savepy = function() {
    var code = $('#pre_previewArduino').text();
    var datenow = Date.now();
    var filename = "python" + datenow + ".py";
    var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
};
BlocklyDuino.saveXmlFile = function () {
    if (window.localStorage.content == "on") {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var toolbox = window.localStorage.toolbox;
        if (!toolbox) {
            toolbox = $("#toolboxes").val();
        }
        if (toolbox) {
            var newel = document.createElement("toolbox");
            newel.appendChild(document.createTextNode(toolbox));
            xml.insertBefore(newel, xml.childNodes[0]);
        }
        var toolboxids = window.localStorage.toolboxids;
        if (toolboxids === undefined || toolboxids === "") {
            if ($('#defaultCategories1').length) {
                toolboxids = $('#defaultCategories1').html();
            }
        }
        var data = Blockly.Xml.domToPrettyText(xml);
        var datenow = Date.now();
        var filename = "block" + datenow + ".txt";
        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    } else if (window.localStorage.prog == "arduino") {
        var code = editor.getValue();
        var datenow = Date.now();
        var filename = "arduino" + datenow + ".ino";
        var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    } else {
        var code = editor.getValue();
        var datenow = Date.now();
        var filename = "python" + datenow + ".py";
        var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }
};
