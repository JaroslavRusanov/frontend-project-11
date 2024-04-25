import './styles.scss';
import 'bootstrap';
import watch from './view.js'
import { object, string } from 'yup';

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    errorMessage: document.querySelector('.text-danger'),
  };

  const state = {
    rssUrl: {
      state: 'pending',
      urls: [],
      error: 'pending',
    },
  };

  const { watchedState } = watch(elements, state);

  const validate = (data) => {
    const schema = object({
      url: string().url('Ссылка должна быть валидным URL').notOneOf(state.rssUrl.urls, 'RSS уже существует').nullable(),
    });
    return schema.validate(data)
      .then((item) => watchedState.rssUrl.urls.push(item.url))
      .catch((err) => watchedState.rssUrl.error = err.message);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    validate(Object.fromEntries(formData));
  });
};
app();
