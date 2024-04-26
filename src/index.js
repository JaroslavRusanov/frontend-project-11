import './styles.scss';
import 'bootstrap';
import watch from './view.js'
import { object, string } from 'yup';
import resources from './locales/index.js';
import i18next from 'i18next';

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    errorMessage: document.querySelector('.text-danger'),
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const state = {
    rssUrl: {
      state: 'pending',
      urls: [],
      error: 'pending',
    },
  };

  const { watchedState } = watch(elements, i18n, state);

  const validate = (data) => {
    const schema = object({
      url: string().url().notOneOf(state.rssUrl.urls),
    });

    return schema.validate(data)
      .then((item) => {
        watchedState.rssUrl.urls.push(item.url);
        watchedState.rssUrl.state = 'processed'; // move to checker getter requences
      })
      .catch((err) => watchedState.rssUrl.error = err.type)
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    validate(Object.fromEntries(formData));
  });
};
app();
