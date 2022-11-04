"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// create Schema
// mongoose can help user. String적어야 할 곳에 int 적어도 String으로 바꾸어준다.
var videoSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 80
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 5
  },
  createdAt: {
    type: Date,
    required: true,
    "default": Date.now
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  meta: {
    views: {
      type: Number,
      "default": 0,
      required: true
    },
    rating: {
      type: Number,
      "default": 0,
      required: true
    }
  },
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "Comment"
  }],
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

/* middleware */

/*
  videoSchema.pre("save", async function () {
    this.hashtags = this.hashtags[0]
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`));
  });
*/
/* 이 방법 단점 : Video.findByIdAndUpdate, Create등등.. mongoose모델의 다양한 function을 사용하는데,
이들은 save훅업이 발생하지 않음. -> 즉, pre()형태로 이용 할 수 가 없음.  */
// 해결책 1.Video.js에 function을 별도로 만들어서 export -> 괜찮으나 더 좋은 방법이 있을듯
/*export const formatHashtags  = (hashtags) => {
          hashtags
              .split(",")
              .map((word) => (word.startsWith("#") ? word : `#${word}`))
        }*/
// 2. 모델에 static함수를 추가. -> findByIdAndUpdate , Create등등의 함수를 직접 만들어서 쓰기.

videoSchema["static"]("formatHashtags", function (hashtags) {
  return hashtags.split(",").map(function (word) {
    return word.startsWith("#") ? word : "#".concat(word);
  });
});
var Video = _mongoose["default"].model("Video", videoSchema); // create model
var _default = Video;
exports["default"] = _default;