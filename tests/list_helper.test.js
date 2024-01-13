require('jest');
require('jest-extended');

const lodash = require('lodash');
const {
  listWithOneBlog,
  listWithTwoBlogs,
  listWithManyBlogs,
  listWithTwoBlogsWithMaxLikes,
  listWhereAllAuthorsHaveTheSameTotalNumberOfLikesAcrossBlogs,
} = require('./testData');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  expect(listHelper.dummy(blogs)).toBe(1);
});

describe('totalLikes', () => {
  test('totalLikes of an empty array of blogs should be 0', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('totalLikes of array of one element should return the likes value of that element', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(listWithOneBlog[0].likes);
  });

  test('totalLikes of array of two elements should return the sum of the like values of those elements', () => {
    expect(
      listHelper.totalLikes(listWithTwoBlogs),
    ).toBe(listWithTwoBlogs[0].likes + listWithTwoBlogs[1].likes);
  });

  let sumOfLikesInListOfManyBlogs = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < listWithManyBlogs.length; i++) {
    sumOfLikesInListOfManyBlogs += listWithManyBlogs[i].likes;
  }
  test('totalLikes of array of two elements should return the sum of the like values of those elements', () => {
    expect(
      listHelper.totalLikes(listWithManyBlogs),
    ).toBe(sumOfLikesInListOfManyBlogs);
  });
});

describe('favourite blog', () => {
  test('favoriteBlog of an empty array should return an empty object', () => {
    expect(listHelper.favoriteBlog([])).toStrictEqual({});
  });

  test('favouriteBlog of an array of one blog should return that blog', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog))
      .toStrictEqual({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      });
  });

  const favouriteOfTwoBlogs = listWithTwoBlogs[0].likes > listWithTwoBlogs[1].likes
    ? listWithTwoBlogs[0]
    : listWithTwoBlogs[1];
  test('favouriteBlog of an array of two blogs should return the blog with the greater number of likes', () => {
    expect(listHelper.favoriteBlog(listWithTwoBlogs))
      .toStrictEqual({
        title: favouriteOfTwoBlogs.title,
        author: favouriteOfTwoBlogs.author,
        likes: favouriteOfTwoBlogs.likes,
      });
  });

  let favouriteOfMany = listWithTwoBlogs[0];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < listWithManyBlogs.length; i++) {
    if (listWithManyBlogs[i].likes > favouriteOfMany.likes) {
      // eslint-disable-next-line no-const-assign
      favouriteOfMany = listWithManyBlogs[i];
    }
  }
  test('favouriteBlog of an array of many blogs should return of the blogs with the greatest number of likes', () => {
    expect(listHelper.favoriteBlog(listWithManyBlogs))
      .toStrictEqual({
        title: favouriteOfMany.title,
        author: favouriteOfMany.author,
        likes: favouriteOfMany.likes,
      });
  });

  const maximumNumberOfLikesInBlogList = listWithTwoBlogsWithMaxLikes
    .reduce((max, nextVal) => (
      max.likes > nextVal.likes
        ? max
        : nextVal), listWithTwoBlogsWithMaxLikes[0]).likes;

  const twoBlogsWithMaximumNumberOfLikesInList = listWithTwoBlogsWithMaxLikes
    .filter((b) => b.likes === maximumNumberOfLikesInBlogList);

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < listWithTwoBlogsWithMaxLikes.length; i++) {
    if (listWithTwoBlogsWithMaxLikes[i].likes > listWithTwoBlogsWithMaxLikes.likes) {
      // eslint-disable-next-line no-const-assign
      favouriteOfMany = listWithTwoBlogsWithMaxLikes[i];
    }
  }
  test('favouriteBlog of an array of many blogs should return any of the blogs with the greatest number of likes if there is a tie', () => {
    expect(listHelper.favoriteBlog(listWithTwoBlogsWithMaxLikes))
      .toBeOneOf(
        [
          {
            title: twoBlogsWithMaximumNumberOfLikesInList[0].title,
            author: twoBlogsWithMaximumNumberOfLikesInList[0].author,
            likes: twoBlogsWithMaximumNumberOfLikesInList[0].likes,
          },
          {
            title: twoBlogsWithMaximumNumberOfLikesInList[1].title,
            author: twoBlogsWithMaximumNumberOfLikesInList[1].author,
            likes: twoBlogsWithMaximumNumberOfLikesInList[1].likes,

          },
        ],
      );
  });
});

