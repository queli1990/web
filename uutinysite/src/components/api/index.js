class API {
  constructor() {
    this.flag = 1 // 0:中文 1:英文 2: 越南
  }
  getFlag() {
    return this.flag
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
    }
  }
  home() {
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
  hot() {
    let prefix = 'hots?format=json'
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
  search(keyword) {
    let prefix = `albums/?search=${keyword}`
    return this.cmombileUrl(prefix)
  }
}

const api = new API()

export default api
