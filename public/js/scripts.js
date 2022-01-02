const header = document.getElementById("header");
const toggleMenuButton = document.getElementById("togglemenubutton");
const menuOverlay = document.getElementById("menuoverlay");
const cartButton = document.getElementById("cartbutton");
const cart = document.querySelector(".cart");
const cartForm = document.getElementById("cartform");
const product = document.getElementsByClassName("product")[0];
const cartProducts = document.getElementsByClassName("cartproducts")[0];
const productForm = document.getElementsByClassName("productform")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const buttonCloseModal = document.getElementsByClassName("button--close")[0];
const buttonProduct = document.getElementsByClassName("buttonproduct")[0];

let quantityToBuy = 0;
let slideIndex = 0;
let slideModalIndex = 0;

const actualizeCartIndicator = () => {
  const cartIndicator = document.getElementsByClassName("cartindicator")[0];
  const totalQuantity = document.getElementsByClassName("item__quantity");
  let cartIndicatorQuantity = 0;

  [...totalQuantity].forEach((item) => {
    cartIndicatorQuantity += parseInt(item.textContent.slice(0, -1));
  });
  cartIndicator.textContent = cartIndicatorQuantity;
};

const changeToggleMenuButtonIcon = (expanded) => {
  const toggleMenuIcon = document.getElementById("togglemenuicon");
  let iconImage = "menu";
  let iconSrc = "";

  if (expanded === "true") iconImage = "close";
  iconSrc = `./assets/images/icon-${iconImage}.svg`;
  toggleMenuIcon.setAttribute("src", iconSrc);
};

const isCartEmpty = () => {
  return !cartProducts.childElementCount;
};

/**
 * @param {number} index - Slide Index
 * @param {string} [slideType = normal] - slideType [normal | modal] default value "normal"
 */
const changeSlide = (index, slideType = "normal") => {
  const newIndex = index.toString();
  let slideName = "";

  if (slideType === "normal") {
    slideName = "--Slide-index";
  } else {
    slideName = "--Slide-modal-index";
  }

  document.documentElement.style.setProperty(slideName, newIndex);
};

/**
 * @param {Element} thumbnailClicked - Clicked thumbnail
 * @param {Element} parent - Container for image gallery and thumbnail gallery
 */
const actualizeThumbnailActive = (thumbnailClicked, parent) => {
  const allThumbnail = parent.querySelectorAll(".thumbnail__button");
  allThumbnail.forEach((item) => {
    if (item.classList.contains("thumbnail__button--active"))
      item.classList.remove("thumbnail__button--active");
  });
  thumbnailClicked.classList.add("thumbnail__button--active");

  if (parent.classList.contains("product")) {
    slideIndex = parseInt(thumbnailClicked.dataset.item) - 1;
    changeSlide(slideIndex);
  } else {
    slideModalIndex = parseInt(thumbnailClicked.dataset.item) - 1;
    changeSlide(slideModalIndex, "modal");
  }
};

/**
 * @param {string} id - Product ID to search
 * @returns {object}  Object product
 */
const requestData = async (id) => {
  const dataFromServer = await fetch("./assets/products.json");
  const dataInJson = await dataFromServer.json();
  return dataInJson.filter((item) => item.id === id)[0];
};

/**
 * @param {object} product - Product to add to the cart
 * @param {number} quantity - Quantity to add
 */
const addItemToCart = (product, quantity) => {
  const cartIndicator = document.getElementsByClassName("cartindicator")[0];
  const itemTemplate = document.getElementById("itemtemplate");
  let totalPrice = 0;
  let itemAvatar = itemTemplate.content.querySelector(".item__avatar");
  let itemDescription =
    itemTemplate.content.querySelector(".item__description");
  let itemUnitPrice = itemTemplate.content.querySelector(".item__unitprice");
  let itemQuantity = itemTemplate.content.querySelector(".item__quantity");
  let itemTotalPrice = itemTemplate.content.querySelector(".item__totalprice");

  totalPrice = parseInt(product["price"].slice(1, -3));
  totalPrice = totalPrice * quantity;
  itemAvatar.setAttribute("src", product["avatar"]);
  itemDescription.textContent = product["subtitle"];
  itemUnitPrice.textContent = `${product["price"]} x `;
  itemQuantity.textContent = `${quantity.toString()} `;
  itemTotalPrice.textContent = `$${totalPrice.toString()}.00`;

  const newElemt = document.importNode(itemTemplate.content, "true");
  cartProducts.appendChild(newElemt);
  actualizeCartIndicator();
  if (cartProducts.childElementCount === 1) {
    const emptyDescription = document.querySelector(".emptydescription");
    cartForm.classList.remove("hide");
    emptyDescription.classList.add("hide");
    cartIndicator.classList.remove("hide");
  }
};

