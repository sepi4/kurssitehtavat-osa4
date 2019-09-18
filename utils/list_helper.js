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

// const mostBlogs = blogs => {
//   const objAuthors = {}
//   blogs.forEach(a => {
//     if (objAuthors[a.author] === undefined) {
//       objAuthors[a.author] = 1
//     }
//     else {
//       objAuthors[a.author] += 1
//     }
//   })
  
//   Object.keys(objAuthors)
//   return objAuthors
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  // mostBlogs,
}
