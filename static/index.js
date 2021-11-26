const socketIo = io();

socketIo.emit("userJoined");
socketIo.on("joined", (data) => {
  console.log(data);
});

const form = document.getElementById("form");
form.onsubmit = async (e) => {
  e.preventDefault();

  const comment = e.target.comment.value;

  if (!comment || comment === "") {
    document.getElementById("error").style.display = "block";
    document.getElementById("neutral").style.display = "none";
    document.getElementById("positive").style.display = "none";
    document.getElementById("negative").style.display = "none";
    document.getElementById("error").innerHTML = "Please add comment";
    return;
  }

  const formData = new FormData();
  formData.append("comment", comment);

  document.getElementById("neutral").style.display = "none";
  document.getElementById("positive").style.display = "none";
  document.getElementById("negative").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("loading").style.display = "block";
  document.getElementById(
    "loading"
  ).innerHTML = `<h3><i class="fas fa-truck-loading"></i> Predicting...</h3>`;

  const response = await axios.post("/predict", formData);
  if (response.data.success) {
    if (response.data.prediction.trim() === "Neutral") {
      document.getElementById("neutral").style.display = "block";
      document.getElementById("positive").style.display = "none";
      document.getElementById("negative").style.display = "none";
      document.getElementById("error").style.display = "none";
      document.getElementById("loading").style.display = "none";
      document.getElementById(
        "neutral"
      ).innerHTML = `<h3><i class="fas fa-meh-rolling-eyes"></i> ${response.data.prediction}</h3>`;
    } else if (response.data.prediction.trim() === "Negative") {
      document.getElementById("neutral").style.display = "none";
      document.getElementById("positive").style.display = "none";
      document.getElementById("negative").style.display = "block";
      document.getElementById("error").style.display = "none";
      document.getElementById("loading").style.display = "none";
      document.getElementById(
        "negative"
      ).innerHTML = `<h3><i class="fas fa-frown"></i> ${response.data.prediction}</h3>`;
    } else {
      document.getElementById("neutral").style.display = "none";
      document.getElementById("positive").style.display = "block";
      document.getElementById("negative").style.display = "none";
      document.getElementById("error").style.display = "none";
      document.getElementById("loading").style.display = "none";
      document.getElementById(
        "positive"
      ).innerHTML = `<h3><i class="fas fa-smile-beam"></i> ${response.data.prediction}</h3>`;
    }
  }
};
