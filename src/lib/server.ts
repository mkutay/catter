import {
  deleteCommentAction,
  deleteGuestbookEntriesAction,
  getBlogViewsAction,
  getCommentsAction,
  getUser,
  getViewCountAction,
  incrementViewsAction,
  saveCommentAction,
  saveGuestbookEntryAction,
} from "./server-helper";

const Server = {
  Auth: {
    User: getUser,
  },
  Comments: {
    Save: saveCommentAction,
    Delete: deleteCommentAction,
    Get: getCommentsAction,
  },
  Views: {
    Get: getViewCountAction,
    Increment: incrementViewsAction,
    GetAll: getBlogViewsAction,
  },
  GuestBook: {
    Save: saveGuestbookEntryAction,
    Delete: deleteGuestbookEntriesAction,
  },
};

export default Server;
