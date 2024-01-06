const dummy = (blogs) => 1;

const totalLikes = (blogs) => (
  blogs.length === 0
    ? 0
    : blogs.reduce((acc, curVal) => acc + curVal.likes, 0)
);

const favoriteBlog = (blogs) => {
  const favB = blogs.length === 0
    ? {}
    : blogs.reduce((curMax, nextBlog) => curMax > nextBlog, blogs[0]);

  return {
    title: favB.title,
    author: favB.author,
    likes: favB.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
