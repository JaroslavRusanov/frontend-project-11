import './styles.scss';
import 'bootstrap';
import watch from './view.js'
import { object, string } from 'yup';
import resources from './locales/index.js';
import i18next from 'i18next';
import axios from 'axios';
import parse from './parse.js';

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    errorMessage: document.querySelector('.text-danger'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    rssPosts: document.querySelector('.posts'),
    rssFeeds: document.querySelector('.feeds'),
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then();

  const state = {
    rssUrl: {
      state: 'pending',
      urls: [],
      error: 'pending',
    },
    rss: {
      feeds: [],
      posts: [],
    },
  };

  const { watchedState } = watch(elements, i18n, state);

  const validate = (data) => {
    const schema = object({
      url: string().url().notOneOf(state.rssUrl.urls),
    });

    return schema.validate(data)
      .then((item) => {
        watchedState.rssUrl.state = 'requesting';
        axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${item.url}`)
          .then((response) => {
            const parsedData = parse(response);
            if (!parsedData) {
              watchedState.rssUrl.error = 'errorRSS'
            } else {
              watchedState.rss.feeds.push(parsedData.feed);
              watchedState.rss.posts = [...state.rss.posts, ...parsedData.posts];
              watchedState.rssUrl.urls.push(item.url);
              watchedState.rssUrl.state = 'processed';
            }
          })
          .catch((err) => {
            console.log(err);
            if (err) {
              watchedState.rssUrl.error = 'netError';
            }
          })
        })
      .catch((err) => watchedState.rssUrl.error = err.type)
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    validate(Object.fromEntries(formData));
  });

  elements.input.addEventListener('input', () => watchedState.rssUrl.state ='pending');
};
app();
