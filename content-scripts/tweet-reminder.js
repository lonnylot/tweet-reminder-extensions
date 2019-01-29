function addTweetReminderButton() {
  document.querySelectorAll('.js-stream-tweet, .permalink-tweet').forEach((tweet) => {
    if (tweet.getAttribute('tweet-reminder-loaded')) {
      return;
    }

    let tweetReminderImage = document.createElement('img');
    tweetReminderImage.setAttribute('src', browser.extension.getURL('/icons/logo-32.png'));
    tweetReminderImage.setAttribute('style', 'display: block; height: 15px;');

    let tweetReminderButton = document.createElement('a');
    tweetReminderButton.setAttribute('href', 'https://tweet-reminder.nonstockproductions.com/home/?tweet_url=https://twitter.com'+tweet.getAttribute('data-permalink-path'))
    tweetReminderButton.setAttribute('target', 'tweet-remind-'+tweet.getAttribute('data-tweet-id'));
    tweetReminderButton.setAttribute('style', 'display: inline-block; height: 18px; vertical-align: middle;');
    tweetReminderButton.appendChild(tweetReminderImage);

    let actionElement = document.createElement('div');
    actionElement.classList = 'ProfileTweet-action';

    actionElement.appendChild(tweetReminderButton);
    tweet.querySelector('.ProfileTweet-actionList').appendChild(actionElement);

    tweet.setAttribute('tweet-reminder-loaded', true);
  });
}

addTweetReminderButton();

var tweetObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    addTweetReminderButton();
  });
});

function startTweetObserver(mutationObserver) {
  let element = document.getElementById('stream-items-id');
  if (element !== null) {
    mutationObserver.observe(element, {
      childList: true
    });
  }
}

function restartObserver(mutationObserver) {
  mutationObserver.disconnect();
  startTweetObserver(mutationObserver);
}

startTweetObserver(tweetObserver);

var pageContainerObserver = new MutationObserver((mutations) => {
  restartObserver(tweetObserver);
  addTweetReminderButton();
});

function startPageObserver(mutationObserver) {
  let element = document.getElementById('page-container');
  if (element !== null) {
    mutationObserver.observe(element, {
      childList: true
    });
  }
}

startPageObserver(pageContainerObserver);

var permalinkContainerObserver = new MutationObserver((mutations) => {
  restartObserver(tweetObserver);
  addTweetReminderButton();
});

function startPermalinkObserver(mutationObserver) {
  let element = document.getElementById('permalink-overlay-body');
  if (element !== null) {
    mutationObserver.observe(element, {
      childList: true
    });
  }
}

startPermalinkObserver(permalinkContainerObserver);
