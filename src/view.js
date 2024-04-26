import onChange from 'on-change';

export default (elements, i18n, state) => {


  const watchedState = onChange(state, (path, value) => {
    const { t } = i18n;

    const { form, input, errorMessage } = elements;
    switch (path) {
      case 'rssUrl.error':
        errorMessage.textContent = t(value);
        input.classList.add('is-invalid');
        errorMessage.classList.add('text-danger');
        break;
      case 'rssUrl.urls':
        if (value = 'processed') {
          errorMessage.textContent = t('successRSS');
          errorMessage.classList.remove('text-danger');
          errorMessage.classList.add('text-success');
          input.classList.remove('is-invalid')
        } else {
          
        }
    } 
    form.reset();
    input.focus();
  });

  return {
    watchedState,
  };
};