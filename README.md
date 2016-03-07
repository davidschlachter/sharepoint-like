# sharepoint-like
A simple back-end for a ‘Like’ button, written in NodeJS with MongoDB. Intended as an intranet implementation of a ‘Like’ button for situations where a Facebook login is not feasible. Can also store comments. Pretty much all input is converted to HTML entities to prevent code injection.

## Likes

The server accepts a POST (or JSONP GET) on `/like` with the following parameters:

- `userid` : The user name (e.g. "David Schlachter")
- `postid` : An identifier for the object being liked (I use the ID of an article in the database)
- `sitekey`: An identifier for the site/page. When the likes are queried, all likes for a given `sitekey` are returned (I use a random alphanumeric string)

This request returns a JSON object with all the likes for the given `sitekey`, so they can be displayed by the client.

The server also accepts a POST (or JSONP GET) on `/getLikes` with the `sitekey` parameter and returns a JSON object with all the likes for the given `sitekey`.

## Comments

The server accepts a POST (or JSONP GET) on `/comment` with the following parameters:

- `userid` : The user name (e.g. "David Schlachter")
- `postid` : An identifier for the object to which the comment pertains
- `sitekey` : An identifier for the site/page
- `commentText` : The text of the comment

The request returns a JSON object with the comments for the given `postid`.

The server returns a list of all comments with a POST or JSONP GET on `/getComments` for a given `sitekey`. A request on `/deleteComment` with a comment `_id`, a `sitekey`, and a `postid` will delete a comment and return the remaining comments (if any) for the `postid`.

### Implementation
In our implementation, ‘Like’ buttons are automatically generated for posts on a SharePoint 2010 page, as shown in the `html-examples` folder. We also set up comments for the posts.
