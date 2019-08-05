const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img.kiwifruits.cn/canvasBg1.jpg',
      'http://img.kiwifruits.cn/canvasBg2.jpg',
      'http://img.kiwifruits.cn/canvasBg3.jpg',
      'http://img.kiwifruits.cn/canvasBg1.jpg',
    ],
    changIndex: 0,
    changing: false,//更换背景样式中
    bgImgUrl: '',
    screenWidth: '', //屏幕宽度占比
    tempFilePath: '', //图片零时地址
    phoneSystemInfo: '', //手机系统信息
    canvasWidth: '' //canvas宽度占比
    // 图片比例为 16:9
  },
  onLoad: function () {
    const _this = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        _this.setData({
          phoneSystemInfo: res,
          screenWidth: res.windowWidth / 375,
          canvasWidth: res.windowWidth / 375 * 2 / 3
        })
      }
    })
    this.downImg(0)
  },
  drawPoster() {
    let ctx = wx.createCanvasContext('firstCanvas'),
      that = this.data,
      _this = this;
    let rpx = that.canvasWidth
    let canvasWidth = rpx * 375;
    let canvasHeight = canvasWidth * 1.777778
    //这里的rpx是相对不同屏幕宽度的相对单位，实际的宽度测量，就是实际测出的px像素值*rpx就可以了；之后无论实在iPhone5，iPhone6，iPhone7...都可以进行自适应。
    ctx.setFillStyle('#1A1A1A')
    ctx.fillRect(0, 0, rpx * 375, canvasHeight)
    ctx.drawImage(that.bgImgUrl, 0, 0, rpx * 375, canvasHeight)
    ctx.fillStyle = "#FFFFFF";
    ctx.setFontSize(16 * rpx)
    ctx.setTextAlign('center')
    ctx.fillText('以下文字以屏幕中轴线为校验', canvasWidth / 2, 40 * rpx)
    ctx.setFontSize(24 * rpx)
    ctx.fillStyle = "#E8CDAA";
    ctx.setTextAlign('left')
    ctx.fillText('textAlign=center', canvasWidth / 2, 80 * rpx)
    ctx.setTextAlign('right')
    ctx.fillText('textAlign=center', canvasWidth / 2, 120 * rpx)
    ctx.setTextAlign('center')
    ctx.fillText('textAlign=center', canvasWidth / 2, 160 * rpx)
    ctx.setTextAlign('left')
    ctx.setFontSize(16 * rpx)
    ctx.save();
    ctx.draw(false, () => {
      wx.hideLoading()
      console.log('画完了')
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.screenWidth * 375,
        height: that.screenWidth * 375 * 1.777778,
        canvasId: 'firstCanvas',
        fileType: 'jpg',
        success: function (res) {
          _this.setData({
            tempFilePath: res.tempFilePath
          })
          console.log(res.tempFilePath);
          //自动保存模式
          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          //   success: (res) => {
          //     console.log(res)
          //   },
          //   fail: (err) => { }
          // })
        }
      })
    })
  },
  preImg: function () { //用户点击canvas预览可以保存或者转发
    console.log('预览图片')
    let _this = this
    wx.previewImage({
      current: _this.data.tempFilePath, // 当前显示图片的http链接
      urls: [_this.data.tempFilePath] // 需要预览的图片http链接列表
    })
  },
  changeBg: function (e) {
    if (e.currentTarget.dataset.index == this.data.changIndex){
      this.setData({
        changing: false
      })
      return false;
    }
    wx.showLoading({
      title: '样式更换中...',
    })
    console.log(e.currentTarget.dataset.index)
    this.setData({
      changIndex: e.currentTarget.dataset.index
    })
    this.downImg(e.currentTarget.dataset.index)
  },
  downImg: function (index) {
    let _this = this
    wx.downloadFile({
      url: _this.data.imgUrls[index],
      success: function (res) {
        if (res.statusCode === 200) {
          _this.setData({ bgImgUrl: res.tempFilePath }) //这里的地址是指向本地图片 
          _this.setData({
            changing: false
          })
          _this.drawPoster();//重新绘制
        }
      }
    })
  },
  saveImg:function(){
    console.log('保存图片')
    console.log(this.data.tempFilePath)
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.tempFilePath,
      success: (res) => {
        console.log(res)
      },
      fail: (err) => { }
    })
  },
  goChangeBg(){
    this.setData({
      changing: true
    })
  }
})