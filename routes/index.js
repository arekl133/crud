var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { check, validationResult } = require('express-validator');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  
});


/* GET form */
router.get('/form', async function(req, res, next) {
  const id = req.query.id;
  let list;
  if (id) {
    list = await req.db.db('list')
        .collection('listtab')
        .findOne(ObjectId(id));
  } else {
    list = {
      Name: ""
    }
  }
  res.render('form', { title: 'Edytuj drużynę', list: list });
});





/* POST team */
router.post('/form', async function (req, res, next)  {
  
  try{
    let list = {
      _id: req.body._id ? ObjectId(req.body._id) : undefined,
      Name: req.body.list_name,
      Surname: req.body.list_surname,
      Adres: req.body.list_adres,
      Age: req.body.list_age,
      WorkPlace: req.body.list_workplace,
      Specialization: req.body.list_spec
    };
    if(list._id){
      await req.db.db('list').collection('listtab').replaceOne({_id: list._id}, list);
  } else {
    await req.db.db('list').collection('listtab').insertOne(list);
  }
    res.redirect('/table');
  }catch (err){
    console.error(err);

  }
});

  





/* GET teams. */
router.get('/table', async function(req, res, next) {
  const pageSize = 3;
  let sort = parseInt(req.query.sort);
  sort = sort ? sort : 1;
  
  const count = await req.db.db('list')
      .collection('listtab')
      .count({});
   
  const maxPage = Math.floor(count / pageSize);
  let page = parseInt(req.query.page);
  page = page >= 0 ? page : 0;
  page = page <= maxPage ? page : maxPage;
  const prevPage = page > 0 ? page -1 : 0;
  const nextPage = page < maxPage ? page +1 : maxPage;

  let query = req.query.query || '';
  let field = req.query.field || 'Name'; // Domyślne pole wyszukiwania to 'Name'

  const searchCriteria = {
    [field]: { $regex: query, $options: 'i' } // Wykorzystanie dynamicznego klucza obiektu
  };


  const list = await req.db.db('list')
      .collection('listtab')
      .find(searchCriteria) // Użycie zmiennej searchCriteria do wyszukiwania po wybranym polu
      .collation({
        locale: 'pl'
      })
      .sort([field, sort]) // Sortowanie po wybranym polu
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
  res.render('table', { 
    title: 'pracownicy', 
    list: list, 
    sort: sort, 
    page: page + 1,
    nextPage: nextPage,
    prevPage: prevPage,
    count: count -1,
    query: query // Przekazanie wartości parametru 'query' do szablonu, aby zachować wprowadzone zapytanie na stronie
   });
});

/* DELETE team */
router.get('/form-delete', async function (req, res, next) {
  try {
    let id = req.query.id;
    await req.db.db('list')
    .collection("listtab")
    .findOneAndDelete({_id: ObjectId(id)});
    res.redirect('/form');
  } catch (err) {
    console.error(err);
  }
  //next();
});














module.exports = router;
