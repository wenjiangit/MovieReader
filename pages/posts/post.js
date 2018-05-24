var postsData = require("../../data/posts-data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts_key:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    this.setData({
      posts_key: postsData.postsList
    });


  },

  /**
   * 跳转到文章详情页
   */
  toPostDetail: function (event) {
    var postId = event.currentTarget.dataset.postId;
    console.log("toPostDetail" + postId);

    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })

  }
  ,

  onSwiperTap:function(event){
    //target和currentTarget target表示事件触发元素，currentTarget表示事件捕捉元素
    var postId = event.target.dataset.postId;
    console.log("onSwiperTap" + postId);

    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })

  }
})