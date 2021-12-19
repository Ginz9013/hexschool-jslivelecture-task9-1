"use strict";

var data = [];
var carts = [];
var cartsTotal;
var productsList = document.querySelector(".js-productsList");
var cartsList = document.querySelector(".js-cartsList");
var cartsPrice = document.querySelector(".js-cartsPrice");
var deleteAll = document.querySelector('.js-deleteAll');
var filter = document.querySelector('.filter'); // init 產品列表
// 選擇後重新渲染
// init 購物車
// 選擇後重新渲染
// 產品列表

function init() {
  getProductList();
  getCartList();
}

init(); // ------ 產品列表 ------

function getProductList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products")).then(function (response) {
    data = response.data.products;
    renderProductList();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

function combineProductListItem(item) {
  return "\n          <li class=\"newArrival relative mb-7\">\n            <img src=\"".concat(item.images, "\" alt=\"").concat(item.description, "\" class=\"object-cover h-80\">\n            <input type=\"button\" value=\"\u52A0\u5165\u8CFC\u7269\u8ECA\" data-id=\"").concat(item.id, "\"\n              class=\"text-xl text-white  bg-black hover:bg-primaryColor-dark2 cursor-pointer py-3 w-full\" data-addCart=\"js-addCart\">\n            <p class=\"text-xl\">").concat(item.title, "</p>\n            <p class=\"text-xl line-through\">NT$").concat(item.origin_price, "</p>\n            <h3 class=\"text-3xl\">NT$").concat(item.price, "</h3>\n          </li>\n        ");
}

function renderProductList() {
  var str = "";
  data.forEach(function (item) {
    str += combineProductListItem(item);
  });
  productsList.innerHTML = str;
}

; //篩選器

filter.addEventListener("change", function (e) {
  var str = "";
  data.forEach(function (item) {
    if (e.target.value === item.category) {
      str += combineProductListItem(item);
    } else if (e.target.value === "all") {
      str += combineProductListItem(item);
    }
  });
  productsList.innerHTML = str;
}); // 加入購物車

productsList.addEventListener('click', function (e) {
  e.preventDefault(); // 點擊的商品id

  var clickId = e.target.getAttribute("data-id"); // 判斷購物車是否含有該商品
  // const inCarts = arrayCartId.includes(clickId);

  if (e.target.getAttribute("data-addCart") !== "js-addCart") {
    return;
  } else {
    console.log(clickId);
    var productQuantity = 1;
    carts.forEach(function (item) {
      if (item.product.id === clickId) {
        productQuantity = item.quantity += 1;
      }

      ;
    });
    console.log(productQuantity);
    axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
      "data": {
        "productId": clickId,
        "quantity": productQuantity
      }
    }).then(function (response) {
      console.log(response.data);
      getCartList();
    })["catch"](function (error) {
      console.log(error.response.data);
    });
  }
}); // ------ 購物車 ------

function getCartList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    carts = response.data.carts;
    cartsTotal = response.data.finalTotal;
    renderShoppingCart();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

function renderShoppingCart() {
  var str = "";
  carts.forEach(function (item) {
    var subtotalPrice = item.product.price * item.quantity;
    str += "\n      <tr class=\"border-b\">\n        <td class=\"flex\">\n          <img src=\"".concat(item.product.images, "\" alt=\"").concat(item.product.description, "\" class=\"h-40 py-5\">\n          <div class=\"flex items-center ml-4\">\n            <p class=\"text-xl\">").concat(item.product.title, "</p>\n          </div>\n        </td>\n        <td>NT$").concat(item.product.price, "</td>\n        <td>").concat(item.quantity, "</td>\n        <td>NT$").concat(subtotalPrice, "</td>\n        <td class=\"text-center\">\n          <i class=\"fas fa-times fa-2x cursor-pointer\" data-delProduct=\"delProduct\" data-cartId=\"").concat(item.id, "\"></i>\n        </td>\n      </tr>\n    ");
  });

  if (str.length == 0) {
    cartsList.innerHTML = "\n      <tr>\n        <td colspan=\"5\" class=\"h-36 text-gray-300 text-3xl font-light text-center\">\u76EE\u524D\u8CFC\u7269\u8ECA\u7121\u5546\u54C1</td>\n      </tr>";
  } else {
    cartsList.innerHTML = str;
  }

  cartsPrice.innerHTML = "NT$".concat(cartsTotal);
} // 刪除購物車內全部商品


