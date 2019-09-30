# The Sunday Champs

Our fantasy football league (which I begrudingly participate in to keep in touch with college friends) uses a system of ranking that differs from what ESPN proivdes, where you get one point for winning, and one point for being in the top half of scores for the week. Our league manager was hand calculating these numbers (bench points, if you were in the top half of scores, new playoff points), which is tedious and error-prone. I figured I could make a web-app that did it for us. So I did.

## Structure

Utilizes a Node.js backend with Express to serve static content built with React. Uses a [library for the ESPN Fantasy Football API](https://github.com/mkreiser/ESPN-Fantasy-Football-API). The data is cached, and accessed by the client via REST on page load. The server refreshes it's cache every two hours currently.  Deployed with Heroku, and live now! Click the link above to check it out.
