# sharepoint-like
A simple back-end for a ‘Like’ button, written in NodeJS with MongoDB. Intended as an intranet implementation of a ‘Like’ button for situations where a Facebook login is not feasible.

The server accepts a POST on `/like` with the following parameters:

- `userid` : The user name (e.g. "David Schlachter")
- `postid` : An identifier for the object being liked (I use the post titles without spaces)
- `sitekey`: An identifier for the site/page. When the likes are queried, all likes for a given `sitekey` are returned (I use a random alphanumeric string)

This request returns a JSON object with all the likes for the given `sitekey`, so they can be displayed by the client.

The server also accepts a POST on `/getLikes` with the `sitekey` parameter and returns a JSON object with all the likes for the given `sitekey`.

All parameters only accept a certain subset of alphanumeric characters, with some punctuation allowed (apostrophes, commas).

### Implementation
In our implementation, ‘Like’ buttons are automatically generated for posts on a SharePoint 2010 page, as shown in the `html-examples` folder.
