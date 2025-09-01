import "./uiCollection.css";

const roomList = [
  { name: "주방", index: 1 },
  { name: "거실", index: 2 },
  { name: "침실1", index: 3 },
  { name: "야외", index: 4 },
  { name: "테라스1", index: 5 },
  { name: "테라스2", index: 6 },
];

function uiCollection(core) {
  createRoomList(roomList, core);
  createModal(core);
}

function createRoomList(roomInfo, core) {
  const parentDiv = document.getElementById("container");
  const container = document.createElement("div");
  container.className = "room-list-container";

  const ul = document.createElement("ul");
  ul.className = "room-list";

  roomInfo.forEach((room) => {
    const li = document.createElement("li");
    li.className = "room-list-item";
    li.addEventListener("click", () => {
      core.movePlace(room.index);
    });

    const p = document.createElement("p");
    p.textContent = room.name;
    li.appendChild(p);
    ul.appendChild(li);
  });

  container.appendChild(ul);
  parentDiv.appendChild(container);
}

function createModal(core) {
  const container = document.getElementById("container");
  const modalDiv = document.createElement("div");
  modalDiv.id = "modalDiv";
  modalDiv.addEventListener("click", () => {
    modalDiv.style.display = "none";
  });

  const contentDiv = createModalContent(core);
  modalDiv.appendChild(contentDiv);
  container.appendChild(modalDiv);
}

function createModalContent(core) {
  const contentDiv = document.createElement("div");
  contentDiv.id = "optionInfo";

  contentDiv.appendChild(createImageSection());
  contentDiv.appendChild(createDivider());
  contentDiv.appendChild(createProductInfo());
  contentDiv.appendChild(createDivider());
  contentDiv.appendChild(createColorSection());
  contentDiv.appendChild(createColorOptions());
  contentDiv.appendChild(createDivider());
  contentDiv.appendChild(createDescription());
  contentDiv.appendChild(createDivider());
  contentDiv.appendChild(createSpecs());
  contentDiv.appendChild(createDivider());
  contentDiv.appendChild(createPriceSection());

  return contentDiv;
}

function createImageSection() {
  const imageSection = document.createElement("div");
  imageSection.className = "image-section";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-wrapper";

  const img = document.createElement("img");
  img.src = "https://placehold.co/177x133";
  imageWrapper.appendChild(img);

  const zoomSection = document.createElement("div");
  zoomSection.className = "zoom-section";

  const zoomWrapper = document.createElement("div");
  zoomWrapper.className = "zoom-wrapper";

  const zoomText = document.createElement("div");
  zoomText.className = "zoom-text";
  zoomText.textContent = "크게보기";

  zoomWrapper.appendChild(zoomText);
  zoomSection.appendChild(zoomWrapper);

  imageSection.appendChild(imageWrapper);
  imageSection.appendChild(zoomSection);

  return imageSection;
}

function createDivider() {
  const divider = document.createElement("div");
  divider.className = "divider";
  return divider;
}

function createProductInfo() {
  const productInfo = document.createElement("div");
  productInfo.className = "product-info";

  const productName = document.createElement("div");
  productName.className = "product-name";
  productName.textContent = "BESPOKE 오븐 Infinite Line 50L";

  const productCode = document.createElement("div");
  productCode.className = "product-code";
  productCode.textContent = "NQ50T9539BD";

  productInfo.appendChild(productName);
  productInfo.appendChild(productCode);

  return productInfo;
}

function createColorSection() {
  const colorSection = document.createElement("div");
  colorSection.className = "color-section";

  const colorLabel = document.createElement("div");
  colorLabel.className = "color-label";
  colorLabel.textContent = "색상";

  const colorValue = document.createElement("div");
  colorValue.className = "color-value";
  colorValue.textContent = "글램차콜";

  colorSection.appendChild(colorLabel);
  colorSection.appendChild(colorValue);

  return colorSection;
}

function createColorOptions() {
  const colorOptions = document.createElement("div");
  colorOptions.className = "color-options";

  const colors = ["#272727", "#FFFFFF", "#002D00"];
  colors.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.className = "color-option";

    const innerCircle = document.createElement("div");
    innerCircle.className = "inner-circle";
    innerCircle.style.backgroundColor = color;

    const borderCircle = document.createElement("div");
    borderCircle.className = "border-circle";

    borderCircle.appendChild(innerCircle);
    colorDiv.appendChild(borderCircle);
    colorOptions.appendChild(colorDiv);
  });

  return colorOptions;
}

function createDescription() {
  const description = document.createElement("div");
  description.className = "description";

  const descriptionText = document.createElement("div");
  descriptionText.className = "description-text";
  descriptionText.innerHTML = `
    윗면의 72개 에어홀에서 내려오는 강력한 직화열풍으로 음식의 표면은 더욱 바삭해지고, 
    지름 154 mm의 대형 팬이 내부의 열풍을 고르게 순환시켜 빠르게 조리가 가능합니다.<br>
    한국인이 좋아하는 23가지 요리는 더욱 간단하게!
  `;

  description.appendChild(descriptionText);

  return description;
}

function createSpecs() {
  const specs = document.createElement("div");
  specs.className = "specs";

  const specItems = [
    ["용량", "50L"],
    ["오븐온도", "40~250℃"],
    ["규격", "595 x 456 x 570mm"],
    ["앱기능", "있음"],
    ["설치방식", "프리스탠징"],
  ];

  specItems.forEach(([label, value]) => {
    const specRow = document.createElement("div");
    specRow.className = "spec-row";

    const specLabel = document.createElement("div");
    specLabel.className = "spec-label";
    specLabel.textContent = label;

    const specValue = document.createElement("div");
    specValue.className = "spec-value";
    specValue.textContent = value;

    specRow.appendChild(specLabel);
    specRow.appendChild(specValue);
    specs.appendChild(specRow);
  });

  return specs;
}

function createPriceSection() {
  const priceSection = document.createElement("div");
  priceSection.className = "price-section";

  const priceInfo = document.createElement("div");
  priceInfo.className = "price-info";

  const basePrice = document.createElement("div");
  basePrice.className = "base-price";
  basePrice.textContent = "기준가: 1,000,000원";

  const optionPrice = document.createElement("div");
  optionPrice.className = "option-price";
  optionPrice.textContent = "옵션가: 980,000원";

  priceInfo.appendChild(basePrice);
  priceInfo.appendChild(optionPrice);

  const optionButton = document.createElement("div");
  optionButton.className = "option-button";

  const buttonText = document.createElement("div");
  buttonText.className = "button-text";
  buttonText.textContent = "옵션선택";
  buttonText.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("옵션");
  });

  optionButton.appendChild(buttonText);

  priceSection.appendChild(priceInfo);
  priceSection.appendChild(optionButton);

  return priceSection;
}

export default uiCollection;