deleteAll.addEventListener('click', function () {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    console.log(response.data);
    init();
  });
}); // 刪除購物車內指定商品

cartsList.addEventListener("click", function (e) {
  var cartId = e.target.getAttribute("data-cartId");

  if (e.target.getAttribute("data-delProduct") !== "delProduct") {
    console.log("點擊錯誤");
  } else {
    console.log(cartId);
    deleteCartItem(cartId);
  }
});

function deleteCartItem(cartId) {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(cartId)).then(function (response) {
    console.log(response.data);
    init();
  });
} // ------ 預定表單 ------


var submit = document.querySelector(".js-submit");
var orderName = document.querySelector(".js-name");
var orderTel = document.querySelector(".js-tel");
var orderEmail = document.querySelector(".js-email");
var orderAddress = document.querySelector(".js-address");
var orderTrade = document.querySelector(".js-trade"); // 送出購買訂單

submit.addEventListener("click", function (e) {
  if (orderName.value == "") {
    alert("請輸入姓名");
  } else if (orderTel.value == "") {
    alert("請輸入電話");
  } else if (orderEmail.value == "") {
    alert("請輸入 Email");
  } else if (orderAddress.value == "") {
    alert("請輸入地址");
  } else if (orderTrade.value == "") {
    alert("請選擇交易方式");
  } else {
    createOrder();
  }

  event.preventDefault();
});

function createOrder() {
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
    "data": {
      "user": {
        "name": orderName.value,
        "tel": orderTel.value,
        "email": orderEmail.value,
        "address": orderAddress.value,
        "payment": orderTrade.value
      }
    }
  }).then(function (response) {
    console.log(response.data);
    orderName.value = "";
    orderTel.value = "";
    orderEmail.value = "";
    orderAddress.value = "";
    orderTrade.value = orderTrade.options[0].value;
    init();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
} // validate 沒搞定
// const inputs = document.querySelectorAll(".js-input");
// const orderForm = document.querySelectorAll(".js-orderForm");
// const constraints = {
//   "name": {
//     presence: {
//       message: "必填欄位"
//     }
//   },
//   "tel": {
//     presence: {
//       message: "必填欄位"
//     },
//     length: {
//       minimum: 8,
//       message: "需超過 8 碼"
//     }
//   },
//   "email": {
//     presence: {
//       message: "必填欄位"
//     },
//     email: {
//       message: "格式錯誤"
//     }
//   },
//   "address": {
//     presence: {
//       message: "必填欄位"
//     }
//   },
//   "trade": {
//     presence: {
//       message: "必填欄位"
//     }
//   },
// };
// inputs.forEach((item) => {
//   item.addEventListener("change", function () {
//     // 偽元素內容：重置清空
//     let alertText = item.parentNode.getAttribute("data-text");
//     item.parentNode.setAttribute("data-text", '');
//     // console.log(item.parentNode.getAttribute("data-text"));
//     // validate 變數
//     let errors = validate(orderForm, constraints) || '';
//     console.log(errors)
//     if (errors) {
//       Object.keys(errors).forEach(function (keys) {
//         // console.log(document.querySelector(`[data-message=${keys}]`))
//         console.log(keys)
//         // document.querySelector(`[data-text="${keys}"]`).setAttribute("data-text", `${errors[keys]}`);
//       })
//     }
//   });
// });
//# sourceMappingURL=index.js.map
