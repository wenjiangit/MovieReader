const util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    inTheaters: {},
    comingSoon: {},
    top250: {},
    movieListShow: true,
    searchPanelShow: false,
    searchResult: {}
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
    wx.showNavigationBarLoading();
    var that = this;
    //使用promise简化请求
    util.wxRequest({
      url: url
    }).then(function (res) {
      that.processDoubanData(res.data, category, dataKey);
    }).catch(function (err) {
      console.log("[ERROR]==>",err);
    }).then(function () {
      wx.hideNavigationBarLoading();
    });

    // wx.request({
    //   url: url,
    //   method: "GET",
    //   header: {
    //     'content-type': "json"
    //   },
    //   success: function (res) {
    //     wx.hideNavigationBarLoading();
    //     that.processDoubanData(res.data, category, dataKey);
    //   },
    //   fail: function () {
    //     wx.hideNavigationBarLoading();
    //     console.log("failed");
    //   }
    // })

  }
  ,

  toMovieDetail: function (event) {
    // console.log(event);
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  onMoreTap: function (e) {
    var category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

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
  },
  onBindConfirm: function (e) {
    if (e.detail.value) {
      this.setData({
        movieListShow: false,
        searchPanelShow: true
      })

      var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + e.detail.value;
      this.getMovieList(searchUrl, "", "searchResult");
      // wx.request({
      //   url: searchUrl,
      //   data: {
      //     q: e.detail.value
      //   },
      //   header: {
      //     "Content-Type": "json"
      //   },
      //   success: function (res) {
      //     console.log(res.data);
      //   }
      // })

    }
  },
  onCloseTap: function () {
    this.setData({
      movieListShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  }
})

