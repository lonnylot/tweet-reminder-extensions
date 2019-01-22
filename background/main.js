/*global getAccessToken*/
const TWEET_REMINDER_HOSTNAME = "https://tweet-reminder.nonstockproductions.com";

function notifyUser(message) {
  browser.notifications.create({
    "type": "basic",
    "title": "Tweet Reminder",
    message
  });
}

function logError(error) {
  console.error(`Error: ${error}`);
}

browser.browserAction.onClicked.addListener(() => {
  return getStoredAccessToken().then((accessToken) => {
    if (accessToken === null) {
      getAccessToken()
        .then(() => {
          notifyUser("Reminders Enabled");
          triggerLoggedInEvent();
        })
        .catch(logError);
    } else {
      browser.tabs.create(
        {
          active: true,
          url: TWEET_REMINDER_HOSTNAME+'/home'
        }
      );
    }
  });
});

function triggerLoggedInEvent() {
  browser.browserAction.setIcon({
    path: {
      16: "icons/logo-16.png",
      32: "icons/logo-32.png"
    }
  });

  browser.alarms.create(
    "check-for-reminders",
    {
      delayInMinutes: 1,
      periodInMinutes: 10
    }
  );
}

function triggerLoggedOutEvent() {
  browser.browserAction.setIcon({
    path: {
      16: "icons/logo-error-16.png",
      32: "icons/logo-error-32.png"
    }
  });
  browser.alarms.clear().then(() => {});
  notifyUser("Reminders Disabled.");
  clearStoredAccessToken();
}

browser.alarms.onAlarm.addListener((alarm) => {
  getStoredAccessToken().then((accessToken) => {
    if (accessToken === null) {
      return;
    }

    fetch(`${TWEET_REMINDER_HOSTNAME}/api/notifications`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+accessToken,
        'X-Plugin-Version': 'Firefox Extionsion/'+browser.runtime.getManifest().version
      },
      mode: 'cors'
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((response) => {
      if (response != "undefined" && response.length) {
        let lastNotification = response[0];
        getStoredLastNotificationId().then((storedLastNotificationId) => {
          if (storedLastNotificationId != lastNotification.id) {
            storeLastNotificationId(lastNotification.id).then(() => {
              if (!lastNotification.read) {
                notifyUser("You have a new reminder!");
              }
            });
          }
        });
      }
    }).catch((error) => {
      triggerLoggedOutEvent();
      logError(error);
    });
  });
});

getStoredAccessToken().then((accessToken) => {
  if (accessToken !== null) {
    triggerLoggedInEvent();
  }
});
