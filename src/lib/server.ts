import {
  deleteCommentAction,
  deleteGuestbookEntriesAction,
  incrementViewsAction,
  saveCommentAction,
  saveGuestbookEntryAction,
} from "./server-helper";

const Server = {
  Comments: {
    Save: saveCommentAction,
    Delete: deleteCommentAction,
  },
  Views: {
    Increment: incrementViewsAction,
  },
  GuestBook: {
    Save: saveGuestbookEntryAction,
    Delete: deleteGuestbookEntriesAction,
  },
};

export default Server;
