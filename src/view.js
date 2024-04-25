import onChange from 'on-change';

export default (elements, state) => {
  const watchedState = onChange(state, (path, value) => {
    const { form, input, errorMessage } = elements;
    console.log(state);
    switch (path) {
      case 'rssUrl.error':
        errorMessage.textContent = value;
        input.classList.add('is-invalid');
        errorMessage.classList.add('text-danger');
        break;
      case 'rssUrl.urls':
        errorMessage.textContent = 'RSS успешно загружен';
        errorMessage.classList.remove('text-danger');
        errorMessage.classList.add('text-success');
        input.classList.remove('is-invalid');
        state.rssUrl.error = 'pending'; // need to move in Controller
    } 
    form.reset();
    input.focus();
  });

  return {
    watchedState,
  };
};