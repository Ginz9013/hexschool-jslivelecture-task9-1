const api_path = "ginz9013";
const token = "gtVaknIHOtelzoQpEvYjNzBMCjq1";

const orderInfo = document.querySelector(".js-orderInfo")
const deleteAll = document.querySelector(".js-deleteAll")

let orderList = [];






// setTimeout(function () {
//   chart.load({
//     columns: [
//       ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
//       ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
//       ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
//     ]
//   });
// }, 1500);

// setTimeout(function () {
//   chart.unload({
//     ids: 'data1'
//   });
//   chart.unload({
//     ids: 'data2'
//   });
// }, 2500);

function orderListInit() {
  getOrderList();
};

orderListInit();


// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      orderList = response.data.orders;
      // console.log(orderList);
      renderOrderList();
      renderOrderChart()
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}

// 渲染上方圓餅圖 c3.js
function renderOrderChart() {
  let orderListCategory = [];

  let objCategoty = {};

  // 篩選資料
  orderList.forEach(function (item) {
    item.products.forEach(function (product) {
      if (objCategoty[product.category] == undefined) {
        objCategoty[product.category] = product.price;
      } else {
        objCategoty[product.category] += product.price;
      }
    })
  })

  // 處理資料
  let arrCategory = Object.keys(objCategoty);

  arrCategory.forEach(function (item) {
    let arrCategoryPrice = [];
    arrCategoryPrice.push(item);
    arrCategoryPrice.push(objCategoty[item]);

    orderListCategory.push(arrCategoryPrice);
  })

  // 套入C3.js
  let chart = c3.generate({
    data: {
      // iris data from R
      columns: orderListCategory,
      type: 'pie',
      onclick: function (d, i) { console.log("onclick", d, i); },
      colors: {
        "床架": "#6A33F8",
        "窗簾": "#DACBFF",
        "收納": "#5434A7",
      }
    }
  });
}


// 渲染下方訂單列表
function renderOrderList() {

  let str = "";

  orderList.forEach(function (item) {

    // 遍歷訂購產品
    let productStr = "";

    item.products.forEach(function (itemProduct) {
      let content = `
        <li>${itemProduct.title}(${itemProduct.quantity})</li>
        `;

      productStr += content;
    })
    // 遍歷訂購產品



    // 判斷訂單狀態
    let orderStatus = "";
    if (item.paid === false) {
      orderStatus = "未處理";
    } else if (item.paid === true) {
      orderStatus = "已處理";
    }
    // 判斷訂單狀態


    let content = `
      <div class="col-span-3 border flex justify-center items-center">
        <p>${item.createdAt}</p>
      </div>
      <div class="col-span-3 border flex flex-col justify-center items-start pl-3 py-2">
        <p>${item.user.name}</p>
        <p>${item.user.tel}</p>
      </div>
      <div class="col-span-5 border flex items-center px-3">
        <p>${item.user.address}</p>
      </div>
      <div class="col-span-5 border flex justify-center items-center">
        <p>${item.user.email}</p>
      </div>
      <ul class="col-span-4 border text-center py-2">
          ${productStr}
      </ul>
      <div class="col-span-3 border flex justify-center items-center">
        <p>2021/03/08</p>
      </div>
      <div class="col-span-2 border flex justify-center items-center">
        <a class="text-blue-500 underline leading-7 cursor-pointer" data-orderStatus="orderStatus" data-orderPaid="${item.paid}" data-orderId="${item.id}">${orderStatus}</a>
      </div>
      <div class="col-span-2 border flex justify-center items-center">
        <input type="button" class="bg-gray-100 rounded-sm px-3 py-1 cursor-pointer hover:bg-red-600 hover:text-white"
          value="刪除" data-deleteOrder="deleteOrder" data-orderId="${item.id}">
      </div>
    `

    str += content;
  });

  orderInfo.innerHTML = str;
}

// 清除全部訂單
deleteAll.addEventListener("click", function () {
  deleteAllOrder();
});

function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      orderListInit();
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
}


// 刪除特定訂單
orderInfo.addEventListener("click", function (e) {
  const orderId = e.target.getAttribute("data-orderId");
  if (e.target.getAttribute("data-deleteOrder") !== "deleteOrder") {
    // console.log("點擊錯誤");
  } else {
    console.log("點擊正確");
    console.log(orderId);
    deleteOrderItem(orderId)
  }
})

function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
      orderListInit();
    })
}

// 更改訂單狀態
orderInfo.addEventListener("click", function (e) {
  const orderStatus = e.target.getAttribute("data-orderStatus");
  const orderPaid = e.target.getAttribute("data-orderPaid");
  const orderId = e.target.getAttribute("data-orderId");

  if (orderStatus !== "orderStatus") {
    console.log("點擊錯誤");
  } else {
    console.log("點擊正確");
    console.log(orderPaid);
    console.log(orderId);

    let updateStatus;

    if (orderPaid == "false") {
      updateStatus = true;
    } else if (orderPaid == "true") {
      updateStatus = false;
    }

    console.log(updateStatus);

    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        "data": {
          "id": orderId,
          "paid": updateStatus
        }
      },
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        console.log(response.data);
        orderListInit();
      })

  }
})
