// (async function(){
//   // const wait = ms => new Promise(
//   //   resolve => setTimeout(resolve, ms)
//   // )


//   function wait(ms) {
//     return new Promise(function(resolve) {
//       setTimeout(resolve,ms)
//     })
//   }

//   const sana = await wait(3 * 1000)
//     .then(() => 'kissa')
//     .catch(() => console.log('ei onnistunut "kissa" palautus'))

//   console.log(sana)
//   console.log('koira')
// })()

// console.log('ulkona')
//


// const givePromise = (x, y) => {
//   return new Promise((resolve, reject) => {
//     if (x > 5) {
//       console.log('in givePromise: x', x, 'y', y)
//       const num = x + y
//       resolve(num)
//     }
//     else {
//       reject()
//     }
//   })
// }

// const promise = givePromise(8, 99)
// promise
//   .then((x) => {
//     console.log('then 1', x)
//     return x
//   })
//   .then((x) => {
//     console.log('then 2', x)
//     return x
//   })

// const kerroKahdella = x => x*2
// const miinusYksi = x => x - 1

// console.log(miinusYksi(kerroKahdella(3)))





// const chainable = {
//   sum: (...values) => {
//     return values.reduce((pre, cur) => pre + cur, this.result)
//   },
// }
// const num = chainable
//   .sum(1,2,3)
// console.log()





// let funkkarit = function(initial) {
//   this.result = initial
//   function summa(...values) {
//     return this.result + values.reduce((pre, cur) => pre + cur)
//   }
//   return this
// }

// console.log(funkkarit.summa(1,2,3,4))

// let funkkarit = {
//   summa: function (...values) {
//     return this.result + values.reduce((pre, cur) => pre + cur)
//   }
// }


// let Arithmetic = {
//   normalFunctionBind: function () {
//     return this
//   }.bind(this),
//   normalFunction: function () {
//     return this
//   },
//   arrowFunction: () => {
//     return this
//   },
//   sum: function (...args){
//     this.value = args.reduce((sum, current) => sum + current, 0)
//     return this
//   },
//   add:function (value) {
//     this.value = this.value + value
//     return this
//   },
//   subtract:function (value) {
//     this.value = this.value - value
//     return this
//   },
//   average:function (...args) {
//     this.value = args.length
//       ? (this.sum(...args).value) / args.length
//       : undefined
//     return this
//   },
// }

// let a = Arithmetic
// // .subtract(3)   // => { value: 7 }
// // .add(4)        // => { value: 11 }
// // .value         // => 11



// let Arithmetic = function() {
//   this.normalFunction = function () {
//     return this
//   }
//   this.sum = function (...args){
//     this.value = args.reduce((sum, current) => sum + current, 0)
//     return this
//   }
//   this.add = function (value) {
//     this.value = this.value + value
//     return this
//   }
//   this.subtract = function (value) {
//     this.value = this.value - value
//     return this
//   }
//   this.average = function (...args) {
//     this.value = args.length
//       ? (this.sum(...args).value) / args.length
//       : undefined
//     return this
//   }
//   return this
// }

// let a = Arithmetic()
// const num = a
//   .sum(2,3,4,4)
//   .subtract(10)

// console.log(num)

// console.log(a.sum(1, 3, 6).subtract(5).subtract(55).sum(9,13).add(44).value)
// console.log(a.normalFunction())
// console.log(a.normalFunctionBind())
// console.log(a.arrowFunction())
// console.log(a.sum().get())



// var obj = function(){
//   this.i = 0 // public property

//   this.add = function(i){ // public function add()
//     this.i += i   // Add The value
//     return obj().add()
//   }

//   this.subtract = function(i){  // public function substract()
//     this.i -= i // Subtract's the value
//     return this
//   }

//   this.print = function(){  // public function print()
//     console.log(this.i)  // Prints the value
//   }
//   return this
// }

// let num = obj()
// console.log(num.add(5))



const wrap = num => ({
  add: x => {
    num += x
    return wrap(num)
  },
  addMany: (...arr) => {
    arr.forEach(x => { num += x})
    return wrap(num)
  },
  get: () => {
    return num
  }
})

const x = wrap(-10)
const num = x
  .add(3)
  .addMany(0,0,9)
  .get()

console.log(num)

let sana = '    KisSa '

String.prototype.sepi = function () {
  return this
}
let uusiSana = sana
  .toUpperCase()
  .toLowerCase()
  .trim()
  .sepi()
console.log(uusiSana)

Number.prototype.plussa = function (x) {
  return this + x
}
Number.prototype.miinus = function (x) {
  return this - x
}
let n = 10
console.log(n.plussa(1).miinus(2))


let arr = [1,2,3,4]

Object.prototype.switchFirstLast = function () {
  let array = this
  if (array.length < 2) {
    return this
  }
  const temp = array[0]
  array[0] = array[array.length - 1]
  array[array.length - 1] = temp
  return array
}
Object.prototype.addOneToAll = function () {
  let array = this
  for (let i = 0; i < array.length; i++) {
    array[i] += 1
  }
  return array
}

console.log(arr.reverse().concat(66).switchFirstLast().addOneToAll())
