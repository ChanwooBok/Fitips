const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const btn = form.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text === "" || text.trim() === "") {
    return;
  }
  const videoId = videoContainer.dataset.id;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // request에 대한 정보를 담고있는 headers / 백엔드야 json을 string처럼 만들어서 보내고 있다.라고 알려주는것.
    },
    body: JSON.stringify({ text }), // json object를 string으로 바꿔서 보내지만 백엔드에서는 express.json()을 써주었기 때문에 다시 json으로 바꿔서 받아들일것.
  });
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
