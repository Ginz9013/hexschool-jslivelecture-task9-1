"use strict";

var orderInfo = document.querySelector(".js-orderInfo");
var deleteAll = document.querySelector(".js-deleteAll");
var orderList = []; // setTimeout(function () {
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
}

;
orderListInit(); // 取得訂單列表

function getOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    orderList = response.data.orders; // console.log(orderList);

    renderOrderList();
    renderOrderChart();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
} // 渲染上方圓餅圖 c3.js


function renderOrderChart() {
  var c3DataList = [];
  var objProducts = {}; // 篩選資料

  orderList.forEach(function (item) {
    item.products.forEach(function (product) {
      if (objProducts[product.title] == undefined) {
        objProducts[product.title] = product.price;
      } else {
        objProducts[product.title] += product.price;
      }
    });
  }); // 處理資料

  var arrProducts = Object.keys(objProducts);
  arrProducts.forEach(function (item) {
    var arrProductsPrice = [];
    arrProductsPrice.push(item);
    arrProductsPrice.push(objProducts[item]);
    c3DataList.push(arrProductsPrice);
  });
  c3DataList.sort(function (a, b) {
    return b[1] - a[1];
  });

  if (c3DataList.length > 3) {
    var otherTotal = 0;
    c3DataList.forEach(function (item, index) {
      if (index > 2) {
        otherTotal += c3DataList[index][1];
      }
    });
    c3DataList.splice(3, c3DataList.length - 3);
    c3DataList.push(["其他", otherTotal]);
  } // 商品與顏色物件


  var objColors = {};
  var arrayColors = ["#6A33F8", "#DACBFF", "#5434A7", "#9D7FEA" // "#301E5F",
  // "#CED4DA",
  // "000000",
  // "#808080"
  ];
  var arrC3DataList = [];
  c3DataList.forEach(function (item) {
    arrC3DataList.push(item[0]);
  });
  console.log(arrC3DataList);
  arrC3DataList.forEach(function (item, index) {
    if (objColors[item] == undefined) {
      objColors[item] = arrayColors[index];
    }
  });
  console.log(objColors); // 套入C3.js

  var chart = c3.generate({
    data: {
      // iris data from R
      columns: c3DataList,
      type: 'pie',
      onclick: function onclick(d, i) {
        console.log("onclick", d, i);
      },
      colors: objColors
    }
  });
} // 渲染下方訂單列表


function renderOrderList() {
  var str = "";
  orderList.forEach(function (item) {
    // 遍歷訂購產品
    var productStr = "";
    item.products.forEach(function (itemProduct) {
      var content = "\n        <li>".concat(itemProduct.title, "(").concat(itemProduct.quantity, ")</li>\n        ");
      productStr += content;
    }); // 遍歷訂購產品
    // 時間轉換

    var time = new Date(item.createdAt * 1000);
    var orderTime = "".concat(time.getFullYear(), "/").concat(time.getMonth() + 1, "/").concat(time.getDate()); // 判斷訂單狀態

    var orderStatus = "";

    if (item.paid === false) {
      orderStatus = "未處理";
    } else if (item.paid === true) {
      orderStatus = "已處理";
    } // 判斷訂單狀態


    var content = "\n      <div class=\"col-span-3 border flex justify-center items-center px-2\">\n        <p class=\"break-all\">".concat(item.id, "</p>\n      </div>\n      <div class=\"col-span-3 border flex flex-col justify-center items-start pl-3 py-2\">\n        <p>").concat(item.user.name, "</p>\n        <p>").concat(item.user.tel, "</p>\n      </div>\n      <div class=\"col-span-4 border flex items-center px-3\">\n        <p>").concat(item.user.address, "</p>\n      </div>\n      <div class=\"col-span-5 border flex justify-center items-center\">\n        <p class=\"break-all\">").concat(item.user.email, "</p>\n      </div>\n      <ul class=\"col-span-5 border text-center py-2\">\n          ").concat(productStr, "\n      </ul>\n      <div class=\"col-span-3 border flex justify-center items-center\">\n        <p class=\"break-all\">").concat(orderTime, "</p>\n      </div>\n      <div class=\"col-span-2 border flex justify-center items-center\">\n        <a class=\"text-blue-500 underline leading-7 cursor-pointer\" data-orderStatus=\"orderStatus\" data-orderPaid=\"").concat(item.paid, "\" data-orderId=\"").concat(item.id, "\">").concat(orderStatus, "</a>\n      </div>\n      <div class=\"col-span-2 border flex justify-center items-center\">\n        <input type=\"button\" class=\"bg-gray-100 rounded-sm px-3 py-1 cursor-pointer hover:bg-red-600 hover:text-white\"\n          value=\"\u522A\u9664\" data-deleteOrder=\"deleteOrder\" data-orderId=\"").concat(item.id, "\">\n      </div>\n    ");
    str += content;
  });
  orderInfo.innerHTML = str;
} // 清除全部訂單


deleteAll.addEventListener("click", function () {
  deleteAllOrder();
});

function deleteAllOrder() {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
    orderListInit();
  })["catch"](function (error) {
    console.log(error.response.data);
  });
} // 刪除特定訂單


orderInfo.addEventListener("click", function (e) {
  var orderId = e.target.getAttribute("data-orderId");

  if (e.target.getAttribute("data-deleteOrder") !== "deleteOrder") {// console.log("點擊錯誤");
  } else {
    console.log("點擊正確");
    console.log(orderId);
    deleteOrderItem(orderId);
  }
});

function deleteOrderItem(orderId) {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(orderId), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
    orderListInit();
  });
} // 更改訂單狀態


orderInfo.addEventListener("click", function (e) {
  var orderStatus = e.target.getAttribute("data-orderStatus");
  var orderPaid = e.target.getAttribute("data-orderPaid");
  var orderId = e.target.getAttribute("data-orderId");

  if (orderStatus !== "orderStatus") {
    console.log("點擊錯誤");
  } else {
    console.log("點擊正確");
    console.log(orderPaid);
    console.log(orderId);
    var updateStatus;

    if (orderPaid == "false") {
      updateStatus = true;
    } else if (orderPaid == "true") {
      updateStatus = false;
    }

    console.log(updateStatus);
    axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
      "data": {
        "id": orderId,
        "paid": updateStatus
      }
    }, {
      headers: {
        'Authorization': token
      }
    }).then(function (response) {
      console.log(response.data);
      orderListInit();
    });
  }
});
//# sourceMappingURL=backstage-items.js.map
