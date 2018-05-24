// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationTitle: "",
    movies: [],
    dataUrl: "",
    isLoadMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigationTitle: category
    });

    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break
      case "Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break
    }
    wx.showLoading({
      title: '正在加载',
    })
    util.httpGet(dataUrl, this.resolveData);
    this.setData({
      dataUrl: dataUrl
    })
  },

  resolveData: function (data) {
    var movies = [];
    for (var index in data.subjects) {
      var movie = data.subjects[index];
      var title = movie.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
      }

      var temp = {
        stars: util.convertToStarArray(movie.rating.stars),
        title: title,
        id: movie.id,
        coverImg: movie.images.large,
        average: movie.rating.average
      };

      movies.push(temp);
    }

    if (movies.length == 0 && this.data.isLoadMore) {
      wx.showToast({
        title: '没有更多了',
      })
      wx.hideNavigationBarLoading();
      return;
    }

    var temp = [];
    if (this.data.isLoadMore) {
      temp = this.data.movies.concat(movies);
    } else {
      temp = movies;
    };
    this.setData({
      movies: temp
    });

    wx.hideLoading();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isLoadMore: false
    })
    wx.showNavigationBarLoading();
    util.httpGet(this.data.dataUrl, this.resolveData);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var url = this.data.dataUrl + "?start=" + this.data.movies.length;
    this.setData({
      isLoadMore: true
    })
    wx.showNavigationBarLoading();
    util.httpGet(url, this.resolveData);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})