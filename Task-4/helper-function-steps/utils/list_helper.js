const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, post) => sum + post.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current,
  );
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

// ⬇️ ADD THIS FUNCTION ⬇️
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const topAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b,
  );

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  // We create a map of { "Author Name": totalLikes }
  const likesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  // Find the author with the highest number of total likes
  const topAuthor = Object.keys(likesCount).reduce((a, b) =>
    likesCount[a] > likesCount[b] ? a : b,
  );

  return {
    author: topAuthor,
    likes: likesCount[topAuthor],
  };
};

// FINAL EXPORT LIST
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes, // Add this one!
};
