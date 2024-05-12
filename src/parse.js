export default (response) => {
  const parser = new DOMParser();
  const documentRSS = parser.parseFromString(response.data.contents, 'text/xml');
  const err = documentRSS.querySelector('parsererror');

  if (err) {
    return false;
  }

  const feed = {
    title: documentRSS.querySelector('title').textContent,
    description: documentRSS.querySelector('description').textContent,
  };

  const items = documentRSS.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    return post;
  });

  return { feed, posts, latestPost: posts[0] };
};
