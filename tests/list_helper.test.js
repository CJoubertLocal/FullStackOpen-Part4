require('jest');
require('jest-extended')

const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

const listWithTwoBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '659966da68cd46aa8ff87a5a',
    title: 'Netflix Tech Blog',
    author: 'Netflix',
    url: 'https://netflixtechblog.com/',
    likes: 4,
    __v: 1,
  },
];

const listWithManyBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '659966da68cd46aa8ff87a5a',
    title: 'Netflix Tech Blog',
    author: 'Netflix',
    url: 'https://netflixtechblog.com/',
    likes: 4,
    __v: 1,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
  {
    title: 'The GitHub Blog',
    author: 'GitHub',
    url: 'https://github.blog/category/engineering/',
    likes: 150,
  },
  {
    title: 'PostgreSQL Blog',
    author: 'Crunchy Data',
    url: 'https://www.crunchydata.com/blog',
    likes: 75,
  },
  {
    title: 'The Asia-Pacific Journal: Japan Focus',
    author: 'Various',
    url: 'https://apjjf.org/',
    likes: 80,
  },
  {
    title: "Tae Kim's Guide to Learning Japaneses",
    author: 'Tae Kim',
    url: 'https://guidetojapanese.org/learn/category/blog/',
    likes: 200,
  },
];

const listWithTwoBlogsWithMaxLikes = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '659966da68cd46aa8ff87a5a',
    title: 'Netflix Tech Blog',
    author: 'Netflix',
    url: 'https://netflixtechblog.com/',
    likes: 4,
    __v: 1,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 200,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
  {
    title: 'The GitHub Blog',
    author: 'GitHub',
    url: 'https://github.blog/category/engineering/',
    likes: 150,
  },
  {
    title: 'PostgreSQL Blog',
    author: 'Crunchy Data',
    url: 'https://www.crunchydata.com/blog',
    likes: 75,
  },
  {
    title: 'The Asia-Pacific Journal: Japan Focus',
    author: 'Various',
    url: 'https://apjjf.org/',
    likes: 80,
  },
  {
    title: "Tae Kim's Guide to Learning Japaneses",
    author: 'Tae Kim',
    url: 'https://guidetojapanese.org/learn/category/blog/',
    likes: 200,
  },
];

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
  test('favouriteBlog of an array of many blogs should return of the blogs with the greatest number of likes', () => {
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
