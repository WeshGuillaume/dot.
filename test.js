
const store = new Set()
const test1 = "letc=f=>(...a)=>((f=f.bind(0,...a)).length?c:f)(f)"
const test2 = test1.split('')
let test3

// letc=f>(.a)bind0,gh?:

function compress (bin) {
  test2.forEach(c => {
    store.add(c)
  })
  const s = [...store]
  test3 = test2.map(c => s.indexOf(c))
  console.log(test3)
}

compress()
