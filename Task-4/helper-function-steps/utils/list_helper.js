// 1. Dummy: A simple function used only to verify that the test environment is set up.
const dummy = (blogs) => {
  return 1;
};

// 2. Total Likes: Adds up the 'likes' property of every blog object in the array.
const totalLikes = (blogs) => {
  // If the array is empty, return 0 immediately.
  // Otherwise, use .reduce() to accumulate a 'sum' starting from 0.
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, post) => sum + post.likes, 0);
};

// 3. Favorite Blog: Finds the single blog object with the most likes.
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  // We compare 'prev' (the current winner) to 'current' (the next item).
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current,
  );

  // We return a simplified version of that blog object.
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

// 4. Most Blogs: Finds which author has written the highest number of posts.
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  // STEP A: Count occurrences of each author.
  // Result looks like: { "Michael Chan": 1, "Edsger W. Dijkstra": 3 }
  const authorCounts = blogs.reduce((counts, blog) => {
    // If the author exists, add 1. If not, start at 0 and add 1.
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  // STEP B: Find the key (author name) with the highest value (blog count).
  const topAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b,
  );

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

// 5. Most Likes: Finds which author has the highest TOTAL likes across all their posts.
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  // STEP A: Create a map of total likes per author.
  // Result looks like: { "Michael Chan": 7, "Edsger W. Dijkstra": 17 }
  const likesCount = blogs.reduce((acc, blog) => {
    // Add the current blog's likes to that specific author's running total.
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  // STEP B: Find the author name with the highest like count.
  const topAuthor = Object.keys(likesCount).reduce((a, b) =>
    likesCount[a] > likesCount[b] ? a : b,
  );

  return {
    author: topAuthor,
    likes: likesCount[topAuthor],
  };
};

// FINAL EXPORT LIST: All functions are exported as an object for the test file to use.
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
