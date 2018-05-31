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
    loadMoreText: "正在加载更多...",
    showLoadMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigationTitle: category
    });

    wx.showLoading({
      title: '正在加载',
    })
    this.fetchMovieList(true)
      .then(() => {
        wx.hideLoading();
      })
  },

  getLoadUrl:function(){
    var dataUrl = "";
    switch (this.data.navigationTitle) {
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
    return dataUrl;
  },

  fetchMovieList: function (override) {
    this.loading = true;
    return util.wxRequest({
      url: this.getLoadUrl(),
      data: {
        start: this.data.movies.length,
        count: 20
      }
    }).then(res => {
      this.resolveData(res.data, override);
    }).catch(err => {
      console.log("==> [ERROR]", err);
      wx.hideLoading();
    }).then(() => {
      this.loading = false;
    })
  },

  resolveData: function (data, override) {
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

    if (movies.length == 0 && !override) {
      this.setData({
        loadMoreText: "没有更多了",
        showLoadMore: true
      })
      return;
    }

    this.setData({
      movies: override ? movies : this.data.movies.concat(movies),
      showLoadMore: false
    })
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle
    })

  },

  toMovieDetail: function (event) {
    // console.log(event);
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (!this.loading) {
      this.fetchMovieList(true)
        .then(() => {
          wx.stopPullDownRefresh();
        })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.loading) {
      this.setData({
        loadMoreText: "正在加载更多...",
        showLoadMore: true
      })
      this.fetchMovieList(false);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title:"分享给好友",
    }

  }
})