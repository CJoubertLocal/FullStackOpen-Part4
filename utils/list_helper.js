const dummy = (blogs) => 1;

const totalLikes = (blogs) => (
  blogs.length === 0
    ? 0
    : blogs.reduce((acc, curVal) => acc + curVal.likes, 0)
);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) { return {}; }

  const favouriteBlogValues = blogs.reduce((curMax, nextBlog) => (
    curMax.likes > nextBlog.likes
      ? curMax
      : nextBlog), blogs[0]);

  return {
    title: favouriteBlogValues.title,
    author: favouriteBlogValues.author,
    likes: favouriteBlogValues.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
