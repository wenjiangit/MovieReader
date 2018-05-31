
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

    util.wxRequest({
      url: getMovieUrl,
    }).then(res => {
      this.processData(res.data);
    }).catch(err => {
      console.log("==>[ERROR]", err);
    }).then(() => {
      wx.hideLoading();
    })
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
  },

  convertToCastsName: function (casts) {
    let names = [];
    for (let i = 0; i < casts.length; i++) {
      names.push(casts[i].name);
    }
    return names.join(" , ");
  },

  onImgTap: function (e) {
    var imgUrl = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [imgUrl],
    })
  },
  onCastsImgTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgs = [];

    this.data.movie.casts.forEach(function(x){
      imgs.push(x.avatars.large);
    })
    wx.previewImage({
      urls: imgs,
      current: imgs[index]
    })
  }
})