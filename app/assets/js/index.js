const api_path = "ginz9013";
const token = "gtVaknIHOtelzoQpEvYjNzBMCjq1";

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

function renderProductList() {
  let str = "";
  data.forEach(function (item) {
    let content = `
      <li class="newArrival relative mb-7">
        <img src="${item.images}" alt="${item.description}" class="object-cover h-80">
        <input type="button" value="加入購物車" data-id="${item.id}"
          class="text-xl text-white  bg-black hover:bg-primaryColor-dark2 cursor-pointer py-3 w-full" data-addCart="js-addCart">
        <p class="text-xl">${item.title}</p>
        <p class="text-xl line-through">NT$${item.origin_price}</p>
        <h3 class="text-3xl">NT$${item.price}</h3>
      </li>
    `;

    str += content;

    productsList.innerHTML = str;
  })
};

//篩選器
filter.addEventListener("change", function (e) {

  let str = "";

  data.forEach(function (item) {
    if (e.target.value === item.category) {
      let content = `
        <li class="newArrival relative mb-7">
          <img src="${item.images}" alt="${item.description}" class="object-cover h-80">
          <input type="button" value="加入購物車" data-id="${item.id}"
            class="text-xl text-white  bg-black hover:bg-primaryColor-dark2 cursor-pointer py-3 w-full" data-addCart="js-addCart">
          <p class="text-xl">${item.title}</p>
          <p class="text-xl line-through">NT$${item.origin_price}</p>
          <h3 class="text-3xl">NT$${item.price}</h3>
        </li>
      `;
      str += content;

    } else if (e.target.value === "all") {
      let content = `
        <li class="newArrival relative mb-7">
          <img src="${item.images}" alt="${item.description}" class="object-cover h-80">
          <input type="button" value="加入購物車" data-id="${item.id}"
            class="text-xl text-white  bg-black hover:bg-primaryColor-dark2 cursor-pointer py-3 w-full" data-addCart="js-addCart">
          <p class="text-xl">${item.title}</p>
          <p class="text-xl line-through">NT$${item.origin_price}</p>
          <h3 class="text-3xl">NT$${item.price}</h3>
        </li>
      `;
      str += content;
    }
  });

  productsList.innerHTML = str;
})

productsList.addEventListener('click', function (e) {
  // 自組的購物車id陣列
  let arrayCartId = [];
  carts.forEach(function (item) {
    arrayCartId.push(item.product.id)
  });

  // 點擊的商品id
  const clickId = e.target.getAttribute("data-id");

  // 判斷購物車是否含有該商品
  const inCarts = arrayCartId.includes(clickId);



  if (e.target.getAttribute("data-addCart") !== "js-addCart") {
    return;
  } else {
    if (inCarts) {
      // 購物車內點擊的商品id順序
      const idSequence = arrayCartId.indexOf(clickId);
      // 購物車內點擊的商品目前數量
      const productQuantityInCarts = carts[idSequence].quantity;
      // 購物車內點擊的商品目前數量+1
      const productQuantityInCartsAdded = productQuantityInCarts + 1;

      axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
        "data": {
          "productId": clickId,
          "quantity": productQuantityInCartsAdded
        }
      }).
        then(function (response) {
          console.log(response.data);
          init();
        })
        .catch(function (error) {
          console.log(error.response.data)
        })
    } else {
      axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
        "data": {
          "productId": clickId,
          "quantity": 1
        }
      }).
        then(function (response) {
          console.log(response.data);
          init();
        })
        .catch(function (error) {
          console.log(error.response.data)
        })
    }

    // console.log(arrayCartId.indexOf(clickId));



    // if (clickId) {
    //   carts.forEach(function (item) {
    //     if (clickId == item.product.id) {
    //       item.quantity += 1;
    //       init();
    //     } else {
    //       return;
    //     }
    //   })
    // } else {
    //   let targetId = e.target.getAttribute("data-ids");
    //   // console.log(typeof targetId);
    //   axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    //     "data": {
    //       "productId": targetId,
    //       "quantity": 1
    //     }
    //   }).
    //     then(function (response) {
    //       console.log(response.data);
    //       init();
    //     })
    //     .catch(function (error) {
    //       console.log(error.response.data)
    //     })


    // 按鈕class
    // 按鈕id
    // 購物車商品id陣列
    // .includes()  判斷是否已經有該商品
    // 是：.indexOf() 抓出購物車商品id 在陣列中的排序
    // 新的商品數量 = 目前carts中數量+1
    // axios.post

    // 否：
    // axios.post 數量1

    // 點擊到按鈕
    // 抓取按鈕class
    // 比對按鈕id跟購物車內商品id 是否有重複
    // 是：商品數量+1
    // 否：新增商品種類，數量為1


    // 方法三 - 完成一半
    // let targetId = e.target.getAttribute("data-id");
    // let inCarts = false;

    // console.log(inCarts, targetId);

    // carts.forEach(function (item) {
    //   if (targetId == item.product.id) {
    //     inCarts = true;
    //     let addedQuantity = item.quantity += 1;
    //     console.log(inCarts, addedQuantity);
    //     axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    //       "data": {
    //         "productId": targetId,
    //         "quantity": addedQuantity
    //       }
    //     }).
    //       then(function (response) {
    //         console.log(response.data);
    //         init();
    //       })
    //       .catch(function (error) {
    //         console.log(error.response.data)
    //       })
    //   } else {
    //     console.log("error");
    //     return;
    //   }
    // })

    // if (inCarts == false) {
    //   console.log("新增")
    //   axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    //     "data": {
    //       "productId": targetId,
    //       "quantity": 1
    //     }
    //   }).
    //     then(function (response) {
    //       console.log(response.data);
    //       init();
    //     })
    //     .catch(function (error) {
    //       console.log(error.response.data)
    //     })
    // }

    // 方法二 - 失敗
    // let cartId = [];
    // carts.forEach(function (item) {
    //   cartId.push(item.product.id)
    // });
    // console.log(cartId);

    // let clickId = cartId.includes(e.target.getAttribute("data-ids"));

    // if (clickId) {
    //   carts.forEach(function (item) {
    //     if (clickId == item.product.id) {
    //       item.quantity += 1;
    //       init();
    //     } else {
    //       return;
    //     }
    //   })
    // } else {
    //   let targetId = e.target.getAttribute("data-ids");
    //   // console.log(typeof targetId);
    //   axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    //     "data": {
    //       "productId": targetId,
    //       "quantity": 1
    //     }
    //   }).
    //     then(function (response) {
    //       console.log(response.data);
    //       init();
    //     })
    //     .catch(function (error) {
    //       console.log(error.response.data)
    //     })
  }


  // 方法一
  // console.log(e.target.getAttribute("data-ids"));

  // let id = e.target.getAttribute("data-ids");

  // 透過carts.forEach跑過所有目前購物車內的商品id，然後宣告一個變數上去
  // 用switch，在 case 上加入上面的變數

  // carts.forEach(function (item) {
  //   if (item.product.id === id) {
  //     item.quantity += 1;
  //   } else {
  //     axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
  //       "data": {
  //         "productId": id,
  //         "quantity": 1
  //       }
  //     }).
  //       then(function (response) {
  //         console.log(response.data);
  //         renderShoppingCart()
  //       })
  //       .catch(function (error) {
  //         console.log(error.response.data)
  //       })
  //   }
  // });

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
    let content = `
    <div class="col-span-2 flex bottomLine relative my-5">
      <img src="${item.product.images}" alt="${item.product.description}" class="h-20">
      <div class="flex items-center ml-4">
        <p class="text-xl">${item.product.title}</p>
      </div>
    </div>
    <div class="flex items-center">
      <p>NT$${item.product.price}</p>
    </div>
    <div class="flex items-center">
      <p>${item.quantity}</p>
    </div>
    <div class="flex items-center">
      <p>NT$${subtotalPrice}</p>
    </div>
    <div class="flex justify-center items-center">
      <i class="fas fa-times fa-2x cursor-pointer" data-delProduct="delProduct" data-cartId="${item.id}"></i>
    </div>
    `;

    str += content;
  })
  cartsList.innerHTML = str;
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



