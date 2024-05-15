import onChange from 'on-change';

export default (elements, i18n, state) => {
  const {
    form,
    input,
    errorMessage,
    buttonSubmit,
    modal,
    rssPosts,
  } = elements;

  const renderRSS = () => {
    const rssFeeds = document.querySelector('.feeds');
    const titleFeeds = rssFeeds.querySelector('h2');
    titleFeeds.textContent = 'Фиды';
    const ulFeeds = rssFeeds.querySelector('ul');
    const newUlFeeds = document.createElement('ul');
    newUlFeeds.classList.add('list-group', 'border-0', 'rounded-0');

    const titlePosts = rssPosts.querySelector('h2');
    titlePosts.textContent = 'Посты';
    const ulPosts = rssPosts.querySelector('ul');
    const newUlPosts = document.createElement('ul');
    newUlPosts.classList.add('list-group', 'border-0', 'rounded-0');

    state.rss.feeds.forEach(({ title, description }) => {
      const elLiFeed = document.createElement('li');
      elLiFeed.classList.add('list-group-item', 'border-0', 'border-end-0');

      const titlePost = document.createElement('h3');
      titlePost.classList.add('h6', 'm-0');
      titlePost.textContent = title;

      const descriptionPost = document.createElement('p');
      descriptionPost.classList.add('m-0', 'small', 'text-black-50');
      descriptionPost.textContent = description;

      elLiFeed.append(titlePost, descriptionPost);
      newUlFeeds.append(elLiFeed);
    });

    state.rss.posts.forEach(({ title, link, id }) => {
      const elLiPost = document.createElement('li');
      elLiPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const checkId = state.ui.checkedPosts.find((item) => item === id);

      const linkPost = document.createElement('a');
      linkPost.classList.add('fw-normal', 'link-secondary');
      if (!checkId) {
        linkPost.classList.remove('fw-normal', 'link-secondary');
        linkPost.classList.add('fw-bold');
      }
      linkPost.setAttribute('href', `${link}`);
      linkPost.setAttribute('data-id', `${id}`);
      linkPost.setAttribute('target', '_blank');
      linkPost.setAttribute('rel', 'noopener noreferrer');
      linkPost.setAttribute('data-type', 'link');
      linkPost.textContent = title;

      const buttonPost = document.createElement('button');
      buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      buttonPost.setAttribute('type', 'button');
      buttonPost.setAttribute('data-id', `${id}`);
      buttonPost.setAttribute('data-bs-toggle', 'modal');
      buttonPost.setAttribute('data-bs-target', '#modal');
      buttonPost.setAttribute('data-type', 'modal');
      buttonPost.textContent = 'Просмотр';

      elLiPost.append(linkPost, buttonPost);
      newUlPosts.append(elLiPost);
    });
    ulFeeds.replaceWith(newUlFeeds);
    ulPosts.replaceWith(newUlPosts);
  };

  const renderUI = (dataID) => {
    const currentId = dataID.at(-1);
    const currentElement = rssPosts.querySelector(`a[data-id="${currentId}"]`);
    const currentPost = state.rss.posts.filter(({ id }) => id === currentId)[0];

    const titleModal = modal.querySelector('h5');
    titleModal.textContent = currentPost.title;

    const descriptionModal = modal.querySelector('.modal-body');
    descriptionModal.textContent = currentPost.description;

    const linkModal = modal.querySelector('a');
    linkModal.setAttribute('href', currentPost.link);

    currentElement.classList.remove('fw-bold');
    currentElement.classList.add('fw-normal', 'link-secondary');
  };

  const loadProcess = (data) => {
    switch (data) {
      case 'requesting':
        buttonSubmit.disabled = true;
        errorMessage.textContent = '';
        break;
      case 'processed':
        renderRSS();
        break;
      case 'pending':
        buttonSubmit.disabled = false;
        break;
      default:
        throw new Error('unknown process status');
    }
  };

  const { t } = i18n;

  const changingForm = (data) => {
    const { error, valid } = data;
    if (valid) {
      console.log(`2${data}`);
      errorMessage.textContent = t('successRSS');
      errorMessage.classList.remove('text-danger');
      errorMessage.classList.add('text-success');
      input.classList.remove('is-invalid');
      buttonSubmit.disabled = false;
      form.reset();
      input.focus();
    } else {
      errorMessage.textContent = t(error);
      input.classList.add('is-invalid');
      errorMessage.classList.add('text-danger');
      input.focus();
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form':
        changingForm(value);
        break;
      case 'rssUrl.state':
        loadProcess(value);
        break;
      case 'ui.checkedPosts':
        renderUI(value);
        break;
      default:
        throw new Error('unknown state status');
    }
  });

  return {
    watchedState,
  };
};
