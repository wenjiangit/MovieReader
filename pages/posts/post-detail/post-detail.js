var postsData = require("../../../data/posts-data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMusicPlaying: false,
    collected: false,
    postData:{},
    postId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.postId = postId;
    console.log(postId);
    var postData = postsData.postsList[postId];
    console.log(postData);
    this.setData({
      postData: postData
    });

    //初始化收藏状态
    var postsCollection = wx.getStorageSync("posts_collection");
    if (postsCollection) {
      var collected = postsCollection[postId];
      if (collected) {
        this.setData({
          collected: collected
        })
      }
    } else {
      postsCollection = {};
      postsCollection[postId] = false;
      wx.setStorageSync("posts_collection", postsCollection);
    }

  },

  onCollectionTap: function (event) {
    var postsCollection = wx.getStorageSync("posts_collection");
    var collected = !postsCollection[this.data.postId];
    this.setData({
      collected: collected
    })

    postsCollection[this.data.postId] = collected;
    wx.setStorageSync("posts_collection", postsCollection);

    wx.showToast({
      title: collected ? '收藏成功' : '取消成功',
      duration: 1000
    })
  }
  ,

  onShareTap: function (event) {
    var itemList = [
      "分享到微信好友",
      "分享到微信朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {

        wx.showToast({
          title: itemList[res.tapIndex],
          duration: 1000,
          mask: true,
        })
      }
    })

  }
  ,

  onMusicTap: function (event) {
    var postData = postsData.postsList[this.data.postId];
    // console.log(postData.music);
    if (this.data.isMusicPlaying) {
      wx.pauseBackgroundAudio();
      this.setData({
        isMusicPlaying: false
      });

    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isMusicPlaying: true
      });
    }

  }
  ,
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