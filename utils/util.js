const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const convertToStarArray = star => {
  var num = star.substring(0, 1);
  var stars = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      stars.push(1);
    } else {
      stars.push(0);
    }
  }

  return stars;

}

function httpGet(url, callback) {
  wx.request({
    url: url,
    method: "GET",
    header: {
      'Content-Type': "json"
    },
    success: function (res) {
      callback(res.data);
    },
    fail: function (res) {
      console.log(res);
    }
  })
}

function wxRequest(obj) {
  return new Promise((resolve, reject) => {
    if (typeof obj.header === "undefined") {
      obj.header = {
        "Content-Type": "json"
      }
    };
    obj.success = res => resolve(res);
    obj.fail = err => reject(err);
    wx.request(obj);
  })
}


function promisfy(api) {
  return function (obj) {
    return new Promise(function (resolve, reject) {
      obj.success = function (res) {
        resolve(res);
      };
      obj.fail = function (res) {
        reject(res);
      }
      api(obj);
    })
  }
}



module.exports = {
  formatTime: formatTime,
  convertToStarArray: convertToStarArray,
  httpGet: httpGet,
  promisfy: promisfy,
  wxRequest: wxRequest
}
