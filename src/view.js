import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { form,
    input,
    errorMessage,
    buttonSubmit,
    rssPosts,
    rssFeeds,
  } = elements;

  const watchedState = onChange(state, (path, value) => {
    const { t } = i18n;
      if (path === 'rssUrl.error') {
        errorMessage.textContent = t(value);
        input.classList.add('is-invalid');
        errorMessage.classList.add('text-danger');
        input.focus();
      } else if (path === 'rssUrl.state') {
          if (value === 'requesting') {
            errorMessage.textContent = '';
            buttonSubmit.disabled = true;
          } else if (value === 'processed') { 
            errorMessage.textContent = t('successRSS');
            errorMessage.classList.remove('text-danger');
            errorMessage.classList.add('text-success');
            input.classList.remove('is-invalid');
            buttonSubmit.disabled = false;
            form.reset();
            input.focus();
            renderRSS();
          } else if (value === 'pending') {
            buttonSubmit.disabled = false;
            input.classList.remove('is-invalid');
        }
      }
  });

  const renderRSS = () => {
    rssFeeds.innerHTML = `<div class="card-body"><h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0"></ul></div>`;
    rssPosts.innerHTML = `<div class="card-body"><h2 class="card-title h4">Посты</h2></div><ul class="list-group border-0 rounded-0"></ul></div>`;

    const feedsUl = rssFeeds.querySelector('ul');
    const postsUl = rssPosts.querySelector('ul');

    state.rss.feeds.forEach(({ title, description }) => {
      const elLiFeed = document.createElement('li');
      elLiFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
      elLiFeed.innerHTML = `<h3 class="h6 m-0">${title}</h3><p class="m-0 small text-black-50">${description}</p>`;
      feedsUl.append(elLiFeed);
    });

    state.rss.posts.forEach(({ title, link, id }) => {
      const elLiPost = document.createElement('li');
      elLiPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      elLiPost.innerHTML = `<a href="${link}" class="fw-bold" data-id="${id}" target="_blank" rel="noopener noreferrer">${title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      postsUl.append(elLiPost);
    });

  }

  return {
    watchedState,
  };
};