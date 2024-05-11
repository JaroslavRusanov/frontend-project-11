import './styles.scss';
import 'bootstrap';
import watch from './view.js'
import { object, string } from 'yup';
import resources from './locales/index.js';
import i18next from 'i18next';
import axios from 'axios';
import parse from './parse.js';
import { uniqueId } from "lodash";



const app = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    errorMessage: document.querySelector('.text-danger'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    rssPosts: document.querySelector('.posts'),
    rssFeeds: document.querySelector('.feeds'),
    modal: document.getElementById('modal'),
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const state = {
    rssUrl: {
      state: 'pending', // 'requesting', 'processed','changed', 'pending'
      urls: [],
      error: 'pending',
    },
    rss: {
      feeds: [],
      posts: [],
    },
    ui: {
      checkedPosts: [],
    }
  };

  const { watchedState } = watch(elements, i18n, state);

  const checkRSSPosts = () => {
    const isNewTitle = (posts, latestTitle) => {
      let result = true;
      posts.forEach(({ title }) => {
        if (title === latestTitle) {
          result = false;
        }
      })
      return result;
    };

    setTimeout(() => {
      state.rssUrl.urls.forEach((url) => {
        return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
          .then((response) => {
            const { latestPost } = parse(response);
            const statePosts = state.rss.posts;
            console.log('check')
            if (isNewTitle(statePosts, latestPost.title)) {
              latestPost.id = uniqueId();
              watchedState.rss.posts = [latestPost, ...state.rss.posts];
              watchedState.rssUrl.state = 'changed';
            }
            watchedState.rssUrl.state ='pending';
          })
          .catch((err) => {
            if (err) {
              watchedState.rssUrl.error = 'netError';
            }
          });
      });
      checkRSSPosts();
    }, 5000);
  };

  const requestRSS = (url) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then((response) => {
        const parsedData = parse(response);
        if (!parsedData) {
          watchedState.rssUrl.error = 'errorRSS'
        } else {
          parsedData.posts.forEach((post) => post.id = uniqueId())
          watchedState.rss.feeds = [...state.rss.feeds, parsedData.feed];
          watchedState.rss.posts = [...parsedData.posts, ...state.rss.posts];
          watchedState.rssUrl.urls = [...state.rssUrl.urls, url];
          watchedState.rssUrl.state = 'processed';
        }
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          watchedState.rssUrl.error = 'netError';
        }
      });
  };

  const getRSS = (data) => {
    const schema = object({
      url: string().url().notOneOf(state.rssUrl.urls),
    });
    return schema.validate(data)
      .then((item) => {
        watchedState.rssUrl.state = 'requesting';
        requestRSS(item.url);
        })
      .catch((err) => watchedState.rssUrl.error = err.type)
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    getRSS(Object.fromEntries(formData));
  });

  elements.input.addEventListener('input', () => watchedState.rssUrl.state ='pending');

  elements.rssPosts.addEventListener('click', (e) => {
    const typeElement = e.target.dataset.type;
    if (typeElement) {
      const currentElementID = e.target.dataset.id;
      watchedState.ui.checkedPosts = [...state.ui.checkedPosts, currentElementID];
    }
  });

  checkRSSPosts();
};

app();
