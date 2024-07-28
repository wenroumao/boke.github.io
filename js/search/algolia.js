window.addEventListener('load', () => {
  const openSearch = () => {
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    btf.animateIn(document.getElementById('search-mask'), 'to_show 0.5s');
    btf.animateIn(document.querySelector('#algolia-search .search-dialog'), 'titleScale 0.5s');
    setTimeout(() => document.querySelector('#algolia-search .ais-SearchBox-input').focus(), 100);

    // shortcut: ESC
    const keydownHandler = (event) => {
      if (event.code === 'Escape') {
        closeSearch();
        document.removeEventListener('keydown', keydownHandler);
      }
    };
    document.addEventListener('keydown', keydownHandler);
  };

  const closeSearch = () => {
    document.body.style.width = '';
    document.body.style.overflow = '';
    btf.animateOut(document.querySelector('#algolia-search .search-dialog'), 'search_close 0.5s');
    btf.animateOut(document.getElementById('search-mask'), 'to_hide 0.5s');
  };

  const searchClickFn = () => {
    document.querySelector('#search-button > .search').addEventListener('click', openSearch);
  };

  const searchClickFnOnce = () => {
    document.getElementById('search-mask').addEventListener('click', closeSearch);
    document.querySelector('#algolia-search .search-close-button').addEventListener('click', closeSearch);
  };

  const cutContent = (content) => {
    if (!content) return '';

    const firstOccur = content.indexOf('<mark>');
    let start = Math.max(0, firstOccur - 30);
    let end = Math.min(content.length, firstOccur + 120);

    return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '');
  };

  const algolia = GLOBAL_CONFIG.algolia;
  if (!(algolia.appId && algolia.apiKey && algolia.indexName)) {
    return console.error('Algolia setting is invalid!');
  }

  const search = instantsearch({
    indexName: algolia.indexName,
    searchClient: algoliasearch(algolia.appId, algolia.apiKey),
    searchFunction: (helper) => helper.state.query && helper.search(),
  });

  const configure = instantsearch.widgets.configure({ hitsPerPage: 5 });
  const searchBox = instantsearch.widgets.searchBox({
    container: '#algolia-search-input',
    showReset: false,
    showSubmit: true,
    searchAsYouType: false,
    placeholder: GLOBAL_CONFIG.algolia.languages.input_placeholder,
    showLoadingIndicator: true,
  });

  const hits = instantsearch.widgets.hits({
    container: '#algolia-hits',
    templates: {
      item: (data) => {
        const link = data.permalink || (GLOBAL_CONFIG.root + data.path);
        const content = data._highlightResult.contentStripTruncate
          ? cutContent(data._highlightResult.contentStripTruncate.value)
          : data._highlightResult.contentStrip
            ? cutContent(data._highlightResult.contentStrip.value)
            : data._highlightResult.content
              ? cutContent(data._highlightResult.content.value)
              : '';
        return `
          <a href="${link}" class="algolia-hit-item-link">${data._highlightResult.title.value || 'no-title'}</a>
          <p class="algolia-hit-item-content">${content}</p>`;
      },
      empty: (data) => `<div id="algolia-hits-empty">${GLOBAL_CONFIG.algolia.languages.hits_empty.replace(/\$\{query}/, data.query)}</div>`,
    },
  });

  const stats = instantsearch.widgets.stats({
    container: '#algolia-info > .algolia-stats',
    templates: {
      text: (data) => `<hr>${GLOBAL_CONFIG.algolia.languages.hits_stats.replace(/\$\{hits}/, data.nbHits).replace(/\$\{time}/, data.processingTimeMS)}`,
    },
  });

  const powerBy = instantsearch.widgets.poweredBy({ container: '#algolia-info > .algolia-poweredBy' });
  const pagination = instantsearch.widgets.pagination({
    container: '#algolia-pagination',
    totalPages: 5,
    templates: {
      first: '<i class="fas fa-angle-double-left"></i>',
      last: '<i class="fas fa-angle-double-right"></i>',
      previous: '<i class="fas fa-angle-left"></i>',
      next: '<i class="fas fa-angle-right"></i>',
    },
  });

  search.addWidgets([configure, searchBox, hits, stats, powerBy, pagination]);
  search.start();

  searchClickFn();
  searchClickFnOnce();

  window.addEventListener('pjax:complete', () => {
    if (getComputedStyle(document.querySelector('#algolia-search .search-dialog')).display === 'block') closeSearch();
    searchClickFn();
  });

  if (window.pjax) {
    search.on('render', () => window.pjax.refresh(document.getElementById('algolia-hits')));
  }
})();
