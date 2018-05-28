// pages/movies/movie-detail/movie-detail.js
const app = getApp();
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id;
    var baseUrl = app.globalData.doubanBase;
    var getMovieUrl = baseUrl + "/v2/movie/subject/" + movieId;
    wx.showLoading({
      title: '正在加载..',
    })

    util.httpGet(getMovieUrl, this.processData);

  },

  processData: function (data) {
    console.log(data);
    var movie = {
      title: data.title,
      country: data.countries ? data.countries[0] : "unknown",
      year: data.year,
      collectCount: data.collect_count,
      commentCount: data.comments_count,
      image: data.images ? data.images.large : "",
      stars: util.convertToStarArray(data.rating.stars),
      score: data.rating.average,
      director: data.directors[0].name,
      casts: data.casts,
      originalTitle: data.original_title,
      genres: data.genres.join(" / "),
      summary: data.summary,
      castsName: this.convertToCastsName(data.casts)
    }

    this.setData({
      movie: movie
    })

    wx.hideLoading();

  },

  convertToCastsName: function (casts) {
    let names = [];
    for (let i = 0; i < casts.length; i++) {
      names.push(casts[i].name);
    }
    return names.join(" , ");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})