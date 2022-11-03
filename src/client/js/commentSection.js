const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#deleteCommentBtn");

const addComment = (text, commentId) => {
  //  constructing HTML elements with JS -> realtime comments
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.dataset.id = commentId; // enabling user to delete comments that has been just created
  span2.dataset.videoId = videoContainer.dataset.id;
  span2.id = "newCommentBtn";
  span2.className = "video__comment-delete";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment); // prepend는 맨 위에 추가함. / appendChild는 맨 밑에 추가함.
  const newDeleteCommentBtn = document.querySelector("#newCommentBtn");
  newDeleteCommentBtn.addEventListener("click", handleClick);
};

const handleClick = async (event) => {
  const { id, videoId } = event.target.dataset;
  // videoId까지 찾아주는 이유 : video마다 코멘트가 달려있기 때문에..
  const response = await fetch(`/api/videos/${videoId}/comments/${id}/delete`, {
    method: "DELETE",
    body: { id, videoId },
  });
  if (response.status === 200) {
    event.target.parentNode.remove();
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text === "" || text.trim() === "") {
    return;
  }
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    // backend -> frontend : sending response
    // fetch는 promise<Response> 기다리면 response라는 것을 준다.
    method: "POST",
    headers: {
      "Content-Type": "application/json", // request에 대한 정보를 담고있는 headers / 백엔드야 json을 string처럼 만들어서 보내고 있다.라고 알려주는것.
    },
    body: JSON.stringify({ text }), // json object를 string으로 바꿔서 보내지만 백엔드에서는 express.json()을 써주었기 때문에 다시 json으로 바꿔서 받아들일것.
  });
  if (response.status == 201) {
    textarea.value = "";
    const { newCommentId } = await response.json(); // getting json object from response
    addComment(text, newCommentId); // sending newCommentId to frontend
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtn) {
  deleteBtn.forEach((btn) => btn.addEventListener("click", handleClick));
}
