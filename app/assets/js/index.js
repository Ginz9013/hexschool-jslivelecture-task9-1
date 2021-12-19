let data = [];
let carts = [];
let cartsTotal

const productsList = document.querySelector(".js-productsList");
const cartsList = document.querySelector(".js-cartsList");
const cartsPrice = document.querySelector(".js-cartsPrice");
const deleteAll = document.querySelector('.js-deleteAll');
const filter = document.querySelector('.filter');

// init 產品列表
// 選擇後重新渲染
// init 購物車
// 選擇後重新渲染

// 產品列表

function init() {
  getProductList();
  getCartList();
}

init();

// ------ 產品列表 ------
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
      data = response.data.products;
      renderProductList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}

function combineProductListItem(item) {
  return `
          <li class="newArrival relative mb-7">
            <img src="${item.images}" alt="${item.description}" class="object-cover h-80">
            <input type="button" value="加入購物車" data-id="${item.id}"
              class="text-xl text-white  bg-black hover:bg-primaryColor-dark2 cursor-pointer py-3 w-full" data-addCart="js-addCart">
            <p class="text-xl">${item.title}</p>
            <p class="text-xl line-through">NT$${item.origin_price}</p>
            <h3 class="text-3xl">NT$${item.price}</h3>
          </li>
        `
}

function renderProductList() {
  let str = "";
  data.forEach(function (item) {
    str += combineProductListItem(item);
  });

  productsList.innerHTML = str;
};

//篩選器
filter.addEventListener("change", function (e) {

  let str = "";

  data.forEach(function (item) {
    if (e.target.value === item.category) {
      str += combineProductListItem(item);

    } else if (e.target.value === "all") {
      str += combineProductListItem(item);
    }
  });

  productsList.innerHTML = str;
})

// 加入購物車
productsList.addEventListener('click', function (e) {
  e.preventDefault();


  // 點擊的商品id
  let clickId = e.target.getAttribute("data-id");

  // 判斷購物車是否含有該商品
  // const inCarts = arrayCartId.includes(clickId);



  if (e.target.getAttribute("data-addCart") !== "js-addCart") {
    return;
  } else {
    console.log(clickId)

    let productQuantity = 1;

    carts.forEach(function (item) {
      if (item.product.id === clickId) {
        productQuantity = item.quantity += 1;
      };
    });
    console.log(productQuantity);

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      "data": {
        "productId": clickId,
        "quantity": productQuantity
      }
    }).
      then(function (response) {
        console.log(response.data);
        getCartList();
      })
      .catch(function (error) {
        console.log(error.response.data)
      })
  }
});


// ------ 購物車 ------
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      carts = response.data.carts;
      cartsTotal = response.data.finalTotal;
      renderShoppingCart();
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}

function renderShoppingCart() {
  let str = "";
  carts.forEach(function (item) {
    let subtotalPrice = item.product.price * item.quantity;

    str += `
      <tr class="border-b">
        <td class="flex">
          <img src="${item.product.images}" alt="${item.product.description}" class="h-40 py-5">
          <div class="flex items-center ml-4">
            <p class="text-xl">${item.product.title}</p>
          </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${subtotalPrice}</td>
        <td class="text-center">
          <i class="fas fa-times fa-2x cursor-pointer" data-delProduct="delProduct" data-cartId="${item.id}"></i>
        </td>
      </tr>
    `;
  })

  if (str.length == 0) {
    cartsList.innerHTML = `
      <tr>
        <td colspan="5" class="h-36 text-gray-300 text-3xl font-light text-center">目前購物車無商品</td>
      </tr>`
  } else {
    cartsList.innerHTML = str;
  }

  cartsPrice.innerHTML = `NT$${cartsTotal}`;
}

// 刪除購物車內全部商品
deleteAll.addEventListener('click', function () {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
      init();
    })
});

// 刪除購物車內指定商品
cartsList.addEventListener("click", function (e) {
  const cartId = e.target.getAttribute("data-cartId");
  if (e.target.getAttribute("data-delProduct") !== "delProduct") {
    console.log("點擊錯誤")
  } else {
    console.log(cartId);
    deleteCartItem(cartId);
  }

})

function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
      console.log(response.data);
      init();
    })
}



// ------ 預定表單 ------

const submit = document.querySelector(".js-submit");


const orderName = document.querySelector(".js-name");
const orderTel = document.querySelector(".js-tel");
const orderEmail = document.querySelector(".js-email");
const orderAddress = document.querySelector(".js-address");
const orderTrade = document.querySelector(".js-trade");


// 送出購買訂單
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
})

function createOrder() {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": orderName.value,
          "tel": orderTel.value,
          "email": orderEmail.value,
          "address": orderAddress.value,
          "payment": orderTrade.value
        }
      }
    }
  ).
    then(function (response) {
      console.log(response.data);

      orderName.value = "";
      orderTel.value = "";
      orderEmail.value = "";
      orderAddress.value = "";
      orderTrade.value = orderTrade.options[0].value;

      init();
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}


// validate 沒搞定

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