describe('mostBlogs should return the author with the most blogs in the list and the number of associated blogs', () => {
  test('mostBlogs should return an empty object for an empty list', () => {
    expect(listHelper.mostBlogs([])).toStrictEqual({});
  });

  test('mostBlogs should return an object listing one blog a list with one entry', () => {
    expect(listHelper.mostBlogs(listWithOneBlog))
      .toStrictEqual({
        author: listWithOneBlog[0].author,
        blogs: 1,
      });
  });

  test('mostBlogs should return an object listing one of either author in a list with two entries where the authors are different', () => {
    expect(listHelper.mostBlogs(listWithTwoBlogs))
      .toBeOneOf(
        [
          {
            author: listWithTwoBlogs[0].author,
            blogs: 1,
          },
          {
            author: listWithTwoBlogs[1].author,
            blogs: 1,
          },
        ],
      );
  });

  const listOfAuthors = listWithManyBlogs.map((b) => ({ author: b.author, blogs: 0 }));
  for (let i = 0; i < listWithManyBlogs.length; i += 1) {
    for (let j = 0; j < listOfAuthors.length; j += 1) {
      if (listWithManyBlogs[i].author === listOfAuthors[j].author) {
        listOfAuthors[j].blogs += 1;
      }
    }
  }
  const mostProlificAuthor = listOfAuthors.reduce(
    (mostProlific, nextA) => (mostProlific.blogs > nextA.blogs ? mostProlific : nextA),
  );
  test('mostBlogs should return an object listing the most prolific author out of a list of many blogs', () => {
    expect(listHelper.mostBlogs(listWithManyBlogs))
      .toStrictEqual(mostProlificAuthor);
  });

  const listOfAuthorsTwo = listWithTwoBlogsWithMaxLikes.map(
    (b) => ({ author: b.author, blogs: 0 }),
  );
  let maxPubs = 0;
  for (let i = 0; i < listWithTwoBlogsWithMaxLikes.length; i += 1) {
    for (let j = 0; j < listOfAuthorsTwo.length; j += 1) {
      if (listWithTwoBlogsWithMaxLikes[i].author === listOfAuthorsTwo[j].author) {
        listOfAuthorsTwo[j].blogs += 1;
        if (listOfAuthorsTwo[j].blogs > maxPubs) {
          maxPubs = listOfAuthorsTwo[j].blogs;
        }
      }
    }
  }
  const mostProlificAuthors = listOfAuthors.filter((ab) => ab.blogs === maxPubs);
  test('mostBlogs should return an object listing one of the most prolific authors if there are multiple authors with the maximum number of blogs', () => {
    expect(listHelper.mostBlogs(listWithManyBlogs))
      .toBeOneOf(mostProlificAuthors);
  });
});

describe('mostLikes should return the author with the most likes across blogs', () => {
  test('mostLikes of empty list should return {}', () => {
    expect(listHelper.mostLikes([])).toStrictEqual({});
  });

  test('mostLikes of list with one blog should return the likes for that list', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toStrictEqual({
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes,
    });
  });

  const mostLikedBlogOfTwo = (
    listWithTwoBlogs[0].likes > listWithTwoBlogs[1].likes
      ? {
        author: listWithTwoBlogs[0].author,
        likes: listWithTwoBlogs[0].likes,
      }
      : {
        author: listWithTwoBlogs[1].author,
        likes: listWithTwoBlogs[1].likes,
      }
  );
  test('mostLikes of list with two blogs should return the author with the most likes across the two blogs', () => {
    expect(listHelper.mostLikes(listWithTwoBlogs)).toStrictEqual(mostLikedBlogOfTwo);
  });

  const listOfAuthors = listWithManyBlogs.map((b) => (
    { author: b.author, likes: 0 }));
  for (let i = 0; i < listWithManyBlogs.length; i += 1) {
    for (let j = 0; j < listOfAuthors.length; j += 1) {
      if (listWithManyBlogs[i].author === listOfAuthors[j].author) {
        listOfAuthors[j].likes += listWithManyBlogs[i].likes;
      }
    }
  }
  const authorWithMostLikes = lodash.maxBy(listOfAuthors, 'likes');
  test('mostLikes of list with many blogs should return the author with the most likes across blogs in the list', () => {
    expect(listHelper.mostLikes(listWithManyBlogs)).toStrictEqual(authorWithMostLikes);
  });

  const listOfAuthorsTwo = listWhereAllAuthorsHaveTheSameTotalNumberOfLikesAcrossBlogs.map((b) => (
    { author: b.author, likes: 0 }));
  for (
    let i = 0;
    i < listWhereAllAuthorsHaveTheSameTotalNumberOfLikesAcrossBlogs.length;
    i += 1) {
    for (let j = 0; j < listOfAuthorsTwo.length; j += 1) {
      if (listWhereAllAuthorsHaveTheSameTotalNumberOfLikesAcrossBlogs[i].author
        === listOfAuthorsTwo[j].author) {
        listOfAuthorsTwo[j].likes
          += listWhereAllAuthorsHaveTheSameTotalNumberOfLikesAcrossBlogs[i].likes;
      }
    }
  }
  test('mostLikes of list with many blogs should return any of the authors with the most likes across blogs in the list if there is a tie', () => {
    expect(listHelper.mostLikes(
      listWhereAllAuthorsHaveTheSameTotalNumberOfLikesAcrossBlogs,
    )).toBeOneOf(listOfAuthorsTwo);
  });
});
