const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();

let articles = []

// Use Heroku process environment MongoDB URI or default fallback
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
    articles = await Article.find().sort({
    createdAt: "desc",
  });
  res.render("articles/index", { articles: articles, content: "" });
});

app.get("/search", function(req, res) {
  const content = req.query.content.toLowerCase();
  
  let results = []
  articles.forEach(article => {
    const isVisible = article.title.toLowerCase().includes(content) || article.description.toLowerCase().includes(content)
    if(isVisible) results.push(article)
  })

  res.render("articles/index", { articles: results, content: content });
})

app.use("/articles", articleRouter);

// Use Heroku process environment Port settings or default fallback
const port = process.env.PORT || 5001;

app.listen(port);
