function drawShape(canvas, text, height) {
  const context = canvas.getContext("2d");
  const foreColor = canvas.getAttribute("foreColor");
  const backColor = canvas.getAttribute("backColor");
  const shape = canvas.getAttribute("shape");

  const font = "bold " + height / 2 + "px Roboto";

  if (shape === "circle") {
    var width = height;
  }
  if (shape === "rectangle") {
    context.font = font;
    var textWidth = Math.max(context.measureText(text).width, 1);
    var margin = textWidth * 0.5;
    //   var width = textWidth + height * 0.7;
    var width = textWidth + margin;
  }

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  var centerX = width / 2;
  var centerY = height / 2;

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

  var href = convertToImage(canvas, text, foreColor, backColor, width, height);

  if (shape === "circle") {
    const iconImageCollection = document.getElementById("icons");
    iconImageCollection.appendChild(href);
  }
  if (shape === "rectangle") {
    const nametageImageCollection = document.getElementById("nametags");
    nametageImageCollection.appendChild(href);
  }
}

function convertToImage(canvas, fileText, foreColor, backColor, width, height) {
  var colorDict = {
    "#121822": "black",
    "#52e4c0": "mint",
    "#ee4cf7": "pink",
  };
  var fileName = "rectangle_" + fileText + "_" + colorDict[foreColor] + "-on-" + colorDict[backColor] + "_" + height;
  var target = new Image();
  target.src = canvas.toDataURL("image/png");
  target.style.width = width;
  target.style.height = height;
  target.style.margin = "4px";

  var href = document.createElement("a");

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

  var height = rangeElement.value;
  var iconText = iconTextElement.value;
  var nameText = nameTagElement.value;
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
  console.log(linkText);
  var linkElement = document.getElementById("link");
  linkElement.innerHTML = linkText;
  linkElement.setAttribute("href", linkText);
}

window.onload = () => draw(true);
