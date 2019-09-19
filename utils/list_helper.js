const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (previous, current) => previous + current.likes,
    0
  )
}

const favoriteBlog = blogs => {
  const blog = blogs.reduce(
    (previous, current) => {
      if (previous === undefined) {
        return current
      }
      if (previous.likes > current.likes) {
        return previous
      }
      else {
        return current
      }
    },
    undefined
  )
  return blog !== undefined
    ? {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
    : blog
}

const mostBlogs = blogs => {
  const objAuthors = {}
  blogs.forEach(a => {
    if (objAuthors[a.author] === undefined) {
      objAuthors[a.author] = 1
    }
    else {
      objAuthors[a.author] += 1
    }
  })


  // const startValue = {
  //   author: undefined,
  //   blogs: 0,
  // }
  // const reducer = (pre, cur) => {
  //   if (objAuthors[cur] > pre.blogs) {
  //     return {
  //       author: cur,
  //       blogs: objAuthors[cur],
  //     }
  //   }
  //   else {
  //     return pre
  //   }
  // }
  // return Object.keys(objAuthors).reduce(
  //   reducer,
  //   startValue,
  // )

  let max = 0
  let name = undefined
  Object.keys(objAuthors).forEach(x => {
    if (objAuthors[x] > max) {
      name = x
      max = objAuthors[x]
    }
  })
  return name === undefined ? {} : {
    author: name,
    blogs: max
  }
}

const mostLikes = blogs => {
  const likesPerAuthor = blogs.reduce((pre, cur) => {
    if (pre[cur.author] === undefined) {
      pre[cur.author] = cur.likes
    }
    else {
      pre[cur.author] += cur.likes
    }
    return pre
  }, {})

  return Object.keys(likesPerAuthor).reduce((pre, cur) => {
    if (pre.likes === undefined || likesPerAuthor[cur] > pre.likes) {
      return {
        author: cur,
        likes: likesPerAuthor[cur],
      }
    }
    return pre

  }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
