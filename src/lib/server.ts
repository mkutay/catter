import {
  getEmail,
  saveCommentAction,
  deleteCommentAction,
  getCommentsAction,
  getViewCountAction,
  incrementViewsAction,
  getBlogViewsAction,
  saveGuestbookEntryAction,
  deleteGuestbookEntriesAction
} from './server-helper';

const Server = {
  Auth: {
    Email: getEmail
  },
  Comments: {
    Save: saveCommentAction,
    Delete: deleteCommentAction,
    Get: getCommentsAction
  },
  Views: {
    Get: getViewCountAction,
    Increment: incrementViewsAction,
    GetAll: getBlogViewsAction
  },
  GuestBook: {
    Save: saveGuestbookEntryAction,
    Delete: deleteGuestbookEntriesAction
  }
};

export default Server;