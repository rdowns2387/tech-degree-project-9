'use strict';

//Express and express router
const express = require('express');
const router = express.Router();

//body parser
const bodyParser = require('body-parser');

//import database and models
const db = require('./db');
const { Course, User } = db.models;

//encryption and authorization
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');


//ASYNC HANDLER
function asyncHandler(cb){
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err){
      err.status = 400;
      next(err);
    }
  }
}

// AUTHENTICATION MIDDLEWARE
const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  console.log(credentials);
  if(credentials){
    const user = await User.findOne({
      where: {emailAddress: credentials.name}
    })
    if (user){
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password)
      if(authenticated){
        req.currentUser = await User.findOne({
          where: {emailAddress: credentials.name}
        })
      } else {
        message = `Authentication error for email address: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if(message){
    res.status(401).json({message: 'Access Denied. ' + message })
  } else {
    next();
  }
}


// USER ROUTES

//This is the route that will get a list of users
router.get('/users', authenticateUser, (req, res) => {
  res.json(req.currentUser);
});

//This is the route that will create a new user
router.post('/users', asyncHandler(async(req, res) => {

  //validate mandatory information is in request
  const errors = [];
  const requestData = req.body

  if(!requestData.firstName){
    errors.push('You must provide a value for "firstName"');
  }
  if(!requestData.lastName){
    errors.push('You must provide a value for "lastName"');
  }
  if(!requestData.emailAddress){
    errors.push('You must provide a value for "emailAddress"');
  }
  if(!requestData.password){
    errors.push('You must provide a value for "password"');
  }

  console.log(errors);

  if(errors.length == 0){
    await User.create({
      firstName: requestData.firstName,
      lastName: requestData.lastName,
      emailAddress: requestData.emailAddress,
      //hash the password when user is created
      password: bcryptjs.hashSync(requestData.password)
    })

    res.status(201).location('/').end();
  } else {
    res.status(400).json({errors}).end();
  }
}));



// COURSES //

//this is the route that returns the list of courses
router.get('/courses', async (req, res, next) =>{
  console.log('this is the courses route');
  try {
    const courses = await Course.findAll({
      attributes: {
        include: ['id','title','description','estimatedTime','materialsNeeded'],
      },
      include: [{
        model: User,
        attributes: {
          include:['id','firstName','lastName','emailAddress'],
        }
      }]
    });
    res.status(200).json(courses);
  }
  catch (err) {
      next(err);
  }
});

//this route returns a single course
router.get('/courses/:id', async (req, res) => {
  console.log(`this is the single course route`);
  const course = await Course.findOne({
    include: [
      {model: User,
      attributes: [
        "id", "firstName", "lastName", "emailAddress"
        ]
      }
    ],
    where: {id: req.params.id},
  });
  res.json(course);
});

//this route posts new courses
router.post('/courses', authenticateUser, asyncHandler(async (req, res)=> {

  const errors = [];
  const requestData = req.body;

  if(!requestData.id){
    errors.push('You must have a value for the course id');
  }

  if(!requestData.description){
    errors.push('You must have a value for the course description');
  }

  if(errors.length == 0){
    const course = await Course.create({
      userId: requestData.userId,
      title: requestData.title,
      description: requestData.description,
      estimatedTime: requestData.estimatedTime,
      materialsNeed: requestData.materialsNeeded
    });
    res.status(201).location(`/courses/${course.id}`).status(201).end();
  } else {
    res.status(400).json({errors}).end();
  }
}));

//this route updates a course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) =>{

  //validate mandatory data is present
  const errors = [];
  const courseContent = req.body;
  console.log(courseContent);

  if(!courseContent.title){
    errors.push('You must provide a value for "title"');
  }
  if(!courseContent.description){
    errors.push('You must provide a value for "description"');
  }

  const course = await Course.findByPk(courseContent.id);

  if(errors.length == 0){
    await course.update({
      userId: courseContent.userId,
      title: courseContent.title,
      description: courseContent.description,
      estimatedTime: courseContent.estimatedTime,
      materialsNeeded: courseContent.materialsNeeded
    })
    res.status(204).end();
  } else {
    res.status(400).json({errors}).end();
  }
}));

//this route deletes a course
router.delete('/courses/:id', authenticateUser, async (req, res)=>{
  const course = await Course.findByPk(req.params.id);
  course.destroy();
  res.status(204).end();
  console.log('bye bye course');
})
module.exports = router;