header.addEventListener("click", (e) => {
  const body = document.getElementById("body");
  const element = e.target.closest(".button");

  if (element?.id === "togglemenubutton") {
    if (toggleMenuButton.ariaExpanded === "false")
      toggleMenuButton.ariaExpanded = "true";
    else toggleMenuButton.ariaExpanded = "false";
    if (menuOverlay.classList.contains("menuoverlay--hide")) {
      menuOverlay.classList.remove("menuoverlay--hide");
    }
    setTimeout(() => {
      menuOverlay.classList.toggle("menuoverlay--translate");
    }, 100);
    body.classList.toggle("mobile-menu--expanded");
  }

  if (element?.id === "cartbutton") {
    if (element.ariaExpanded === "false") {
      element.ariaExpanded = "true";
      cart.classList.remove("hide");
      setTimeout(() => {
        cart.classList.add("cart--visible");
      }, 100);
    } else {
      element.ariaExpanded = "false";
      cart.classList.remove("cart--visible");
    }
  }

  if (element?.classList.contains("item__delete")) {
    const itemToDelete = element.closest(".item");
    const cartDescription =
      document.getElementsByClassName("emptydescription")[0];
    const cartIndicator = document.getElementsByClassName("cartindicator")[0];
    itemToDelete.remove();
    actualizeCartIndicator();
    if (isCartEmpty()) {
      cartForm.classList.add("hide");
      cartDescription.classList.remove("hide");
      cartIndicator.classList.add("hide");
    }
  }
});

product.addEventListener("click", (e) => {
  const control = e.target.closest(".button");
  const productQuantity = document.getElementById("quantity");

  if (control?.classList.contains("button--slide")) {
    if (control.classList.contains("button--slidenext") && slideIndex < 3)
      slideIndex++;
    if (control.classList.contains("button--slideprev") && slideIndex > 0)
      slideIndex--;
    changeSlide(slideIndex);
  }

  if (control?.classList.contains("thumbnail__button")) {
    actualizeThumbnailActive(control, product);
  }

  if (control?.id === "button--minus") {
    if (quantityToBuy > 0) quantityToBuy--;
    productQuantity.value = quantityToBuy.toString();
  }

  if (control?.id === "button--plus") {
    quantityToBuy++;
    productQuantity.value = quantityToBuy.toString();
  }

  if (control?.classList.contains("buttonproduct")) {
    overlay.classList.remove("hidemodal");
    setTimeout(() => {
      overlay.classList.add("overlay--scale");
    }, 100);
    body.classList.add("modal--expanded");
    buttonCloseModal.focus();
  }
});

overlay.addEventListener("click", (e) => {
  const control = e.target.closest(".button");

  if (control?.classList.contains("button--close")) {
    overlay.classList.remove("overlay--scale");
  }

  if (control?.classList.contains("thumbnail__button")) {
    actualizeThumbnailActive(control, overlay);
  }

  if (control?.classList.contains("button--slide")) {
    if (control.classList.contains("button--slidenext") && slideModalIndex < 3)
      slideModalIndex++;
    if (control.classList.contains("button--slideprev") && slideModalIndex > 0)
      slideModalIndex--;
    changeSlide(slideModalIndex, "modal");
  }
});

overlay.addEventListener("keydown", (e) => {
  const focusableElements = overlay.querySelectorAll(".button");
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { id, quantity } = productForm;
  requestData(id.value).then((req) =>
    addItemToCart(req, parseInt(quantity.value))
  );
});

overlay.addEventListener("transitionend", (e) => {
  if (!overlay.classList.contains("overlay--scale")) {
    overlay.classList.add("hidemodal");
    body.classList.remove("modal--expanded");
    buttonProduct.focus();
  }
});

header.addEventListener("transitionend", (e) => {
  const element = e.target;

  if (element.id === "menuoverlay") {
    if (toggleMenuButton.ariaExpanded === "false") {
      menuOverlay.classList.add("menuoverlay--hide");
    }
    changeToggleMenuButtonIcon(toggleMenuButton.ariaExpanded);
  } else if (element.classList.contains("cart")) {
    if (cartButton.ariaExpanded === "false") {
      cart.classList.add("hide");
    }
  }
});
