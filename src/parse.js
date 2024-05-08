import { uniqueId } from "lodash";



export default (response) => {
  const parser = new DOMParser()
  const documentRSS = parser.parseFromString(response.data.contents, 'text/xml');
  const err = documentRSS.querySelector('parsererror');

  if (err) {
    return false;
  }

  const feedID = uniqueId();
  const feed = {
    id: feedID,
    title: documentRSS.querySelector('description').textContent,
    description: documentRSS.querySelector('description').textContent,
  };

  const items = documentRSS.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const post = {
      id: uniqueId(),
      feedID,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }
    return post;
  });

  return { feed, posts, latestPost: posts[0]};
}