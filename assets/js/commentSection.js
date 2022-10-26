/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/commentSection.js":
/*!*****************************************!*\
  !*** ./src/client/js/commentSection.js ***!
  \*****************************************/
/***/ (() => {

eval("const videoContainer = document.getElementById(\"videoContainer\");\nconst form = document.getElementById(\"commentForm\");\nconst btn = form.querySelector(\"button\");\n\nconst addCommnet = text => {\n  //  constructing HTML elements with JS -> realtime comments\n  const videoComments = document.querySelector(\".video__comments ul\");\n  const newComment = document.createElement(\"li\");\n  newComment.className = \"video__comment\";\n  const icon = document.createElement(\"i\");\n  icon.className = \"fas fa-comment\";\n  const span = document.createElement(\"span\");\n  span.innerText = ` ${text}`;\n  newComment.appendChild(icon);\n  newComment.appendChild(span);\n  videoComments.prepend(newComment); // prepend는 맨 위에 추가함. / appendChild는 맨 밑에 추가함.\n};\n\nconst handleSubmit = async event => {\n  event.preventDefault();\n  const textarea = form.querySelector(\"textarea\");\n  const text = textarea.value;\n\n  if (text === \"\" || text.trim() === \"\") {\n    return;\n  }\n\n  const videoId = videoContainer.dataset.id;\n  const {\n    status\n  } = await fetch(`/api/videos/${videoId}/comment`, {\n    // fetch는 promise<Response> 기다리면 response라는 것을 준다.\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\" // request에 대한 정보를 담고있는 headers / 백엔드야 json을 string처럼 만들어서 보내고 있다.라고 알려주는것.\n\n    },\n    body: JSON.stringify({\n      text\n    }) // json object를 string으로 바꿔서 보내지만 백엔드에서는 express.json()을 써주었기 때문에 다시 json으로 바꿔서 받아들일것.\n\n  });\n  textarea.value = \"\";\n\n  if (status == 201) {\n    addCommnet(text);\n  }\n};\n\nif (form) {\n  form.addEventListener(\"submit\", handleSubmit);\n}\n\n//# sourceURL=webpack://fitips/./src/client/js/commentSection.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/commentSection.js"]();
/******/ 	
/******/ })()
;