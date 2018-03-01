class API {
  constructor() {
    window.apiFlag = 0
    this.flag = 0 // 0:中文 1:英文 2: 越南 3:阿拉伯 4:泰语
  }
  cmombileUrl(prefix) {
    switch(this.flag) {
      case 0 :
        return `http://47.93.83.7:8000/${prefix}`
        break
      case 1 :
        return `http://enapi.100uu.tv/${prefix}`
        break
      case 2 :
        return `http://viapi.100uu.tv/${prefix}`
        break
      case 3 :
        return `http://arapi.100uu.tv/${prefix}`
        break
      case 4 :
        return `http://thapi.100uu.tv/${prefix}`
        break
    }
  }
  getPayUrl() {
    switch(this.flag) {
      case 0 :
        return `http://api.100uu.tv/app/member/doPackageOrPayWay.do?platform=web&channel=uu100&language=cn`
        break
      case 1 :
        return `http://api.100uu.tv/app/member/doPackageOrPayWay.do?platform=web&channel=uu100&language=en`
        break
      case 2 :
        return `http://api.100uu.tv/app/member/doPackageOrPayWay.do?platform=web&channel=uu100&language=vi`
        break
      case 3 :
        return `http://api.100uu.tv/app/member/doPackageOrPayWay.do?platform=web&channel=uu100&language=ar`
        break
      case 4 :
        return `http://api.100uu.tv/app/member/doPackageOrPayWay.do?platform=web&channel=uu100&language=th`
        break
    }
  }
  getCurrency() {
    switch(this.flag) {// 0:中文 1:英文 2: 越南 3:阿拉伯 4:泰语
      case 0 :
        return '￥'
        break
      case 1 :
        return '$'
        break
      case 2 :
        return '₫'
        break
      case 3 :
        return '﷼'
        break
      case 4 :
        return '฿'
        break
    }
  }
  getFlag() {
    return this.flag;
  }
  getPlatform() {
    switch(this.flag){
      case 0:
        return 'uutv'
        break
      case 1:
        return 'en'
        break
      case 2:
        return 'vi'
        break
      case 3 :
        return `ar`
        break
      case 4 :
        return `th`
        break
    }
  }
  nav() {
    let prefix = 'index2/?format=json&platform=mobile'
    return this.cmombileUrl(prefix)
  }
  genres(id) {
    let prefix = `genres/${id}/?format=json&platform=mobile`
    return this.cmombileUrl(prefix)
  }
  albums(id, page, pageSize) {
    let prefix = `albums/?format=json&genre=${id}&page=${page}&page_size=${pageSize}`
    return this.cmombileUrl(prefix)
  }
  episodes(id) {
    let prefix = `albums/${id}/?format=json`
    return this.cmombileUrl(prefix)
  }
  categories(id) {
    let prefix = `categories/${id}/?format=json`
    return this.cmombileUrl(prefix)
  }
  related(id) {
    let prefix = `related/${id}`
    return this.cmombileUrl(prefix)
  }
  search(keyword, page) {
    let prefix = `albums/?search=${keyword}&page=${page}&page_size=10`
    return this.cmombileUrl(prefix)
  }
}

const api = new API()

export default api
