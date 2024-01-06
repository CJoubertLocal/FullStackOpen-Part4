const lodash = require('lodash');

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

const mostBlogs = (blogs) => (
  blogs.length === 0
    ? {}
    : lodash.maxBy(
      blogs
        .map((b) => b.author)
        .map((a) => ({
          author: a,
          blogs: blogs.filter((b) => b.author === a).length,
        })),
      'blogs',
    )
);

// TODO: This looks elegant, but deeply inefficient.
const mostLikes = (blogs) => (
  blogs.length === 0
    ? {}
    : lodash.maxBy(
      blogs
        .map((b) => b.author)
        .map((a) => ({
          author: a,
          likes: lodash.sumBy(
            blogs.filter((b) => b.author === a),
            'likes',
          ),
        })),
      'likes',
    )
);

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
