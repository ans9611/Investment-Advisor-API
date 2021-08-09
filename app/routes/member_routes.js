const express = require('express')
const passport = require('passport')
// instantiate a router (mini app that only handles routes)
const router = express.Router()

// require member model
const Member = require('./../models/member')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })



// get index of members
router.get('/members', requireToken, (req, res, next) => {
	Member.find({ owner: req.user.id })
		.then(members => members.map(member => member.toObject()))
        //get respond with status 200 and Json of members
		.then(member => res.status(200).json({ member }))
		.catch(next)
})

// get one member
router.get('/members/:id', requireToken, (req, res, next) => {
	const id = req.params.id
	Member.findById(id)
		.then(handle404)
		.then(member => requireOwnership(req, member))
		.then(member => res.status(200).json({ member }))
		.catch(next)
})
// create member
router.post('/members', requireToken, (req, res, next) => {
	const memberData = req.body.member
	memberData.owner = req.user.id
	console.log("create route")
	Member.create(memberData)
		.then((member) => res.status(201).json({ member }))
		.catch(next)
})

// update member authenticated
router.patch('/members/:id', requireToken, removeBlanks, (req, res, next) => {
	// If try to change owner property, will delete
	// key/value pair
	delete req.body.member.owner
	const id = req.params.id
	Member.findById(id)
		.then(handle404)
		.then((member) => requireOwnership(req, member))
		.then((member) => {
			return member.updateOne(req.body.member)
		})
		.then((member) => res.status(200).json({ member }))
		.catch(next)
})

// delete member only if owned by signed in user
router.delete('/members/:id', requireToken, (req, res, next) => {
	const id = req.params.id
	Member.findById(id)
		.then(handle404)
		.then((member) => {
			requireOwnership(req, member)
			return member.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
