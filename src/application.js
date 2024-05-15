import './styles.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import { uniqueId, differenceBy } from 'lodash';
import { object, string } from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import parse from './parse.js';
import watch from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    errorMessage: document.querySelector('.text-danger'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    modal: document.getElementById('modal'),
    rssPosts: document.querySelector('.posts'),
  };

  const state = {
    form: {
      error: null,
      valid: false,
    },
    rssUrl: {
      state: 'pending', // 'requesting', 'processed','changed', 'pending'
      urls: [],
    },
    rss: {
      feeds: [],
      posts: [],
    },
    ui: {
      checkedPosts: [],
    },
  };

  const controller = (i18n) => {
    const { watchedState } = watch(elements, i18n, state);

    const checkRSSPosts = () => {
      const promises = state.rssUrl.urls.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
        .then((response) => response)
        .catch((err) => console.log(err)));
      const promise = Promise.all(promises);
      return promise
        .then((items) => {
          items.forEach((response) => {
            const { latestPost } = parse(response);
            const statePosts = state.rss.posts;
            const diffPostsLength = differenceBy(statePosts, [latestPost], 'title').length;
            if (diffPostsLength === statePosts.length) {
              latestPost.id = uniqueId();
              state.rss.posts = [latestPost, ...state.rss.posts];
              watchedState.rssUrl.state = 'processed';
              watchedState.form = { error: null, valid: true };
            }
            watchedState.rssUrl.state = 'pending';
          });
        })
        .finally(() => setTimeout(checkRSSPosts, 5000));
    };

    const requestRSS = (url) => {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
        .then((response) => {
          const parsedData = parse(response);
          if (!parsedData) {
            watchedState.form = { error: 'errorRSS', valid: false };
          } else {
            parsedData.posts.forEach((post) => {
              post.id = uniqueId(); // eslint-disable-line
            });
            state.rss.feeds = [...state.rss.feeds, parsedData.feed];
            state.rss.posts = [...parsedData.posts, ...state.rss.posts];
            state.rssUrl.urls = [...state.rssUrl.urls, url];
            watchedState.rssUrl.state = 'processed';
            watchedState.form = { error: null, valid: true };
          }
        })
        .catch((err) => {
          if (err) {
            watchedState.form = { error: 'netError', valid: false };
          }
        });
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const schema = object({
        url: string().url().notOneOf(state.rssUrl.urls),
      });
      schema.validate(Object.fromEntries(formData))
        .then((item) => {
          watchedState.rssUrl.state = 'requesting';
          requestRSS(item.url);
        })
        .catch((err) => {
          watchedState.form = { error: err.type, valid: false };
        });
    });

    elements.input.addEventListener('input', () => {
      watchedState.rssUrl.state = 'pending';
    });

    elements.rssPosts.addEventListener('click', (e) => {
      const typeElement = e.target.dataset.type;
      if (typeElement) {
        const currentElementID = e.target.dataset.id;
        watchedState.ui.checkedPosts = [...state.ui.checkedPosts, currentElementID];
      }
    });

    checkRSSPosts();
  };

  const local = i18next.createInstance();
  local.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => controller(local))
    .catch((err) => console.log(err));
};
