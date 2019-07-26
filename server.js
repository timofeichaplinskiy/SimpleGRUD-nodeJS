const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://patrickisidoro:nuzor1539@ds133279.mlab.com:33279/crud-nodejs";

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err);
  db = client.db('crud-nodejs');

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
});

// Тип движка шаблона
app.set('view engine', 'ejs');

app.route('/')// устанавливаем маршрут и ниже действий, которые должны быть предприняты на этом маршруте
.get(function(req, res) {
  const cursor = db.collection('data').find();
  res.render('index.ejs')
})

.post((req, res) => {
  db.collection('data').save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log('Сохранено в базу данных');
    res.redirect('/show')
  })
});

app.route('/show')
.get((req, res) => {
  db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err);
    res.render('show.ejs', { data: results })
  })
});

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id;

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err);
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id;
  var name = req.body.name;
  var type = req.body.type;

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      type: type
    }
  }, (err, result) => {
    if (err) return res.send(err);
    res.redirect('/show');
    console.log('Обновлено в базе данных')
  })
});

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id;

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err);
    console.log('Удалено из базы данных!');
    res.redirect('/show')
  })
});
