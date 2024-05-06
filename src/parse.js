import { uniqueId } from "lodash";

export default (response) => {
  const parser = new DOMParser()
  const documentRSS = parser.parseFromString(response.data.contents, 'text/xml');
  const err = documentRSS.querySelector('parsererror');

  if (err) {
    return false;
  }

  const feedID = uniqueId();
  const titleFeed = documentRSS.querySelector('title').textContent;
  const descriptionFeed = documentRSS.querySelector('description').textContent;
  const items = documentRSS.querySelectorAll('item');

  const posts = [];
  items.forEach((item) => {
    const post = {
      id: uniqueId(),
      feedID,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }
    posts.push(post);
  });

  const feed = {
      id: feedID,
      title: titleFeed,
      description: descriptionFeed,
    };

  return { feed, posts };
}