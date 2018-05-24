var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    inTheaters: {},
    comingSoon: {},
    top250: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var baseUrl = app.globalData.doubanBase;

    var inTheatersUrl = baseUrl + "/v2/movie/in_theaters?count=3";
    var comingSoonUrl = baseUrl + "/v2/movie/coming_soon?count=3";
    var top250Url = baseUrl + "/v2/movie/top250?count=3";

    this.getMovieList(inTheatersUrl, "正在热映", "inTheaters");
    this.getMovieList(comingSoonUrl, "即将上映", "comingSoon");
    this.getMovieList(top250Url, "Top250", "top250");

  },

  getMovieList: function (url, category, dataKey) {
    var that = this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        'content-type': "json"
      },
      success: function (res) {
        console.log(res);
        that.processDoubanData(res.data, category, dataKey);
      },
      fail: function () {
        console.log("failed");
      }
    })

  }
  ,

  toMovieDetail: function (event) {
    // console.log(event);
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  }
  ,

  onMoreTap: function (e) {
    var category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  }
  ,
  processDoubanData: function (moviesDouban, category, dataKey) {
    var movies = [];
    for (var index in moviesDouban.subjects) {
      var movie = moviesDouban.subjects[index];
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
    // console.log(movies);
    var readyData = {};
    readyData[dataKey] = {
      movies: movies,
      category: category
    };

    this.setData(readyData);
  }
})

