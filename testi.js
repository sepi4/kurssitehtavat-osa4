(async function(){
  // const wait = ms => new Promise(
  //   resolve => setTimeout(resolve, ms)
  // )


  function wait(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve,ms)
    })
  }

  const sana = await wait(3 * 1000)
    .then(() => 'kissa')
    .catch(() => console.log('ei onnistunut "kissa" palautus'))

  console.log(sana)
  console.log('koira')
})()

console.log('ulkona')


