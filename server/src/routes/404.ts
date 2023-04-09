import express from "express"

const router = express.Router();

router.use(function(req, res, next) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      // res.sendFile("../../public/help.html");
      res.redirect("/docs/index.html");
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

module.exports = router;
