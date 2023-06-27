function drawShape(canvas, text, height) {
  const context = canvas.getContext("2d");
  const foreColor = canvas.getAttribute("foreColor");
  const backColor = canvas.getAttribute("backColor");
  const shape = canvas.getAttribute("shape");

  const font = "bold " + height / 2 + "px Roboto";

  let width = height;

  if (shape === "rectangle") {
    context.font = font;
    const textWidth = Math.max(context.measureText(text).width, 1);
    const margin = textWidth * 0.5;
    //   var width = textWidth + height * 0.7;
    width = textWidth + margin;
  }

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  const centerX = width / 2;
  const centerY = height / 2;

  context.beginPath();

  if (shape === "circle") {
    context.arc(centerX, centerY, height / 2, 0, 2 * Math.PI, false);
  }
  if (shape === "rectangle") {
    context.rect(0, 0, width, height, false);
  }

  context.fillStyle = backColor;
  context.fill();

  context.font = font;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = foreColor;

  // Roboto Baseline is not "centered"
  context.translate(0, height * 0.05);
  context.fillText(text, centerX, centerY);

  const href = convertToImage(canvas, shape, text, foreColor, backColor, width, height);

  if (shape === "circle") {
    const iconImageCollection = document.getElementById("icons");
    iconImageCollection.appendChild(href);
  }
  if (shape === "rectangle") {
    const nametageImageCollection = document.getElementById("nametags");
    nametageImageCollection.appendChild(href);
  }
}

function convertToImage(canvas, shape, fileText, foreColor, backColor, width, height) {
  const colorDict = {
    "#121822": "black",
    "#52e4c0": "mint",
    "#ee4cf7": "pink",
  };

  const fileName = shape + "_" + fileText + "_" + colorDict[foreColor] + "-on-" + colorDict[backColor] + "_" + height;
  const target = new Image();
  target.src = canvas.toDataURL("image/png");
  target.style.width = width;
  target.style.height = height;
  // target.style.margin = "4px";

  const href = document.createElement("a");
  href.title = "Save as..";

  // make the filename file-safe
  href.download = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".png";
  href.href = target.src;
  href.appendChild(target);
  return href;
}

function draw(fromUrl) {
  const rangeElement = document.getElementById("rangeId");
  const iconTextElement = document.getElementById("iconTextId");
  const nameTagElement = document.getElementById("nameTextId");

  let height = rangeElement.value;
  let iconText = iconTextElement.value;
  let nameText = nameTagElement.value;
  if (fromUrl) {
    const urlParams = new URL(window.location.toLocaleString()).searchParams;

    const urlHeight = urlParams.get("height");
    if (urlHeight != null) {
      height = urlHeight;
      rangeElement.value = urlHeight;
    }

    const urlIconText = urlParams.get("initials");
    if (urlIconText != null) {
      iconText = urlIconText;
      iconTextElement.value = urlIconText;
    }

    const urlNameTag = urlParams.get("text");
    if (urlNameTag != null) {
      nameText = urlNameTag;
      nameTagElement.value = urlNameTag;
    }
  }

  document.getElementById("icons").innerHTML = "";
  document.getElementById("nametags").innerHTML = "";

  const allCanvas = document.getElementsByTagName("canvas");
  Array.from(allCanvas).forEach((canvas) => {
    if (canvas.getAttribute("shape") === "circle") {
      drawShape(canvas, iconText, height);
    }
    if (canvas.getAttribute("shape") === "rectangle") {
      drawShape(canvas, nameText, height);
    }
  });

  // update url
  const linkText = window.location.origin + window.location.pathname + "?text=" + nameText + "&initials=" + iconText + "&height=" + height;
  const linkElement = document.getElementById("link");
  linkElement.innerHTML = linkText;
  linkElement.setAttribute("href", linkText);
}

window.onload = () => draw(true);
