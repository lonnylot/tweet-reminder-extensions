const ACCESS_TOKEN_STORAGE_NAME = 'access_token';
const LAST_NOTIFICATION_ID_NAME = 'last_notification_id';

function storeAccessToken(accessToken) {
  browser.storage.local.set({
    [ACCESS_TOKEN_STORAGE_NAME]: accessToken
  }).then(function(items) {

  }, logError);

  // No need to wait for the storage to happen...we've got it
  return accessToken;
}

function getStoredAccessToken() {
  return browser.storage.local.get(ACCESS_TOKEN_STORAGE_NAME).then((items) => {
    if (typeof items[ACCESS_TOKEN_STORAGE_NAME] != "undefined") {
      return items[ACCESS_TOKEN_STORAGE_NAME];
    }

    return null;
  });
}

function clearStoredAccessToken() {
  return browser.storage.local.remove(ACCESS_TOKEN_STORAGE_NAME);
}

function storeLastNotificationId(notificationId) {
  return browser.storage.local.set({
    [LAST_NOTIFICATION_ID_NAME]: notificationId
  }).then(function(items) {

  }, logError);
}

function getStoredLastNotificationId() {
  return browser.storage.local.get(LAST_NOTIFICATION_ID_NAME).then((items) => {
    if (typeof items[LAST_NOTIFICATION_ID_NAME] != "undefined") {
      return items[LAST_NOTIFICATION_ID_NAME];
    }

    return null;
  });
}