// // 請代入自己的網址路徑
// const api_path = "ginz9013";
// const token = "gtVaknIHOtelzoQpEvYjNzBMCjq1";

// // 取得產品列表
// function getProductList() {
//   axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
//     then(function (response) {
//       console.log(response.data);
//     })
//     .catch(function (error) {
//       console.log(error.response.data)
//     })
// }

// // 加入購物車
// function addCartItem() {
//   axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
//     data: {
//       "productId": "vLiN2yZ0cFkJw45Q8tC3",
//       "quantity": 7
//     }
//   }).
//     then(function (response) {
//       console.log(response.data);
//     })

// }


// // 取得購物車列表
// function getCartList() {
//   axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
//     then(function (response) {
//       console.log(response.data);
//     })
// }

// // 清除購物車內全部產品
// function deleteAllCartList() {
//   axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
//     then(function (response) {
//       console.log(response.data);
//     })
// }

// // 刪除購物車內特定產品
// function deleteCartItem(cartId) {
//   axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
//     then(function (response) {
//       console.log(response.data);
//     })
// }

// // 送出購買訂單
// function createOrder() {

//   axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
//     {
//       "data": {
//         "user": {
//           "name": "六角學院",
//           "tel": "07-5313506",
//           "email": "hexschool@hexschool.com",
//           "address": "高雄市六角學院路",
//           "payment": "Apple Pay"
//         }
//       }
//     }
//   ).
//     then(function (response) {
//       console.log(response.data);
//     })
//     .catch(function (error) {
//       console.log(error.response.data);
//     })
// }

// // 取得訂單列表
// function getOrderList() {
//   axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
//     {
//       headers: {
//         'Authorization': token
//       }
//     })
//     .then(function (response) {
//       console.log(response.data);
//     })
// }

// // 修改訂單狀態

// function editOrderList(orderId) {
//   axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
//     {
//       "data": {
//         "id": orderId,
//         "paid": true
//       }
//     },
//     {
//       headers: {
//         'Authorization': token
//       }
//     })
//     .then(function (response) {
//       console.log(response.data);
//     })
// }

// // 刪除全部訂單
// function deleteAllOrder() {
//   axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
//     {
//       headers: {
//         'Authorization': token
//       }
//     })
//     .then(function (response) {
//       console.log(response.data);
//     })
// }

// // 刪除特定訂單
// function deleteOrderItem(orderId) {
//   axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
//     {
//       headers: {
//         'Authorization': token
//       }
//     })
//     .then(function (response) {
//       console.log(response.data);
//     })
// }


