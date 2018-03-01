class Tools {
  randomStr() {
    let str = "abcdefghijklmnopqrstuvwxyz0123456789"
    let rstr = ''
    for (let i = 0; i < 11; i++) {
      rstr +=  str.charAt(Math.ceil(Math.random() * 10))
    }
    return rstr
  }
}

let tools = new Tools()

export default tools